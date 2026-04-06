# Codecon Feedback

## Contexto
Este repo foi criado ao vivo durante a palestra "SDD: para alem da sopa de letrinhas"
no meetup Codecon. O objetivo e demonstrar Spec Driven Development na pratica.

## Regras
- Toda implementacao deve seguir o SPEC.md como fonte de verdade
- Commits em PT-BR, mensagens concisas
- Go 1.24, Fiber v2, SQLite para persistencia
- Frontend: React 19 + TypeScript strict + Vite + TailwindCSS + shadcn/ui
- Tudo roda via Docker Compose — nao assumir Go/Node instalados na maquina
- docker-compose.yml na raiz com servicos: backend, frontend
- Hot reload via volume mounts no docker-compose
- Dockerfile multi-stage para build de producao
- Nunca adicionar Co-Authored-By nos commits
