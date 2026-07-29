package handlers

import "github.com/gofiber/fiber/v2"

// Health trata GET /health — usado pelos readiness/liveness probes do k8s.
func Health(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{"status": "ok"})
}
