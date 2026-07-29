package handlers

import (
	"errors"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"

	"codecon-feedback/backend/internal/models"
	"codecon-feedback/backend/internal/services"
)

type VoteHandler struct {
	voteService *services.VoteService
	validate    *validator.Validate
}

func NewVoteHandler(voteService *services.VoteService, validate *validator.Validate) *VoteHandler {
	return &VoteHandler{voteService: voteService, validate: validate}
}

// Create trata POST /api/talks/:slug/votes
func (h *VoteHandler) Create(c *fiber.Ctx) error {
	slug := c.Params("slug")

	var input models.VoteInput
	if err := c.BodyParser(&input); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "payload inválido")
	}

	if err := h.validate.Struct(input); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "rating é obrigatório e deve estar entre 1 e 5")
	}

	err := h.voteService.RegisterVote(c.Context(), slug, input.Rating, input.Comment)
	if err != nil {
		if errors.Is(err, services.ErrTalkNotFound) {
			return fiber.NewError(fiber.StatusNotFound, "talk não encontrada")
		}
		return fiber.NewError(fiber.StatusInternalServerError, "falha ao registrar voto")
	}

	return c.SendStatus(fiber.StatusCreated)
}

// Stats trata GET /api/talks/:slug/stats
func (h *VoteHandler) Stats(c *fiber.Ctx) error {
	slug := c.Params("slug")

	stats, err := h.voteService.Stats(c.Context(), slug)
	if err != nil {
		if errors.Is(err, services.ErrTalkNotFound) {
			return fiber.NewError(fiber.StatusNotFound, "talk não encontrada")
		}
		return fiber.NewError(fiber.StatusInternalServerError, "falha ao calcular estatísticas")
	}

	return c.JSON(stats)
}

// Comments trata GET /api/talks/:slug/comments
func (h *VoteHandler) Comments(c *fiber.Ctx) error {
	slug := c.Params("slug")

	comments, err := h.voteService.Comments(c.Context(), slug)
	if err != nil {
		if errors.Is(err, services.ErrTalkNotFound) {
			return fiber.NewError(fiber.StatusNotFound, "talk não encontrada")
		}
		return fiber.NewError(fiber.StatusInternalServerError, "falha ao listar comentários")
	}

	return c.JSON(comments)
}
