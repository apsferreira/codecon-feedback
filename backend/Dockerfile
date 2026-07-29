# syntax=docker/dockerfile:1
#
# Build context deve ser a RAIZ do repositório (não backend/), para que este
# Dockerfile também tenha acesso a ../migrations. Exemplo:
#   docker build -f backend/Dockerfile -t voteai-backend .
# No docker-compose.yml (raiz do repo), configurar:
#   build:
#     context: .
#     dockerfile: backend/Dockerfile

FROM golang:1.24 AS build
ENV GOTOOLCHAIN=auto
WORKDIR /app

COPY backend/go.mod backend/go.sum ./
RUN go mod download

COPY backend/ .
RUN CGO_ENABLED=0 GOOS=linux go build -o /out/server ./cmd/server

FROM gcr.io/distroless/static-debian12 AS production
WORKDIR /app
COPY --from=build /out/server ./server
COPY migrations ./migrations

EXPOSE 3000
ENTRYPOINT ["./server"]
