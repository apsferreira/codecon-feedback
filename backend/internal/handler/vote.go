package handler

import (
	"context"
	"fmt"
	"log"
	"strconv"
	"time"

	"github.com/apsferreira/codecon-feedback/internal/domain"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v5/pgxpool"
)

var validate = validator.New()

// VoteHandler agrupa os handlers de voto com a pool de conexão.
type VoteHandler struct {
	db *pgxpool.Pool
}

// NewVoteHandler cria um novo VoteHandler.
func NewVoteHandler(db *pgxpool.Pool) *VoteHandler {
	return &VoteHandler{db: db}
}

// CreateVote processa POST /api/v1/votes.
func (h *VoteHandler) CreateVote(c *fiber.Ctx) error {
	var req domain.VoteRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "payload inválido"})
	}

	if err := validate.Struct(&req); err != nil {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{"error": err.Error()})
	}

	if domain.FindTalk(req.TalkSlug) == nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "talk_slug inválido"})
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := h.db.Exec(ctx,
		`INSERT INTO votes (talk_slug, rating, comment) VALUES ($1, $2, $3)`,
		req.TalkSlug, req.Rating, req.Comment,
	)
	if err != nil {
		log.Printf("erro ao inserir voto: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "erro interno"})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "voto registrado"})
}

// ListVotes processa GET /api/v1/votes?talk=:slug.
func (h *VoteHandler) ListVotes(c *fiber.Ctx) error {
	slug := c.Query("talk")
	if slug == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "parâmetro 'talk' obrigatório"})
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	rows, err := h.db.Query(ctx,
		`SELECT id, talk_slug, rating, comment, created_at FROM votes WHERE talk_slug = $1 ORDER BY created_at DESC LIMIT 50`,
		slug,
	)
	if err != nil {
		log.Printf("erro ao listar votos: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "erro interno"})
	}
	defer rows.Close()

	votes := make([]domain.Vote, 0)
	for rows.Next() {
		var v domain.Vote
		if err := rows.Scan(&v.ID, &v.TalkSlug, &v.Rating, &v.Comment, &v.CreatedAt); err != nil {
			log.Printf("erro ao escanear voto: %v", err)
			continue
		}
		votes = append(votes, v)
	}

	return c.JSON(votes)
}

// GetStats processa GET /api/v1/votes/stats?talk=:slug.
func (h *VoteHandler) GetStats(c *fiber.Ctx) error {
	slug := c.Query("talk")
	if slug == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "parâmetro 'talk' obrigatório"})
	}

	stats, err := h.fetchStats(slug)
	if err != nil {
		log.Printf("erro ao buscar stats: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "erro interno"})
	}

	return c.JSON(stats)
}

// GetAllStats processa GET /api/v1/votes/stats/all.
func (h *VoteHandler) GetAllStats(c *fiber.Ctx) error {
	result := make([]domain.VoteStats, 0, len(domain.Talks))
	for _, talk := range domain.Talks {
		stats, err := h.fetchStats(talk.Slug)
		if err != nil {
			log.Printf("erro ao buscar stats de %s: %v", talk.Slug, err)
			stats = &domain.VoteStats{
				TalkSlug:     talk.Slug,
				TalkTitle:    talk.Title,
				Distribution: emptyDistribution(),
			}
		}
		result = append(result, *stats)
	}
	return c.JSON(result)
}

// fetchStats busca as estatísticas de uma talk no banco.
func (h *VoteHandler) fetchStats(slug string) (*domain.VoteStats, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	talk := domain.FindTalk(slug)
	title := slug
	if talk != nil {
		title = talk.Title
	}

	stats := &domain.VoteStats{
		TalkSlug:     slug,
		TalkTitle:    title,
		Distribution: emptyDistribution(),
	}

	rows, err := h.db.Query(ctx,
		`SELECT rating, COUNT(*) FROM votes WHERE talk_slug = $1 GROUP BY rating`,
		slug,
	)
	if err != nil {
		return nil, fmt.Errorf("query stats: %w", err)
	}
	defer rows.Close()

	totalSum := 0
	totalCount := 0
	for rows.Next() {
		var rating, count int
		if err := rows.Scan(&rating, &count); err != nil {
			continue
		}
		key := strconv.Itoa(rating)
		stats.Distribution[key] = count
		totalSum += rating * count
		totalCount += count
	}

	stats.Total = totalCount
	if totalCount > 0 {
		stats.AverageRating = float64(totalSum) / float64(totalCount)
	}

	return stats, nil
}

func emptyDistribution() map[string]int {
	return map[string]int{"1": 0, "2": 0, "3": 0, "4": 0, "5": 0}
}
