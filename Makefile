.PHONY: up down logs build clean

up:
	docker compose up --build -d
	@echo ""
	@echo "Vote ai rodando:"
	@echo "  Frontend: http://localhost:3000"
	@echo "  Backend:  http://localhost:8080"
	@echo "  Live:     http://localhost:3000/live"

down:
	docker compose down

logs:
	docker compose logs -f

logs-backend:
	docker compose logs -f backend

build:
	docker compose build --no-cache

clean:
	docker compose down -v
	@echo "Volumes removidos"

ps:
	docker compose ps
