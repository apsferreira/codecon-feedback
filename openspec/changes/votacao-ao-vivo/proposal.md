## Why

O Codecon Meetup Salvador precisa de um jeito da plateia avaliar as talks ao vivo — voto anônimo de 1 a 5 com comentário opcional — e de uma tela de resultado que mostre estatísticas e os comentários em tempo real durante o evento, não só dados guardados no banco pra análise posterior.

## What Changes

- Backend Go/Fiber com endpoints para: listar talks, registrar voto (nota + comentário opcional, anônimo, sem autenticação), consultar estatísticas agregadas por talk, e listar comentários recentes por talk.
- Persistência em PostgreSQL (banco `voteai`, tabelas `talks` e `votes` conforme schema já definido em CLAUDE.md).
- Frontend React + shadcn/ui com três telas: lista de talks para votar, formulário de voto (nota 1-5 + comentário opcional), e tela de resultado ao vivo (estatísticas + lista de comentários mais recente → mais antigo, com nota e horário).
- Atualização em tempo real (polling ou similar) na tela de resultado, para refletir novos votos sem reload manual.
- Navegação de volta em toda tela.
- Deploy no K3s (namespace `codecon`, host `voteai.antoniopedro.com.br`) via pipeline automático existente (`.github/workflows/deploy.yml` + ArgoCD) — manifests em `k8s/` já existem e serão reaproveitados.

## Capabilities

### New Capabilities
- `votacao`: submissão de voto anônimo (nota 1-5 + comentário opcional) para uma talk, incluindo listagem de talks disponíveis.
- `resultado-ao-vivo`: estatísticas agregadas por talk (média, contagem) e feed de comentários (nota, comentário, horário) em tempo real, ordenado do mais recente pro mais antigo.

### Modified Capabilities
(nenhuma — projeto novo, sem specs existentes)

## Impact

- Novo serviço backend (Go/Fiber) escutando na porta 3000, conectando ao PostgreSQL do `shared-infra` (banco `voteai`).
- Nova migration `migrations/001_init.sql` criando `talks` e `votes`.
- Novo frontend React 19 + TypeScript + Vite + TailwindCSS + shadcn/ui.
- `docker-compose.yml` novo na raiz com serviços `backend` e `frontend`, hot reload via volume mounts.
- Dockerfiles multi-stage para build de produção de cada serviço.
- Deploy usa os manifests `k8s/` já existentes neste repo (namespace `codecon`, host `voteai.antoniopedro.com.br`) — sem alterações estruturais nesses arquivos além do que a implementação exigir pontualmente.
