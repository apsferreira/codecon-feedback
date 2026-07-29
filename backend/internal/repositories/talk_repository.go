package repositories

import (
	"context"
	"errors"
	"fmt"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"codecon-feedback/backend/internal/models"
)

// ErrTalkNotFound é retornado quando a talk referenciada não existe.
var ErrTalkNotFound = errors.New("talk não encontrada")

type TalkRepository struct {
	pool *pgxpool.Pool
}

func NewTalkRepository(pool *pgxpool.Pool) *TalkRepository {
	return &TalkRepository{pool: pool}
}

// List retorna todas as talks cadastradas.
func (r *TalkRepository) List(ctx context.Context) ([]models.Talk, error) {
	rows, err := r.pool.Query(ctx, `
		SELECT slug, title, speaker, description
		FROM talks
		ORDER BY display_order, slug
	`)
	if err != nil {
		return nil, fmt.Errorf("falha ao listar talks: %w", err)
	}
	defer rows.Close()

	talks := make([]models.Talk, 0)
	for rows.Next() {
		var t models.Talk
		if err := rows.Scan(&t.Slug, &t.Title, &t.Speaker, &t.Description); err != nil {
			return nil, fmt.Errorf("falha ao ler talk: %w", err)
		}
		talks = append(talks, t)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("falha ao iterar talks: %w", err)
	}

	return talks, nil
}

// Exists verifica se a talk com o slug informado existe.
func (r *TalkRepository) Exists(ctx context.Context, slug string) (bool, error) {
	var exists bool
	err := r.pool.QueryRow(ctx, `
		SELECT EXISTS(SELECT 1 FROM talks WHERE slug = $1)
	`, slug).Scan(&exists)
	if err != nil {
		return false, fmt.Errorf("falha ao verificar existência da talk: %w", err)
	}
	return exists, nil
}

// GetBySlug retorna uma talk pelo slug, ou ErrTalkNotFound se não existir.
func (r *TalkRepository) GetBySlug(ctx context.Context, slug string) (models.Talk, error) {
	var t models.Talk
	err := r.pool.QueryRow(ctx, `
		SELECT slug, title, speaker, description
		FROM talks
		WHERE slug = $1
	`, slug).Scan(&t.Slug, &t.Title, &t.Speaker, &t.Description)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return models.Talk{}, ErrTalkNotFound
		}
		return models.Talk{}, fmt.Errorf("falha ao buscar talk: %w", err)
	}
	return t, nil
}
