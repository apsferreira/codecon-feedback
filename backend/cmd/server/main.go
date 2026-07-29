package main

import (
	"context"
	"log"
	"os"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"

	"codecon-feedback/backend/internal/db"
	"codecon-feedback/backend/internal/handlers"
	"codecon-feedback/backend/internal/repositories"
	"codecon-feedback/backend/internal/services"
)

func main() {
	ctx := context.Background()

	pool, err := db.New(ctx)
	if err != nil {
		log.Fatalf("erro ao conectar ao banco: %v", err)
	}
	defer pool.Close()

	migrationsDir := os.Getenv("MIGRATIONS_DIR")
	if migrationsDir == "" {
		migrationsDir = "migrations"
	}
	if err := db.Migrate(ctx, pool, migrationsDir); err != nil {
		log.Fatalf("erro ao aplicar migrations: %v", err)
	}

	talkRepo := repositories.NewTalkRepository(pool)
	voteRepo := repositories.NewVoteRepository(pool)

	talkService := services.NewTalkService(talkRepo)
	voteService := services.NewVoteService(talkRepo, voteRepo)

	validate := validator.New()
	voteHandler := handlers.NewVoteHandler(voteService, validate)

	app := fiber.New(fiber.Config{
		ErrorHandler: errorHandler,
	})

	corsOrigins := os.Getenv("CORS_ALLOW_ORIGINS")
	if corsOrigins == "" {
		corsOrigins = "*"
	}

	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: corsOrigins,
		AllowMethods: "GET,POST,OPTIONS",
		AllowHeaders: "Content-Type",
	}))

	handlers.RegisterRoutes(app, talkService, voteService, voteHandler)

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	log.Fatal(app.Listen(":" + port))
}

// errorHandler centraliza a tradução de erros em respostas JSON consistentes,
// evitando panics em handlers HTTP.
func errorHandler(c *fiber.Ctx, err error) error {
	code := fiber.StatusInternalServerError
	message := "erro interno"

	var fiberErr *fiber.Error
	if e, ok := err.(*fiber.Error); ok {
		fiberErr = e
		code = fiberErr.Code
		message = fiberErr.Message
	}

	return c.Status(code).JSON(fiber.Map{"error": message})
}
