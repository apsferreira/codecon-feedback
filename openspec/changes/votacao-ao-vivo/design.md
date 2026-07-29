## Context

Projeto novo (greenfield): só existem manifests K8s pré-validados e o pipeline de deploy (`.github/workflows/deploy.yml`). Não há backend, frontend, nem migrations ainda. O evento é ao vivo — a tela de resultado precisa refletir novos votos em segundos, sem exigir reload manual, rodando num único host (`voteai.antoniopedro.com.br`) para uma audiência de meetup (dezenas a poucas centenas de participantes simultâneos).

## Goals / Non-Goals

**Goals:**
- Voto anônimo simples (nota 1-5 + comentário opcional), sem fricção — sem login, sem CAPTCHA.
- Tela de resultado que atualiza sozinha (estatísticas + feed de comentários) em tempo real durante o evento.
- Toda funcionalidade descrita no pedido do usuário deve estar de fato visível e utilizável na UI, não só persistida no banco.
- Deploy 100% via pipeline existente (merge na main → build → ArgoCD sync).

**Non-Goals:**
- Não há autenticação de usuário nem identificação de quem votou (fora de escopo, e o pedido é explicitamente anônimo).
- Não há edição/exclusão de voto após o envio.
- Não há painel de administração para gerenciar talks — a lista de talks vem do seed já definido em CLAUDE.md.
- Não há prevenção sofisticada de voto duplicado (ex: rate limit por IP/device) nesta primeira versão — está fora do pedido original.

## Decisions

### Atualização em tempo real: polling, não WebSocket
Polling simples (ex: `setInterval` de 3-5s no frontend contra o endpoint de estatísticas/comentários) em vez de WebSocket/SSE.
- **Por quê**: escala do evento é pequena (um meetup), Fiber v2 + polling é suficiente e muito mais simples de implementar, testar e depurar ao vivo durante a palestra. WebSocket adicionaria complexidade de infra (conexões persistentes atrás do IngressRoute/Cloudflare Tunnel) sem benefício perceptível nessa escala.
- **Alternativa considerada**: Server-Sent Events (SSE) — mais simples que WebSocket, mas ainda exige conexão longa-duração; rejeitado pela mesma razão de simplicidade/escala.

### Sem autenticação, voto anônimo por design
Endpoint de voto público, sem token/sessão. Nenhum dado de identificação do votante é persistido (schema `votes` já não tem coluna de identidade).
- **Por quê**: requisito explícito do usuário — voto anônimo é a proposta central do produto.

### Estrutura de API
- `GET /api/talks` — lista talks disponíveis para votação.
- `POST /api/talks/:slug/votes` — registra voto (rating 1-5, comment opcional).
- `GET /api/talks/:slug/stats` — estatísticas agregadas (média, total de votos, distribuição por nota).
- `GET /api/talks/:slug/comments` — feed de comentários (nota, comentário, created_at), mais recente primeiro, só entradas com `comment IS NOT NULL`.
- **Por quê separar stats de comments**: a tela de resultado faz polling frequente; separar os dois permite otimizar cada query e paginar comments independentemente se a lista crescer.

### Frontend: 3 telas + navegação de volta
1. **Lista de talks** (`/`) — ponto de entrada, lista talks para escolher e votar.
2. **Formulário de voto** (`/talks/:slug/vote`) — nota (1-5) + comentário opcional, botão de voltar pra lista.
3. **Resultado ao vivo** (`/talks/:slug/results` ou `/results` agregando todas) — estatísticas + feed de comentários, botão de voltar.
- Cada tela usa React Router; navegação de volta implementada com link/botão explícito (não depender só do botão do browser), conforme regra do CLAUDE.md.

### Grupo de validação de completude no tasks.md
Ao final do `tasks.md`, um grupo dedicado de tarefas que confirma, funcionalidade por funcionalidade do pedido original, que ela está visível e utilizável na UI (não só no backend/banco): voto anônimo 1-5, comentário opcional, estatísticas em tempo real, feed de comentários (nota + comentário + horário, mais recente primeiro), navegação de volta em toda tela, tema claro e escuro.
- **Por quê**: pedido explícito do usuário no prompt do `/opsx:propose`, e alinhado com o histórico do projeto (regra do CLAUDE.md sobre nunca declarar "testado" sem validação real).

## Risks / Trade-offs

- [Polling gera carga repetida no backend/DB durante o evento] → Mitigação: índice em `votes(talk_slug, created_at)`, queries agregadas simples (COUNT/AVG), intervalo de polling moderado (3-5s), volume de audiência é pequeno o suficiente para não exigir cache adicional nesta versão.
- [Sem proteção contra voto duplicado, alguém pode votar múltiplas vezes na mesma talk] → Mitigação: aceito conscientemente como não-goal desta versão; pode ser endereçado depois (ex: fingerprint local no frontend) se virar problema real durante o ensaio.
- [Comentário opcional pode conter conteúdo impróprio, exibido publicamente ao vivo] → Mitigação: fora de escopo automatizar moderação; o organizador (Antonio) tem acesso direto ao banco para remover registros pontuais se necessário durante o evento.

## Migration Plan

1. Aplicar `migrations/001_init.sql` (schema já definido em CLAUDE.md) e seed das duas talks confirmadas.
2. Implementação segue o fluxo padrão do projeto: uma branch feature, commits incrementais por tarefa do `tasks.md`, PR draft desde o commit dos artefatos de propose.
3. Deploy exclusivamente via merge do PR na `main` (pipeline `.github/workflows/deploy.yml` + ArgoCD) — sem deploy manual, conforme regra do CLAUDE.md.
4. Rollback: revert do merge commit na `main` dispara novo deploy automático com a versão anterior das imagens (o pipeline reconstrói a partir do estado do repo).

## Open Questions

- Nenhuma pendente — decisões técnicas cobertas acima. Ajustes pontuais em `k8s/` (se necessários) serão feitos durante a implementação, não neste design.
