package repositories

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"

	"codecon-feedback/backend/internal/models"
)

type VoteRepository struct {
	pool *pgxpool.Pool
}

func NewVoteRepository(pool *pgxpool.Pool) *VoteRepository {
	return &VoteRepository{pool: pool}
}

// Create insere um novo voto anônimo para a talk informada. Nenhum dado de
// identidade do votante é aceito ou persistido.
func (r *VoteRepository) Create(ctx context.Context, talkSlug string, rating int, comment *string) error {
	_, err := r.pool.Exec(ctx, `
		INSERT INTO votes (talk_slug, rating, comment)
		VALUES ($1, $2, $3)
	`, talkSlug, rating, comment)
	if err != nil {
		return fmt.Errorf("falha ao registrar voto: %w", err)
	}
	return nil
}

// Stats retorna a média de rating e o total de votos de uma talk.
func (r *VoteRepository) Stats(ctx context.Context, talkSlug string) (models.TalkStats, error) {
	stats := models.TalkStats{TalkSlug: talkSlug}

	var avg *float64
	var total int
	err := r.pool.QueryRow(ctx, `
		SELECT COALESCE(AVG(rating), 0)::float8, COUNT(*)
		FROM votes
		WHERE talk_slug = $1
	`, talkSlug).Scan(&avg, &total)
	if err != nil {
		return models.TalkStats{}, fmt.Errorf("falha ao calcular estatísticas: %w", err)
	}

	if avg != nil {
		stats.AverageRating = *avg
	}
	stats.TotalVotes = total

	return stats, nil
}

// Comments retorna o feed de votos com comentário não nulo para uma talk,
// ordenado do mais recente para o mais antigo.
func (r *VoteRepository) Comments(ctx context.Context, talkSlug string) ([]models.CommentEntry, error) {
	rows, err := r.pool.Query(ctx, `
		SELECT rating, comment, created_at
		FROM votes
		WHERE talk_slug = $1 AND comment IS NOT NULL
		ORDER BY created_at DESC
	`, talkSlug)
	if err != nil {
		return nil, fmt.Errorf("falha ao listar comentários: %w", err)
	}
	defer rows.Close()

	comments := make([]models.CommentEntry, 0)
	for rows.Next() {
		var c models.CommentEntry
		if err := rows.Scan(&c.Rating, &c.Comment, &c.CreatedAt); err != nil {
			return nil, fmt.Errorf("falha ao ler comentário: %w", err)
		}
		comments = append(comments, c)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("falha ao iterar comentários: %w", err)
	}

	return comments, nil
}
