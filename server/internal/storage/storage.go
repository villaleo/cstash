package storage

import (
	"errors"
	"strings"
	"sync"
	"time"

	"slices"

	"github.com/villaleo/cstash/internal/models"
)

var (
	ErrSnippetNotFound = errors.New("snippet not found")
)

// MemoryStore represents an in-memory storage solution for snippets
type MemoryStore struct {
	snippets map[string]*models.Snippet
	mutex    sync.RWMutex
}

// NewMemoryStore creates a new in-memory store
func NewMemoryStore() *MemoryStore {
	return &MemoryStore{
		snippets: make(map[string]*models.Snippet),
	}
}

// CreateSnippet adds a new snippet to the store
func (s *MemoryStore) CreateSnippet(snippet *models.Snippet) error {
	s.mutex.Lock()
	defer s.mutex.Unlock()

	s.snippets[snippet.ID] = snippet

	return nil
}

// GetSnippet retrieves a snippet by ID
func (s *MemoryStore) GetSnippet(id string) (*models.Snippet, error) {
	s.mutex.RLock()
	defer s.mutex.RUnlock()

	snippet, ok := s.snippets[id]
	if !ok {
		return nil, ErrSnippetNotFound
	}

	return snippet, nil
}

// UpdateSnippet updates an existing snippet
func (s *MemoryStore) UpdateSnippet(id string, updates map[string]any) (*models.Snippet, error) {
	s.mutex.Lock()
	defer s.mutex.Unlock()

	snippet, ok := s.snippets[id]
	if !ok {
		return nil, ErrSnippetNotFound
	}

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

	if tags, ok := updates["tags"].([]string); ok {
		snippet.Tags = tags
	}

	if isFavorite, ok := updates["isFavorite"].(bool); ok {
		snippet.IsFavorite = isFavorite
	}

	snippet.UpdatedAt = time.Now()

	return snippet, nil
}

// DeleteSnippet removes a snippet from the store
func (s *MemoryStore) DeleteSnippet(id string) error {
	s.mutex.Lock()
	defer s.mutex.Unlock()

	if _, ok := s.snippets[id]; !ok {
		return ErrSnippetNotFound
	}

	delete(s.snippets, id)

	return nil
}

// ListSnippets returns all snippets, optionally filtered by tags
func (s *MemoryStore) ListSnippets(tags []string) []*models.Snippet {
	s.mutex.RLock()
	defer s.mutex.RUnlock()

	var results []*models.Snippet

	if len(tags) == 0 {
		// Return all snippets if no tags are specified
		results = make([]*models.Snippet, 0, len(s.snippets))
		for _, snippet := range s.snippets {
			results = append(results, snippet)
		}

		return results
	}

	// Filter snippets by tags
	for _, snippet := range s.snippets {
		if hasAnyTag(snippet, tags) {
			results = append(results, snippet)
		}
	}

	return results
}

// SearchSnippets searches snippets by title or content
func (s *MemoryStore) SearchSnippets(query string) []*models.Snippet {
	s.mutex.RLock()
	defer s.mutex.RUnlock()

	var results []*models.Snippet

	// Simple substring search
	for _, snippet := range s.snippets {
		if containsIgnoreCase(snippet.Title, query) ||
			containsIgnoreCase(snippet.Content, query) ||
			containsIgnoreCase(snippet.Description, query) {
			results = append(results, snippet)
		}
	}

	return results
}

// hasAnyTag reports whether snippet contains any matching tags
func hasAnyTag(snippet *models.Snippet, tags []string) bool {
	for _, searchTag := range tags {
		if slices.Contains(snippet.Tags, searchTag) {
			return true
		}
	}

	return false
}

// containsIgnoreCase reports whether text contains substr, ignoring casing
func containsIgnoreCase(text, substr string) bool {
	return strings.Contains(strings.ToLower(text), strings.ToLower(substr))
}
