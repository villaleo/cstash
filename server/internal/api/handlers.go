package api

import (
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/villaleo/cstash/internal/auth"
	"github.com/villaleo/cstash/internal/models"
	"github.com/villaleo/cstash/internal/storage"
	"go.uber.org/zap"
)

var (
	ErrInternal = errors.New("an internal server error occurred")
)

// SnippetHandler handles snippet-related API requests
type SnippetHandler struct {
	store  *storage.MemoryStore
	logger *zap.Logger
}

// NewSnippetHandler creates a new snippet handler
func NewSnippetHandler(store *storage.MemoryStore, logger *zap.Logger) *SnippetHandler {
	return &SnippetHandler{
		store,
		logger,
	}
}

// Logger simply returns this handler's logger. This method is implemented to
// satisfy LogHandler.
func (h *SnippetHandler) Logger() *zap.Logger {
	return h.logger
}

// RegisterRoutes registers the snippet API routes
func (h *SnippetHandler) RegisterRoutes(mux *http.ServeMux) {
	mux.HandleFunc("POST /api/v1/snippets", h.CreateSnippet)
	mux.HandleFunc("GET /api/v1/snippets", h.ListSnippets)
	mux.HandleFunc("GET /api/v1/snippets/{id}", h.GetSnippet)
	mux.HandleFunc("PUT /api/v1/snippets/{id}", h.UpdateSnippet)
	mux.HandleFunc("DELETE /api/v1/snippets/{id}", h.DeleteSnippet)
	mux.HandleFunc("GET /api/v1/snippets/search", h.SearchSnippets)
}

// CreateSnippet handles creating a new snippet
func (h *SnippetHandler) CreateSnippet(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application.json")

	var (
		newSnippet models.Snippet
		sugar      = h.logger.Sugar()
		response   map[string]any
	)

	if err := decodeInto(r.Body, &newSnippet); err != nil {
		e := fmt.Errorf("bad request: %w", err)
		sugar.Debug(e)
		http.Error(w, e.Error(), http.StatusBadRequest)

		return
	}

	// Ensure the new snippet is assigned an ID and the times are set
	newSnippet.ID = auth.NewSecureID()
	newSnippet.CreatedAt = time.Now()
	newSnippet.UpdatedAt = time.Now()

	if err := h.store.CreateSnippet(&newSnippet); err != nil {
		sugar.Error(err)
		http.Error(w, ErrInternal.Error(), http.StatusInternalServerError)

		return
	}

	sugar.Debugw("snippet created", "snippet.id", newSnippet.ID)
	w.WriteHeader(http.StatusCreated)

	response = map[string]any{
		"id": newSnippet.ID,
	}

	encodeJSON(h, w, response)
}

// ListSnippets handles listing all snippets with optional tag filtering
func (h *SnippetHandler) ListSnippets(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var (
		tagsQuery = r.URL.Query()["tags"]
		results   []*models.Snippet
		sugar     = h.logger.Sugar()
	)

	results = h.store.ListSnippets(tagsQuery)

	// If no results were returned from a non-nil query, send a 404 status code
	if results == nil && tagsQuery != nil {
		w.WriteHeader(http.StatusNotFound)
	}

	sugar.Debugw("fetched snippets", "count", len(results), "withTags", tagsQuery)

	encodeJSON(h, w, results)
}

// GetSnippet handles retrieving a snippet by ID
func (h *SnippetHandler) GetSnippet(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var (
		snippetId = r.PathValue("id")
		sugar     = h.logger.Sugar()
	)

	snippet, err := h.store.GetSnippet(snippetId)

	if err != nil {
		switch {
		case errors.Is(err, storage.ErrSnippetNotFound):
			sugar.Debug(err.Error())
			http.Error(w, err.Error(), http.StatusNotFound)

			return
		default:
			sugar.Error(err)
			http.Error(w, ErrInternal.Error(), http.StatusInternalServerError)

			return
		}
	}

	sugar.Debugw("fetched snippet", "count", 1)

	encodeJSON(h, w, snippet)
}

// UpdateSnippet handles updating an existing snippet
func (h *SnippetHandler) UpdateSnippet(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Content-Type", "application/json")

	var (
		snippetId = r.PathValue("id")
		updates   = make(map[string]any, 10)
		err       error
		sugar     = h.logger.Sugar()
	)

	if err := decodeInto(r.Body, &updates); err != nil {
		http.Error(w, ErrInternal.Error(), http.StatusInternalServerError)
		sugar.Error(err)

		return
	}

	snippet, err := h.store.UpdateSnippet(snippetId, updates)
	if err != nil {
		switch {
		case errors.Is(err, storage.ErrSnippetNotFound):
			sugar.Debug(err)
			http.Error(w, err.Error(), http.StatusNotFound)

			return
		default:
			sugar.Error(err)
			http.Error(w, ErrInternal.Error(), http.StatusInternalServerError)

			return
		}
	}

	snippet.ID = snippetId
	snippet.UpdatedAt = time.Now()

	sugar.Debugw("finished updating", "snippet.id", snippetId)

	encodeJSON(h, w, snippet)
}

// DeleteSnippet handles deleting a snippet
func (h *SnippetHandler) DeleteSnippet(w http.ResponseWriter, r *http.Request) {
	var (
		id    = r.PathValue("id")
		sugar = h.logger.Sugar()
	)

	if err := h.store.DeleteSnippet(id); err != nil {
		switch {
		case errors.Is(err, storage.ErrSnippetNotFound):
			sugar.Debugw(err.Error())
			http.Error(w, err.Error(), http.StatusNotFound)

			return
		default:
			sugar.Error(err)
			http.Error(w, ErrInternal.Error(), http.StatusInternalServerError)

			return
		}
	}

	sugar.Debugw("snippet deleted", "snippet.id", id)
	w.WriteHeader(http.StatusNoContent)
}

// SearchSnippets handles searching snippets
func (h *SnippetHandler) SearchSnippets(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var (
		query   = r.URL.Query().Get("q")
		results []*models.Snippet
		sugar   = h.logger.Sugar()
	)

	results = h.store.SearchSnippets(query)

	if results == nil && query != "" {
		err := errors.New("snippets not found")
		sugar.Debugw(err.Error(), "query", query)
		http.Error(w, err.Error(), http.StatusNotFound)

		return
	}

	sugar.Debugw("fetched snippets", "count", len(results))

	encodeJSON(h, w, results)
}
