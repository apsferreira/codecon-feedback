package handlers

import (
	"github.com/gofiber/fiber/v2"

	"codecon-feedback/backend/internal/services"
)

// RegisterRoutes registra todas as rotas HTTP da aplicação.
func RegisterRoutes(app *fiber.App, talkService *services.TalkService, voteService *services.VoteService, voteHandler *VoteHandler) {
	talkHandler := NewTalkHandler(talkService)

	app.Get("/health", Health)

	api := app.Group("/api")
	api.Get("/talks", talkHandler.List)
	api.Post("/talks/:slug/votes", voteHandler.Create)
	api.Get("/talks/:slug/stats", voteHandler.Stats)
	api.Get("/talks/:slug/comments", voteHandler.Comments)
}
