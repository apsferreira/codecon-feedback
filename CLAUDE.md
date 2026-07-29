# Vote ai

## Contexto
Vote ai e um sistema de votacao ao vivo para eventos de tecnologia.
Criado ao vivo durante a palestra "SDD: para alem da sopa de letrinhas"
no meetup Codecon Salvador. Demonstra Spec Driven Development na pratica.

## Regras
- Toda implementacao deve seguir a spec formalizada em openspec/changes/ como fonte de verdade
- Commits em PT-BR, mensagens concisas
- Go 1.24, Fiber v2, PostgreSQL (pgx) para persistencia
- Backend escuta na porta 3000 (fixo — os manifests K8s ja assumem essa
  porta, nao usar outra)
- Frontend: React 19 + TypeScript strict + Vite + TailwindCSS + shadcn/ui
- Tudo roda via Docker Compose — nao assumir Go/Node instalados na maquina
- docker-compose.yml na raiz com servicos: backend, frontend
- Hot reload via volume mounts no docker-compose
- Dockerfile multi-stage para build de producao
- Nunca adicionar Co-Authored-By nos commits

## Design / UI
- NAO deixar no visual padrao do shadcn sem customizacao — isso fica
  generico e sem identidade
- Marca "Vote ai": "Vote" na cor de texto padrao, "ai" em destaque na cor
  primaria (roxo/violeta) — mesmo peso de fonte, sem separacao visual
- Usar a cor primaria de forma deliberada nos CTAs principais (botoes de
  acao primaria devem ter peso visual, nao ficar discretos)
- Cards de conteudo (talks, resultados) precisam de alguma diferenciacao
  visual entre si — tinte sutil de fundo por exemplo — nunca todos
  identicos e planos
- Espacamento — valores minimos, nao "generoso" (isso e subjetivo demais):
  - Entre bloco de cabecalho e subtitulo: mb-3/mt-3 (12px) no minimo
  - Entre subtitulo e lista de conteudo: mt-6 a mt-8 (24-32px) no minimo
  - Entre itens de uma lista/grid (cards): gap-4 (16px) no minimo
  - Padding interno de cada card: p-5 a p-6 (20-24px) em todos os lados
  - Padding lateral da pagina em mobile: px-4 (16px) no minimo
- Toda tela precisa de navegacao de volta clara (nao deixar tela sem
  saida)
- Testar visualmente em tema claro E escuro (o CSS segue
  prefers-color-scheme do sistema) — nao presumir que so um tema importa

## Workflow Git
- A branch main e protegida — NUNCA commitar direto na main
- Criar uma unica branch feature (ex: feat/votacao-ao-vivo) pra mudanca inteira
- Apos o /opsx:propose gerar os artefatos (proposal.md, design.md, specs/,
  tasks.md), commitar e dar push SO desses artefatos primeiro — checkpoint
  do que foi decidido, separado do codigo, mesmo que a implementacao
  precise ser refeita depois
- Logo em seguida, abrir um PR em modo draft (gh pr create --draft) so com
  os artefatos do propose
- Implementar seguindo o tasks.md — UM COMMIT POR TAREFA concluida (nao um
  commit gigante no final). Cada commit entra na mesma branch/PR draft,
  que vai crescendo e ficando revisavel commit a commit
- Antes de marcar o PR como pronto pra review, subir a aplicacao via
  docker compose e validar os endpoints principais com requisicoes reais
  (curl) — nunca declarar "testado" sem executar de fato; incluir os
  comandos e resultados no corpo do PR
- Depois dessa validacao automatizada, PARAR e avisar que esta pronto pra
  validacao manual (visual/funcional) — NAO marcar o PR como ready sozinho.
  So marcar "ready for review" (gh pr ready) e seguir depois de eu
  confirmar explicitamente que validei (ex: "validei, pode abrir/marcar o PR")
- Aguardar aprovacao do reviewer antes de mergear
- Isso garante que nenhum codigo entra sem revisao humana — nem a decisao
  de "esta pronto pra revisar" e automatica

## Banco de dados
- PostgreSQL do shared-infra (192.168.30.121:5432 em prod)
- Database: voteai
- O schema ja existe e esta seedado — NAO inventar nomes de tabela/coluna
  diferentes, usar exatamente este:

```sql
CREATE TABLE IF NOT EXISTS talks (
    slug VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    speaker VARCHAR(255) NOT NULL,
    description TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    talk_slug VARCHAR(100) NOT NULL REFERENCES talks(slug),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

- Migration SQL correspondente em migrations/001_init.sql

## Deploy K3s (regras de infra reais, nao inventar alternativas)
- NUNCA fazer deploy manual (kubectl apply, build+push seguido de apply
  direto no cluster). O deploy so acontece via merge do PR na main — isso
  dispara o pipeline automatico (.github/workflows/deploy.yml builda,
  publica a imagem e atualiza k8s/deployment.yaml; o ArgoCD sincroniza
  sozinho a partir dai). Se a tarefa de deploy do tasks.md perguntar como
  proceder, a resposta e sempre: parar, marcar o PR como pronto pra
  review (se a validacao manual ja tiver sido confirmada), e aguardar
  o merge — nunca oferecer rodar kubectl/docker push diretamente
- O cluster K3s roda em amd64 — SEMPRE buildar as imagens com
  `--platform linux/amd64` explicitamente (docker buildx build
  --platform linux/amd64 ... --push). NUNCA usar docker build simples
  numa maquina Apple Silicon sem especificar a plataforma, porque o
  default vira arm64 e os pods nao rodam no cluster (erro de
  arquitetura). Confirmar com `docker manifest inspect` que a
  plataforma amd64 aparece antes de considerar o build concluido
- Os manifests em k8s/ (namespace.yaml, backend-deployment.yaml,
  frontend-deployment.yaml, ingressroute.yaml) JA EXISTEM neste repo,
  prontos e ja validados contra o cluster real. NAO regenerar nem
  reescrever esses arquivos do zero — apenas usa-los como estao. Se
  algo especifico precisar mudar neles, ajustar pontualmente, nao
  substituir por uma versao nova
- Registry de imagens: ghcr.io/apsferreira/voteai-backend e
  ghcr.io/apsferreira/voteai-frontend (tag :test no ensaio, :latest no
  dia real). NUNCA inventar outro registry
- Segredos: usar um Secret comum do Kubernetes
  (kubectl create secret generic), aplicado manualmente fora do PR —
  NAO usar ExternalSecret/Vault. O ClusterSecretStore existente no
  cluster (vault-cluster-store) esta com status ValidationFailed, entao
  essa integracao nao funciona hoje
- IngressRoute: SEM bloco `tls`/`certResolver` — o TLS termina no
  Cloudflare Tunnel, nao no cluster, pros dominios *.antoniopedro.com.br.
  entryPoints deve ser so `web`
- Nomes dos recursos (Service, IngressRoute) devem ser exatamente
  voteai-backend e voteai-frontend, namespace codecon-test (ensaio) ou
  codecon (dia real) — nao usar variacoes de nome

## Talks do evento (dados reais, ja confirmados)
O seed de talks (migration/tarefa de seed) deve usar exatamente estes dados
— nao inventar palestras ficticias:

```sql
INSERT INTO talks (slug, title, speaker, description) VALUES
    ('sdd-sopa', 'SDD: para alem da sopa de letrinhas', 'Antonio Pedro Ferreira', 'Spec Driven Development na pratica'),
    ('escalando-nodejs', 'Escalando Node.js: Do Event Loop a Alta Concorrencia', 'Gabriel Santana', 'Engenheiro de Software na Revoluti')
ON CONFLICT (slug) DO NOTHING;
```
