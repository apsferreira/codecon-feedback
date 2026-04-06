# Codecon Feedback

## Objetivo
App para coletar feedbacks ao vivo durante meetups da Codecon.
Suporta multiplas palestras na mesma noite com votacao em tempo real.
Serve como ferramenta do evento E como pagina publica
no portfolio do palestrante (antoniopedro.com.br).

## Palestras do evento

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
- Header: "Codecon Meetup Salvador" + data do evento
- Cards das palestras da noite com:
  - Titulo + palestrante
  - Nota media atual (atualiza em tempo real)
  - Total de feedbacks recebidos
  - Botao "Avaliar" que leva pra /talk/:slug
- Ranking visual: qual palestra esta com melhor nota (barra comparativa)
- Footer: "Construido ao vivo com SDD" + link pro repo

### Feedback por palestra
- Participante acessa via QR code ou clicando no card (mobile-first)
- Envia nome, nota (1-5 estrelas clicaveis) e comentario
- Feedbacks aparecem em tempo real na tela (polling 5s)
- Stats ao vivo: media, total, distribuicao visual de notas
- Botao voltar pra home pra avaliar a outra palestra

### Modo apresentacao (telao)
- Rota /live — visao geral do evento (todas as talks)
  - Cards lado a lado com stats em tempo real
  - Feedbacks mais recentes de todas as talks em feed unico
  - Fundo escuro pra projetor
- Rota /talk/:slug/live — foco numa talk especifica
  - Feed de feedbacks a esquerda (ultimos 10, animacao slide-in)
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

### POST /api/v1/feedbacks
- Body: { author_name, rating (1-5), comment, talk_slug }
- Validacoes: rating 1-5, author_name obrigatorio, talk_slug deve existir
- Retorno: 201

### GET /api/v1/feedbacks?talk=:slug
- Lista feedbacks do talk, created_at DESC
- Retorno: 200 com array

### GET /api/v1/feedbacks/stats?talk=:slug
- Retorno: { total, average_rating, distribution: {1:N,...} }

### GET /api/v1/feedbacks/stats/all
- Stats de todas as talks de uma vez
- Retorno: array de { talk_slug, talk_title, total, average_rating, distribution }
- Usado pela home e pelo modo apresentacao

## Frontend (React + Vite + Tailwind)

### / (home do evento)
- Header grande: "Codecon Meetup Salvador"
- Subtitulo: data do evento
- Grid de cards (1 por talk):
  - Titulo + palestrante
  - Estrelas com media atual (atualizacao polling 5s)
  - Badge com total de feedbacks
  - Botao "Avaliar esta palestra"
- Barra comparativa de notas entre as talks (visual, animada)
- Footer discreto: "Construido ao vivo com SDD por Antonio Pedro"

### /talk/:slug (avaliacao — mobile-first)
- Header: titulo da palestra + palestrante
- Formulario: nome, estrelas clicaveis (1-5), textarea comentario
- Lista de feedbacks abaixo (polling 5s, novos com animacao fade-in)
- Stats compactos no topo (nota media + total)
- Link "Voltar" e "Avaliar outra palestra"

### /live (modo apresentacao — visao geral)
- Fundo escuro (gray-950)
- Cards das talks lado a lado com stats gigantes
- Feed unificado de feedbacks recentes no centro
- QR code da home no canto

### /talk/:slug/live (modo apresentacao — foco)
- Fundo escuro
- Feed de feedbacks a esquerda
- Stats grandes a direita
- QR code da talk no canto

### /talk/:slug/about (portfolio)
- Timeline de construcao
- SPEC.md renderizado
- Link pro repo + contatos

## Design
- Cores: violet-600 primaria, gray-950 para modo live
- Estrelas: amber-400 preenchidas, gray-300 vazias
- Cards: bg-white, rounded-2xl, shadow-sm, hover:shadow-md
- Barra comparativa: gradient violet-500 > indigo-500
- Animacao: feedbacks novos com fade-in + slide-up
- Mobile-first, max-w-lg no form, grid responsivo na home
- Tipografia: font-bold nos titulos, text-sm nos comentarios

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
