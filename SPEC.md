# Codecon Feedback

## Objetivo
App para coletar feedbacks ao vivo durante palestras.
Serve como ferramenta da palestra E como pagina publica
no portfolio do palestrante (antoniopedro.com.br).

## Funcionalidades

### Feedback ao vivo
- Participante acessa via QR code (mobile-first)
- Envia nome, nota (1-5 estrelas clicaveis) e comentario
- Feedbacks aparecem em tempo real na tela (polling 5s)
- Stats ao vivo: media, total, distribuicao visual de notas

### Modo apresentacao (telao)
- Rota /talk/:slug/live — tela cheia, sem form
- Mostra feedbacks chegando em tempo real estilo "feed"
- Barra lateral com stats animados
- Fundo escuro pra projetor

### Pagina publica (portfolio)
- Rota /talk/:slug — mostra o form + feedbacks + stats
- Secao "Como foi construido" com link pro SPEC.md e repo
- Responsiva, funciona como pagina do antoniopedro.com.br

## API (Go + Fiber)

### POST /api/v1/feedbacks
- Body: { author_name, rating (1-5), comment, talk_slug }
- Validacoes: rating 1-5, author_name obrigatorio
- Retorno: 201

### GET /api/v1/feedbacks?talk=:slug
- Lista feedbacks do talk, created_at DESC
- Retorno: 200 com array

### GET /api/v1/feedbacks/stats?talk=:slug
- Retorno: { total, average_rating, distribution: {1:N,...} }

## Frontend (React + Vite + Tailwind)

### /talk/:slug (padrao — mobile-first)
- Header: nome da palestra + palestrante + evento
- Formulario: nome, estrelas clicaveis (1-5), textarea comentario
- Lista de feedbacks abaixo (polling 5s, novos aparecem com animacao)
- Stats compactos no topo (nota media + total)

### /talk/:slug/live (modo apresentacao)
- Fundo escuro (gray-950)
- Feed de feedbacks a esquerda (ultimos 10, animacao slide-in)
- Stats grandes a direita (nota media gigante, barras de distribuicao)
- Sem formulario — so visualizacao
- QR code fixo no canto inferior direito

### /talk/:slug/about (como foi construido)
- Timeline: "0 min — Spec escrita" > "8 min — Backend" > ...
- SPEC.md renderizado
- Link pro repo GitHub
- Contatos do palestrante

## Design
- Cores: violet-600 primaria, gray-900 para modo live
- Estrelas: amarelo-400 preenchidas, gray-300 vazias
- Animacao: feedbacks novos aparecem com fade-in + slide
- Mobile-first, max-w-lg no form

## Infra
- Backend: Go 1.24 + Fiber v2 + SQLite
- Frontend: React 19 + TypeScript + Vite + TailwindCSS
- Deploy: Docker multi-stage > K3s
- URL: codecon-demo.institutoitinerante.com.br

## Convencoes
- cmd/server/main.go, internal/handler/, internal/domain/
- Sem ORM, queries diretas com database/sql
- Dockerfile multi-stage (builder > alpine)
- Commits em PT-BR
