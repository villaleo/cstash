package models

import (
	"slices"
	"time"

	"github.com/google/uuid"
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
		ID:         uuid.New().String(),
		Title:      title,
		Content:    content,
		Language:   language,
		Tags:       []string{},
		CreatedAt:  now,
		UpdatedAt:  now,
		IsFavorite: false,
	}
}

// AddTag adds a tag to the snippet if it doesn't already exist
func (s *Snippet) AddTag(tag string) {
	if slices.Contains(s.Tags, tag) {
		return
	}
	s.Tags = append(s.Tags, tag)
	s.UpdatedAt = time.Now()
}

// RemoveTag removes a tag from the snippet
func (s *Snippet) RemoveTag(tag string) {
	for i, t := range s.Tags {
		if t == tag {
			s.Tags = slices.Delete(s.Tags, i, i+1)
			s.UpdatedAt = time.Now()

			return
		}
	}
}

// ToggleFavorite toggles the favorite status of a snippet
func (s *Snippet) ToggleFavorite() {
	s.IsFavorite = !s.IsFavorite
	s.UpdatedAt = time.Now()
}
