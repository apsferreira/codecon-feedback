package handlers

import (
	"github.com/gofiber/fiber/v2"

	"codecon-feedback/backend/internal/services"
)

type TalkHandler struct {
	talkService *services.TalkService
}

func NewTalkHandler(talkService *services.TalkService) *TalkHandler {
	return &TalkHandler{talkService: talkService}
}

// List trata GET /api/talks
func (h *TalkHandler) List(c *fiber.Ctx) error {
	talks, err := h.talkService.List(c.Context())
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "falha ao listar talks")
	}

	return c.JSON(talks)
}
