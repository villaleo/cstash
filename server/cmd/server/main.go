package main

import (
	"errors"
	"flag"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
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
	defer syncLogger(logger)

	var (
		store          = storage.NewMemoryStore(logger)
		snippetHandler = api.NewSnippetHandler(store, logger)
		mux            = http.NewServeMux()
	)

	snippetHandler.RegisterRoutes(mux)

	// Wrap mux with global-level middleware
	handler := corsMiddleware(logRequestsMiddleware(mux, logger))

	server := &http.Server{
		Addr:         fmt.Sprintf(":%d", *_port),
		Handler:      handler,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  120 * time.Second,
	}

	runServer(server, logger)
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

func runServer(server *http.Server, logger *zap.Logger) {
	var (
		sugar         = logger.Sugar()
		interruptChan = make(chan os.Signal, 1)
		serverErrChan = make(chan error, 1)
	)

	sugar.Infof("server started on port %d", *_port)

	// Relay interrupt signals to interruptChan
	signal.Notify(interruptChan, os.Interrupt, syscall.SIGTERM)

	run := func() {
		// ListenAndServe will always return a non-nil error
		if err := server.ListenAndServe(); errors.Is(err, http.ErrServerClosed) {
			serverErrChan <- err
		}
		close(serverErrChan)
	}

	go run()

	// Block until either the server is interrupted or receives an error
	select {
	case <-interruptChan:
		sugar.Info("server stopped")
		os.Exit(0)
	case err := <-serverErrChan:
		sugar.Errorf("server received an error: %s", err)
		os.Exit(1)
	}
}

// syncLogger flushes any unclosed files
func syncLogger(logger *zap.Logger) {
	if err := logger.Sync(); err != nil {
		fmt.Fprintf(os.Stderr, "failed to sync logger: %s", err)
	}
}
