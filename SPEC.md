# Vote aí

## Objetivo
Vote ai e um sistema de votacao ao vivo para eventos de tecnologia.
O nome e uma referencia dupla: "ai" baiano (la, aqui) e "AI" de
inteligencia artificial — porque a app foi construida inteiramente
por agentes de IA usando Spec Driven Development.

Suporta multiplas palestras na mesma noite com votacao em tempo real.
Hospedado em antoniopedro.com.br/voteai

## Palestras do evento (Codecon Meetup Salvador)

### Talk 1
- Slug: sdd-sopa
- Titulo: SDD: para alem da sopa de letrinhas
- Palestrante: Antonio Pedro Ferreira
- Descricao: Spec Driven Development na pratica com show me the code ao vivo

### Talk 2
- Slug: a-definir
- Titulo: (a definir — sera preenchido quando confirmado)
- Palestrante: (a definir)
- Descricao: (a definir)

## Funcionalidades

### Home do evento
- Rota / — pagina inicial do meetup da noite
- Header: "Vote ai" (logo) + "Codecon Meetup Salvador" + data do evento
- Cards das palestras da noite com:
  - Titulo + palestrante
  - Nota media atual (atualiza em tempo real)
  - Total de votos recebidos
  - Botao "Votar" que leva pra /talk/:slug
- Ranking visual: qual palestra esta com melhor nota (barra comparativa)
- Footer: "Vote ai — construido ao vivo com SDD por Antonio Pedro"

### Votacao por palestra
- Votacao ANONIMA — sem campo de nome
- Participante acessa via QR code ou clicando no card (mobile-first)
- Envia nota (1-5 estrelas clicaveis) e comentario opcional
- Votos aparecem em tempo real na tela (polling 5s)
- Stats ao vivo: media, total, distribuicao visual de notas
- Botao voltar pra home pra votar na outra palestra

### Modo apresentacao (telao)
- Rota /live — visao geral do evento (todas as talks)
  - Cards lado a lado com stats em tempo real
  - Votos mais recentes de todas as talks em feed unico
  - Fundo escuro pra projetor
- Rota /talk/:slug/live — foco numa talk especifica
  - Feed de votos a esquerda (ultimos 10, animacao slide-in)
  - Stats grandes a direita (nota media gigante, barras de distribuicao)
  - QR code fixo no canto inferior direito

### Pagina publica (portfolio)
- Rota /talk/:slug/about — como foi construido
- Timeline: "0 min — Spec escrita" > "8 min — Backend" > ...
- SPEC.md renderizado
- Link pro repo GitHub
- Contatos do palestrante

## API (Go + Fiber)

### GET /api/v1/talks
- Lista todas as talks do evento
- Retorno: 200 com array de { slug, title, speaker, description }

### POST /api/v1/votes
- Body: { rating (1-5), talk_slug, comment? }
- Votacao anonima: sem campo de nome
- Validacoes: rating 1-5, talk_slug deve existir
- comment e opcional
- Retorno: 201

### GET /api/v1/votes?talk=:slug
- Lista votos do talk, created_at DESC
- Retorno: 200 com array

### GET /api/v1/votes/stats?talk=:slug
- Retorno: { total, average_rating, distribution: {1:N,...} }

### GET /api/v1/votes/stats/all
- Stats de todas as talks de uma vez
- Retorno: array de { talk_slug, talk_title, total, average_rating, distribution }
- Usado pela home e pelo modo apresentacao

## Frontend (React + Vite + Tailwind + shadcn/ui)

### / (home do evento)
- Header: logo "Vote ai" (estilizado — "Vote" em branco, "ai" em violet)
- Subtitulo: "Codecon Meetup Salvador" + data do evento
- Grid de cards (1 por talk) usando shadcn Card:
  - Titulo + palestrante
  - Estrelas com media atual (atualizacao polling 5s)
  - Badge com total de votos
  - Botao "Votar nessa palestra"
- Barra comparativa de notas entre as talks (visual, animada)
- Footer: "Vote ai — construido ao vivo com SDD por Antonio Pedro"

### /talk/:slug (votacao — mobile-first)
- Header: titulo da palestra + palestrante
- Formulario simples:
  - Estrelas clicaveis (1-5) — obrigatorio
  - Textarea comentario — opcional, placeholder "Deixe um comentario (opcional)"
  - Botao "Enviar voto"
- Lista de votos abaixo (polling 5s, novos com animacao fade-in)
  - Cada voto mostra: estrelas + comentario (se houver) + "ha X min"
- Stats compactos no topo com shadcn Badge (nota media + total)
- Link "Voltar" e "Votar em outra palestra"

### /live (modo apresentacao — visao geral)
- Fundo escuro (gray-950)
- Logo "Vote ai" no topo
- Cards das talks lado a lado com stats gigantes
- Feed unificado de votos recentes no centro
- QR code da home no canto

### /talk/:slug/live (modo apresentacao — foco)
- Fundo escuro
- Feed de votos a esquerda
- Stats grandes a direita
- QR code da talk no canto

### /talk/:slug/about (portfolio)
- Timeline de construcao
- SPEC.md renderizado
- Link pro repo + contatos

## Design
- Usar shadcn/ui como base de componentes (Card, Button, Input, Badge, etc)
- Logo: "Vote" em font-bold text-white + "ai" em font-bold text-violet-400
- Cores: violet-600 primaria, gray-950 para modo live
- Estrelas: amber-400 preenchidas, gray-300 vazias
- Cards: shadcn Card com hover:shadow-md
- Barra comparativa: gradient violet-500 > indigo-500
- Animacao: votos novos com fade-in + slide-up (CSS transitions)
- Mobile-first, max-w-lg no form, grid responsivo na home
- Layout limpo e moderno — priorizar legibilidade e usabilidade

## Infra e ambiente de desenvolvimento

### Banco de dados
- PostgreSQL (shared-infra existente — 192.168.30.121:5432)
- Database: voteai
- Credenciais dev: postgres / postgres
- Credenciais prod: postgres / Quixabeira@1
- Tabelas: talks, votes
- Migration SQL em migrations/001_init.sql

### Desenvolvimento local (Docker Compose)
- docker-compose.yml na raiz com servicos: backend, frontend
- Backend conecta no PostgreSQL do shared-infra (host.docker.internal ou IP)
- Frontend faz proxy das chamadas /api para o backend
- Hot reload via volume mounts
- Backend na porta 8080, frontend na porta 3000

### Producao (K3s)
- Dockerfile.backend: multi-stage (golang:1.24 builder > alpine runtime)
- Dockerfile.frontend: multi-stage (node:22 builder > nginx:alpine)
- Deploy: K3s com manifests em k8s/
- Namespace test: codecon-test (ensaios)
- Namespace prod: codecon (dia do evento)
- URLs:
  - Test: voteai-test.antoniopedro.com.br
  - Prod: voteai.antoniopedro.com.br (ou antoniopedro.com.br/voteai)
- Acesso ao cluster via Tailscale no dia do evento

## Convencoes
- cmd/server/main.go, internal/handler/, internal/domain/
- Sem ORM, queries diretas com database/sql + pgx
- Dockerfile multi-stage (builder > alpine)
- Commits em PT-BR

## Nota sobre agentes de IA
Esta app foi construida inteiramente via agentes de IA (Claude Code)
usando a spec acima como unica instrucao. O palestrante nao escreveu
nenhuma linha de codigo manualmente — apenas a especificacao.
O nome "Vote ai" e uma referencia dupla: "ai" baiano e "AI" de
inteligencia artificial. Isso demonstra o conceito central do SDD:
a spec e o artefato, o codigo e o subproduto.
