package models

// Talk representa uma palestra do evento disponível para votação.
type Talk struct {
	Slug        string `json:"slug"`
	Title       string `json:"title"`
	Speaker     string `json:"speaker"`
	Description string `json:"description"`
}
