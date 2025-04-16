package main

import (
	"flag"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/villaleo/cstash/internal/api"
	"github.com/villaleo/cstash/internal/storage"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

var _port = flag.Int("port", 8080, "port to listen on")

func main() {
	flag.Parse()

	logger, err := configureLogger()
	if err != nil {
		fmt.Fprintf(os.Stderr, "failed to configure logger: %s\n", err)
		os.Exit(1)
	}
	defer func() {
		if err := logger.Sync(); err != nil {
			fmt.Fprintf(os.Stderr, "failed to sync logger: %s", err)
		}
	}()

	var (
		store          = storage.NewMemoryStore()
		snippetHandler = api.NewSnippetHandler(store, logger)
		mux            = http.NewServeMux()
		sugar          = logger.Sugar()
	)

	snippetHandler.RegisterRoutes(mux)

	// Wrap mux with global-level middleware
	handler := corsMiddleware(logRequestsMiddleware(mux, logger))

	server := http.Server{
		Addr:         fmt.Sprintf(":%d", *_port),
		Handler:      handler,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  120 * time.Second,
	}

	sugar.Infof("server started on port %d", *_port)

	err = server.ListenAndServe()
	sugar.Infow("server stopped", "error", err)
}

// configureLogger creates a new ready-to-use logger
func configureLogger() (*zap.Logger, error) {
	// Define level-handling logic
	highPriority := zap.LevelEnablerFunc(func(lvl zapcore.Level) bool {
		return lvl >= zapcore.ErrorLevel
	})
	lowPriority := zap.LevelEnablerFunc(func(lvl zapcore.Level) bool {
		return lvl < zapcore.ErrorLevel
	})

	// High-priority output should go to standard error, and low-priority
	// output should go to standard out
	consoleDebugging := zapcore.Lock(os.Stdout)
	consoleErrors := zapcore.Lock(os.Stderr)

	// Optimize the console output for human operators
	cfg := zap.NewDevelopmentEncoderConfig()
	consoleEncoder := zapcore.NewConsoleEncoder(cfg)

	core := zapcore.NewTee(
		zapcore.NewCore(consoleEncoder, consoleErrors, highPriority),
		zapcore.NewCore(consoleEncoder, consoleDebugging, lowPriority),
	)

	return zap.New(core), nil
}

// corsMiddleware adds CORS headers to allow cross-origin requests
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Allow requests from any origin
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		// Handle preflight requests
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// logRequestsMiddleware logs each request's method and path to logger
func logRequestsMiddleware(next http.Handler, logger *zap.Logger) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		sugar := logger.Sugar()
		sugar.Infow("received request", "method", r.Method, "path", r.URL.Path)
		next.ServeHTTP(w, r)
	})
}
