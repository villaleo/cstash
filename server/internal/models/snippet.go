package models

import (
	"slices"
	"time"

	"github.com/villaleo/cstash/internal/auth"
)

// Snippet represents a code snippet with metadata
type Snippet struct {
	ID          string    `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Content     string    `json:"content"`
	Language    string    `json:"language"`
	Tags        []string  `json:"tags"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
	IsFavorite  bool      `json:"isFavorite"`
}

// NewSnippet creates a new snippet with default values
func NewSnippet(title, content, language string) *Snippet {
	now := time.Now()
	return &Snippet{
		ID:         auth.NewSecureID(),
		Title:      title,
		Content:    content,
		Language:   language,
		Tags:       []string{},
		CreatedAt:  now,
		UpdatedAt:  now,
		IsFavorite: false,
	}
}

// AddTags adds tags to the snippet. Duplicate tags are not allowed
func (s *Snippet) AddTags(tags ...string) {
	for _, tag := range tags {
		if slices.Contains(s.Tags, tag) {
			continue
		}

		s.Tags = append(s.Tags, tag)
		s.UpdatedAt = time.Now()
	}
}

// RemoveTags removes tags from the snippet.
func (s *Snippet) RemoveTags(tags ...string) {
	deleteFn := func(tag string) bool {
		ok := slices.Contains(tags, tag)

		if ok {
			s.UpdatedAt = time.Now()
		}

		return ok
	}

	s.Tags = slices.DeleteFunc(s.Tags, deleteFn)
}

// ToggleFavorite toggles the favorite status of a snippet
func (s *Snippet) ToggleFavorite() {
	s.IsFavorite = !s.IsFavorite
	s.UpdatedAt = time.Now()
}
