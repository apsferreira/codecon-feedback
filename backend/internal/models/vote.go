package models

import "time"

// Vote representa um voto anônimo registrado para uma talk.
// Nenhum dado de identidade do votante é persistido, por design.
type Vote struct {
	ID        string    `json:"id"`
	TalkSlug  string    `json:"talk_slug"`
	Rating    int       `json:"rating"`
	Comment   *string   `json:"comment,omitempty"`
	CreatedAt time.Time `json:"created_at"`
}

// VoteInput é o payload aceito por POST /api/talks/:slug/votes.
type VoteInput struct {
	Rating  int     `json:"rating" validate:"min=1,max=5"`
	Comment *string `json:"comment" validate:"omitempty,max=1000"`
}

// TalkStats são as estatísticas agregadas de votos de uma talk.
type TalkStats struct {
	TalkSlug      string  `json:"talk_slug"`
	AverageRating float64 `json:"average_rating"`
	TotalVotes    int     `json:"total_votes"`
}

// CommentEntry é um item do feed de comentários exibido na tela de resultado.
type CommentEntry struct {
	Rating    int       `json:"rating"`
	Comment   string    `json:"comment"`
	CreatedAt time.Time `json:"created_at"`
}
