package auth

import (
	"crypto/rand"
	"encoding/base64"
	"slices"
	"strings"
)

// NewSecureID creates a new random, cryptographically secure ID
func NewSecureID() string {
	var (
		data        [8]byte
		encodedData string
		result      strings.Builder
	)

	_, _ = rand.Read(data[:])
	encodedData = base64.StdEncoding.EncodeToString(data[:])

	// Remove symbols from the generated ID
	removeSet := []rune{'+', '/', '='}

	for _, r := range encodedData {
		if slices.Contains(removeSet, r) {
			continue
		}
		result.WriteRune(r)
	}

	return result.String()
}
