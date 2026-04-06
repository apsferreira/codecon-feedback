package domain

import "time"

// Vote representa um voto em uma palestra.
type Vote struct {
	ID        string    `json:"id"`
	TalkSlug  string    `json:"talk_slug"`
	Rating    int       `json:"rating"`
	Comment   string    `json:"comment"`
	CreatedAt time.Time `json:"created_at"`
}

// VoteRequest é o payload de entrada para criação de voto.
type VoteRequest struct {
	TalkSlug string `json:"talk_slug" validate:"required,max=100"`
	Rating   int    `json:"rating"    validate:"required,min=1,max=5"`
	Comment  string `json:"comment"   validate:"max=1000"`
}

// VoteStats agrupa estatísticas de uma palestra.
type VoteStats struct {
	TalkSlug      string         `json:"talk_slug"`
	TalkTitle     string         `json:"talk_title"`
	Total         int            `json:"total"`
	AverageRating float64        `json:"average_rating"`
	Distribution  map[string]int `json:"distribution"`
}
