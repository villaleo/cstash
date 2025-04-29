package storage

import (
	"errors"
	"maps"
	"strings"
	"sync"
	"time"

	"slices"

	"github.com/villaleo/cstash/internal/models"
	"go.uber.org/zap"
)

var (
	ErrSnippetNotFound = errors.New("snippet not found")
)

// MemoryStore represents an in-memory storage solution for snippets
type MemoryStore struct {
	snippets   map[string]*models.Snippet
	snippetsMu sync.RWMutex
	tags       map[string]int
	tagsMu     sync.RWMutex
	logger     *zap.Logger
}

// NewMemoryStore creates a new in-memory store
func NewMemoryStore(logger *zap.Logger) *MemoryStore {
	logger.Sugar().Debug("memory store initialized")

	return &MemoryStore{
		snippets: make(map[string]*models.Snippet),
		tags:     make(map[string]int),
		logger:   logger.Named("store"),
	}
}

// CreateSnippet adds a new snippet to the store
func (s *MemoryStore) CreateSnippet(snippet *models.Snippet) error {
	s.snippetsMu.Lock()
	defer s.snippetsMu.Unlock()

	s.CreateTags(snippet.Tags...)

	s.logger.Sugar().Debugw("snippet saved", "snippet.id", snippet.ID)
	s.snippets[snippet.ID] = snippet

	return nil
}

// GetSnippet retrieves a snippet by ID
func (s *MemoryStore) GetSnippet(id string) (*models.Snippet, error) {
	sugar := s.logger.Sugar()

	s.snippetsMu.RLock()
	defer s.snippetsMu.RUnlock()

	snippet, ok := s.snippets[id]
	if !ok {
		sugar.Debugw("snippet not found", "snippet.id", id)
		return nil, ErrSnippetNotFound
	}

	sugar.Debugw("snippet retreived", "snippet.id", snippet.ID)

	return snippet, nil
}

// UpdateSnippet updates an existing snippet
func (s *MemoryStore) UpdateSnippet(id string, updates map[string]any) (*models.Snippet, error) {
	sugar := s.logger.Sugar()

	s.snippetsMu.Lock()
	defer s.snippetsMu.Unlock()

	snippet, ok := s.snippets[id]
	if !ok {
		sugar.Debugw("snippet not found", "snippet.id", id)
		return nil, ErrSnippetNotFound
	}

	sugar.Debugw("updating snippet", "snippet.id", id, "updates", updates)

	if title, ok := updates["title"].(string); ok {
		snippet.Title = title
	}

	if description, ok := updates["description"].(string); ok {
		snippet.Description = description
	}

	if content, ok := updates["content"].(string); ok {
		snippet.Content = content
	}

	if language, ok := updates["language"].(string); ok {
		snippet.Language = language
	}

	// Check for the interface{} first, then type cast to []string
	if tagsInterface, ok := updates["tags"]; ok {
		if tagsSlice, ok := tagsInterface.([]any); ok {
			tags := make([]string, len(tagsSlice))
			for i, t := range tagsSlice {
				if str, ok := t.(string); ok {
					tags[i] = str
				}
			}

			s.updateTags( /* old tags */ snippet.Tags /* new tags */, tags)
			snippet.Tags = tags
		}
	}

	if isFavorite, ok := updates["isFavorite"].(bool); ok {
		snippet.IsFavorite = isFavorite
	}

	snippet.UpdatedAt = time.Now()
	sugar.Debugw("snippet updated", "snippet.id", snippet.ID, "updates", updates)

	return snippet, nil
}

// DeleteSnippet removes a snippet from the store
func (s *MemoryStore) DeleteSnippet(id string) error {
	sugar := s.logger.Sugar()

	s.snippetsMu.Lock()
	defer s.snippetsMu.Unlock()

	snippet, ok := s.snippets[id]
	if !ok {
		sugar.Debugw("snippet not found", "snippet.id", id)
		return ErrSnippetNotFound
	}

	s.DeleteTags(snippet.Tags...)

	sugar.Debugw("deleted snippet", "snippet.id", id)
	delete(s.snippets, id)

	return nil
}

// ListSnippets returns all snippets, optionally filtered by tags or a query
func (s *MemoryStore) ListSnippets(tags []string, query string) []*models.Snippet {
	s.snippetsMu.RLock()
	defer s.snippetsMu.RUnlock()

	var (
		results = make([]*models.Snippet, 0, len(s.snippets))
		sugar   = s.logger.Sugar()
	)

	// Sanitize the search query
	query = strings.ToLower(strings.TrimSpace(query))

	if tags == nil && query == "" {
		return slices.Collect(maps.Values(s.snippets))
	}

	for _, snippet := range s.snippets {
		if hasAnyTag(snippet, tags) {
			results = append(results, snippet)
			continue
		}

		if anyFieldContainsQuery(snippet, query) {
			results = append(results, snippet)
			continue
		}
	}

	sugar.Debugw("fetched snippets", "count", len(results), "tags", tags, "query", query)

	return results
}

// CreateTags adds new tags to the store, incrementing its reference counter by 1
func (s *MemoryStore) CreateTags(tags ...string) {
	s.tagsMu.Lock()
	defer s.tagsMu.Unlock()

	for _, tag := range tags {
		if _, ok := s.tags[tag]; !ok {
			s.tags[tag] += 1
			s.logger.Sugar().Debugw("tag saved", "tag", tag)
		}
	}
}

// ListTags fetches all tags in the store with a valid reference count
func (s *MemoryStore) ListTags() []string {
	s.tagsMu.RLock()
	defer s.tagsMu.RUnlock()

	var (
		sugar   = s.logger.Sugar()
		results = []string{}
	)

	for key, value := range s.tags {
		if value >= 1 {
			results = append(results, key)
		}
	}

	sugar.Debugw("fetched tags", "count", len(results))

	return results
}

// DeleteTags deletes tags with a non-zero reference count. If a tag is
// references by at least one or more snippets, it won't be deleted
func (s *MemoryStore) DeleteTags(tag ...string) {
	s.tagsMu.Lock()
	defer s.tagsMu.Unlock()

	for tag, count := range s.tags {
		// Decrement a tag's reference counter if it has a non-zero reference count
		if count >= 1 {
			s.tags[tag]--

			return
		}

		delete(s.tags, tag)
	}
}

// updateTags updates tags depending on the differences between old and changes.
//
// If a value is in changes and not in old, then the tag will be added to the
// store. Otherwise, if a value is not in changes and in old, then the tag will
// be removed.
func (s *MemoryStore) updateTags(old, changes []string) {
	s.tagsMu.Lock()
	defer s.tagsMu.Unlock()

	var (
		oldSet            = make(map[string]struct{})
		changeSet         = make(map[string]struct{})
		markedForDeletion = []string{}
	)

	// Create a set from the old set of tags
	for _, tag := range old {
		oldSet[tag] = struct{}{}
	}

	// Create a set from the new tag changes
	for _, change := range changes {
		changeSet[change] = struct{}{}
	}

	for tag := range oldSet {
		// If a tag is in old but not in changes, then it will be removed
		if _, ok := changeSet[tag]; !ok {
			markedForDeletion = append(markedForDeletion, tag)
		} else {
			s.CreateTags(tag)
		}
	}

	s.DeleteTags(markedForDeletion...)
}

// hasAnyTag reports whether snippet contains any tags
func hasAnyTag(snippet *models.Snippet, tags []string) bool {
	for _, searchTag := range tags {
		if slices.Contains(snippet.Tags, searchTag) {
			return true
		}
	}

	return false
}

// anyFieldContainsQuery reports whether any field in snippet contains query
func anyFieldContainsQuery(snippet *models.Snippet, query string) bool {
	if query == "" {
		return false
	}

	return containsIgnoreCase(snippet.Title, query) ||
		containsIgnoreCase(snippet.Content, query) ||
		containsIgnoreCase(snippet.Description, query) ||
		containsIgnoreCase(snippet.Language, query)
}

// containsIgnoreCase reports whether text contains substr, ignoring casing
func containsIgnoreCase(text, substr string) bool {
	return strings.Contains(strings.ToLower(text), strings.ToLower(substr))
}
