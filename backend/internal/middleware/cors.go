package middleware

import "github.com/gofiber/fiber/v2/middleware/cors"

// CORSConfig retorna a configuração CORS para o app.
func CORSConfig() cors.Config {
	return cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept",
		AllowMethods: "GET, POST, OPTIONS",
	}
}
