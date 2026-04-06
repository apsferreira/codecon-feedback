# Codecon Feedback

## Contexto
Este repo foi criado ao vivo durante a palestra "SDD: para alem da sopa de letrinhas"
no meetup Codecon. O objetivo e demonstrar Spec Driven Development na pratica.

## Regras
- Toda implementacao deve seguir o SPEC.md como fonte de verdade
- Commits em PT-BR, mensagens concisas
- Go 1.24, Fiber v2, PostgreSQL (pgx) para persistencia
- Frontend: React 19 + TypeScript strict + Vite + TailwindCSS + shadcn/ui
- Tudo roda via Docker Compose — nao assumir Go/Node instalados na maquina
- docker-compose.yml na raiz com servicos: backend, frontend
- Hot reload via volume mounts no docker-compose
- Dockerfile multi-stage para build de producao
- Nunca adicionar Co-Authored-By nos commits

## Workflow Git
- A branch main e protegida — NUNCA commitar direto na main
- Sempre criar uma branch feature (ex: feat/backend, feat/frontend, feat/infra)
- Ao terminar, abrir um Pull Request para main com descricao clara
- Aguardar aprovacao do reviewer antes de mergear
- Isso garante que nenhum codigo entra sem revisao humana

## Banco de dados
- PostgreSQL do shared-infra (192.168.30.121:5432 em prod)
- Database: codecon_feedback
- Migrations SQL em migrations/
