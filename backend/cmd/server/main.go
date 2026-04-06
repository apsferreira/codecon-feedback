package main

import (
	"context"
	"log"
	"os"
	"time"

	"github.com/apsferreira/codecon-feedback/internal/handler"
	"github.com/apsferreira/codecon-feedback/internal/middleware"
	"github.com/gofiber/fiber/v2"
	fibercors "github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/jackc/pgx/v5/pgxpool"
)

func main() {
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgres://postgres:postgres@localhost:5432/voteai"
	}

	db := connectDB(dbURL)
	defer db.Close()

	app := fiber.New(fiber.Config{
		AppName: "vote-ai",
	})

	app.Use(fibercors.New(middleware.CORSConfig()))
	app.Use(logger.New())

	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "ok"})
	})

	voteHandler := handler.NewVoteHandler(db)

	api := app.Group("/api/v1")
	api.Get("/talks", handler.ListTalks)
	api.Post("/votes", voteHandler.CreateVote)
	api.Get("/votes/stats/all", voteHandler.GetAllStats)
	api.Get("/votes/stats", voteHandler.GetStats)
	api.Get("/votes", voteHandler.ListVotes)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("servidor iniciado na porta %s", port)
	if err := app.Listen(":" + port); err != nil {
		log.Fatalf("erro ao iniciar servidor: %v", err)
	}
}

func connectDB(url string) *pgxpool.Pool {
	var pool *pgxpool.Pool
	var err error

	for i := range 10 {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		pool, err = pgxpool.New(ctx, url)
		cancel()

		if err == nil {
			ctx2, cancel2 := context.WithTimeout(context.Background(), 3*time.Second)
			err = pool.Ping(ctx2)
			cancel2()
		}

		if err == nil {
			log.Println("banco de dados conectado")
			return pool
		}

		log.Printf("tentativa %d/10 de conexão com banco: %v", i+1, err)
		time.Sleep(2 * time.Second)
	}

	log.Fatalf("não foi possível conectar ao banco de dados: %v", err)
	return nil
}
