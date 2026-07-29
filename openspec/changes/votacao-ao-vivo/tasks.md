## 1. Setup do projeto

- [x] 1.1 Criar branch `feat/votacao-ao-vivo`
- [x] 1.2 Criar estrutura de diretórios `backend/` (Go/Fiber) e `frontend/` (React/Vite)
- [x] 1.3 Criar `docker-compose.yml` na raiz com serviços `backend` e `frontend`, hot reload via volume mounts
- [x] 1.4 Criar `migrations/001_init.sql` com o schema `talks` e `votes` (exatamente como definido no CLAUDE.md)

## 2. Backend — base e persistência

- [x] 2.1 Inicializar módulo Go 1.24 com Fiber v2 e driver pgx, escutando na porta 3000
- [x] 2.2 Configurar conexão com PostgreSQL (`voteai`) via variáveis de ambiente, sem hardcode de credenciais
- [x] 2.3 Aplicar migration `001_init.sql` e seed das duas talks confirmadas (sdd-sopa, escalando-nodejs) via `ON CONFLICT DO NOTHING`
- [x] 2.4 Implementar camada de acesso a dados (queries) para talks e votes

## 3. Backend — endpoints de votação

- [x] 3.1 Implementar `GET /api/talks` — lista talks com título e palestrante
- [x] 3.2 Implementar `POST /api/talks/:slug/votes` — valida rating 1-5, persiste voto anônimo com comentário opcional
- [x] 3.3 Adicionar validação de payload (rating obrigatório e no intervalo, comentário opcional) com erros claros

## 4. Backend — endpoints de resultado ao vivo

- [x] 4.1 Implementar `GET /api/talks/:slug/stats` — média de nota e total de votos por talk
- [x] 4.2 Implementar `GET /api/talks/:slug/comments` — feed de comentários (rating, comment, created_at), mais recente primeiro, só votos com comentário
- [x] 4.3 Adicionar índice em `votes(talk_slug, created_at)` para suportar polling frequente sem degradar performance

## 5. Frontend — setup e identidade visual

- [x] 5.1 Inicializar projeto React 19 + TypeScript strict + Vite + TailwindCSS + shadcn/ui
- [x] 5.2 Configurar tema com marca "Vote ai" ("Vote" cor padrão, "ai" cor primária roxo/violeta, mesmo peso de fonte)
- [x] 5.3 Configurar client HTTP para consumir a API do backend

## 6. Frontend — tela de lista de talks

- [x] 6.1 Implementar tela inicial listando talks (título, palestrante) com cards diferenciados visualmente entre si
- [x] 6.2 Aplicar espaçamento mínimo definido no CLAUDE.md (gaps, padding de card, padding lateral mobile)
- [x] 6.3 Validar tema claro e escuro na tela

## 7. Frontend — tela de votação

- [x] 7.1 Implementar formulário de voto: seleção de nota 1-5 (obrigatória) e campo de comentário opcional
- [x] 7.2 Implementar submissão do voto contra `POST /api/talks/:slug/votes`, com feedback de sucesso/erro
- [x] 7.3 Adicionar navegação de volta para a lista de talks
- [x] 7.4 Validar tema claro e escuro na tela

## 8. Frontend — tela de resultado ao vivo

- [x] 8.1 Implementar exibição de estatísticas agregadas (média, total de votos) por talk
- [x] 8.2 Implementar feed de comentários visível (nota, comentário, horário), ordenado do mais recente pro mais antigo
- [x] 8.3 Implementar polling (3-5s) contra `stats` e `comments` para atualização em tempo real sem reload manual
- [x] 8.4 Tratar estado de talk sem votos (sem erro, com indicação clara de "sem votos ainda")
- [x] 8.5 Adicionar navegação de volta para a lista de talks
- [x] 8.6 Validar tema claro e escuro na tela

## 9. Containerização

- [x] 9.1 Criar Dockerfile multi-stage para o backend (build de produção)
- [x] 9.2 Criar Dockerfile multi-stage para o frontend (build de produção)
- [x] 9.3 Validar build local via `docker compose up` e smoke test manual dos fluxos principais

## 10. Validação com requisições reais

- [x] 10.1 Subir a aplicação via `docker compose up` e validar `GET /api/talks` com curl
- [x] 10.2 Validar `POST /api/talks/:slug/votes` com curl (voto com e sem comentário, incluindo caso de rating inválido)
- [x] 10.3 Validar `GET /api/talks/:slug/stats` e `GET /api/talks/:slug/comments` com curl, conferindo ordenação mais recente → mais antigo
- [x] 10.4 Documentar os comandos curl e resultados no corpo do PR

## 11. Deploy

- [ ] 11.1 Buildar imagens com `docker buildx build --platform linux/amd64` para `ghcr.io/apsferreira/voteai-backend` e `ghcr.io/apsferreira/voteai-frontend` (tag `:test`) — pulado por decisão do Antonio; deploy real ocorrerá via merge/pipeline automático (11.5)
- [ ] 11.2 Confirmar plataforma amd64 via `docker manifest inspect` antes de considerar o build concluído — n/a, ver 11.1
- [x] 11.3 Ajustar pontualmente `k8s/` apenas se algo específico exigir (sem reescrever os manifests existentes) — confirmado que os manifests existentes já batem com o backend implementado (env PORT/DATABASE_URL, porta 3000, /health), nenhum ajuste necessário
- [x] 11.4 Parar após validação automatizada (seção 10) e aguardar confirmação manual explícita do Antonio antes de marcar o PR como pronto pra review
- [x] 11.5 Após confirmação manual, marcar PR como "ready for review" (`gh pr ready`) — deploy real só ocorre via merge na `main` (pipeline automático), nunca manualmente

## 12. Validação de completude (funcionalidades visíveis e utilizáveis na UI)

- [x] 12.1 Confirmar que o voto anônimo com nota de 1 a 5 está visível e utilizável na interface (não só no endpoint/banco) — usuário consegue votar do início ao fim pela UI
- [x] 12.2 Confirmar que o comentário opcional aparece como campo real no formulário de voto na UI, não apenas aceito silenciosamente pela API
- [x] 12.3 Confirmar que as estatísticas em tempo real (média, total de votos) estão visíveis na tela de resultado e se atualizam sozinhas, sem reload manual
- [x] 12.4 Confirmar que a tela de resultado ao vivo existe como tela dedicada e acessível pela navegação da aplicação
- [x] 12.5 Confirmar que a lista de comentários (nota, comentário, horário) está visível na tela de resultado, ordenada do mais recente pro mais antigo — não apenas persistida no banco
- [x] 12.6 Confirmar que toda tela (lista, votação, resultado) tem navegação de volta clara e funcional, sem tela sem saída
- [x] 12.7 Confirmar visualmente que a interface funciona corretamente em tema claro E escuro em todas as telas
- [x] 12.8 Confirmar que a marca "Vote ai" está aplicada com a diferenciação visual correta (cor primária em "ai") em todas as telas
