package api

import (
	"net/http"

	"github.com/villaleo/cstash/internal/storage"
	"go.uber.org/zap"
)

// SnippetHandler handles tag-related API requests
type TagHandler struct {
	store  *storage.MemoryStore
	logger *zap.Logger
}

// NewTagHandler creates a new tag handler
func NewTagHandler(store *storage.MemoryStore, logger *zap.Logger) *TagHandler {
	return &TagHandler{
		store:  store,
		logger: logger.Named("tags"),
	}
}

// Logger simply returns this handler's logger. This method is implemented to
// satisfy logHandler.
func (h *TagHandler) Logger() *zap.Logger {
	return h.logger
}

// RegisterRoutes registers the tag API routes
func (h *TagHandler) RegisterRoutes(mux *http.ServeMux) {
	mux.HandleFunc("GET /api/v1/tags", h.ListTags)
}

// ListTags handles listing all tags
func (h *TagHandler) ListTags(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Content-Type", "application/json")

	var (
		sugar = h.logger.Sugar()
		tags  = h.store.ListTags()
	)

	sugar.Debugw("fetched tags", "count", len(tags))

	encodeJSON(h, w, tags)
}
