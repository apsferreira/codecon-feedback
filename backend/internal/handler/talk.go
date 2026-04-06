package handler

import (
	"github.com/apsferreira/codecon-feedback/internal/domain"
	"github.com/gofiber/fiber/v2"
)

// ListTalks retorna todas as talks hardcoded do evento.
func ListTalks(c *fiber.Ctx) error {
	return c.JSON(domain.Talks)
}
