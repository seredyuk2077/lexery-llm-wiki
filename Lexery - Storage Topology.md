---
aliases:
  - Storage Topology
  - Storage
  - Data Stores
tags:
  - lexery
  - data
  - infra
created: 2026-04-09
updated: 2026-04-09
status: observed
layer: data
---

# Lexery — Storage Topology

This note lists **where durable and ephemeral data live**. Use it alongside [[Lexery - Provider Topology]] when tracing a bug from **UI** → **API** → **worker** → **DB/vector/object store**.

## Cloudflare R2 — Object Storage

Два окремі бакети забезпечують розділення legislation data від runtime artifacts:

### `legislation` bucket

Зберігає **canonical act JSON** — структуровані файли нормативних актів, отримані з [[Lexery - DocList Surface|Rada catalog]]. Кожен файл містить повний текст акту, metadata (назва, номер, дата прийняття, статус) і structured article breakdown. Ці файли є source of truth для ingestion pipeline — [[Lexery - LLDBI Surface|LLDBI]] chunking і Qdrant indexing читають саме звідси.

### `lexery-legal-agent` bucket

Зберігає runtime і pipeline artifacts:

- **Run artifacts** — intermediate outputs від [[Lexery - Brain Architecture|Brain]] stages для post-hoc analysis
- **MM offload** — multi-modal document content, що занадто великий для inline storage в Supabase snapshots
- **Document chunks** — pre-processed chunks для [[Lexery - U9 Assemble|assembly]] stage
- **User uploads** — файли, завантажені через [[Lexery - Portal Surface Map|Portal]] attachments

Доступ через **presigned URLs** — Portal і Brain ніколи не зберігають R2 credentials на клієнті.

## Supabase / Postgres — LegalAgentDB

**Source of truth** для legal agent execution history і corpus gap ticketing.

**Tables / concerns** (representative):

- **`legal_agent_runs`** — [[Lexery - Run Lifecycle|run]] rows і **`snapshot`** payloads (traces, ORCH, public trace mirrors)
- **`legal_agent_sessions`** — user sessions з conversation history і workspace binding
- **`legislation_import_proposals`** — [[Lexery - Import Proposal Loop|import proposal]] queue і decisions
- **`legal_agent_memory`** — [[Lexery - Memory and Documents|long-horizon memory]] entries: summaries, extracted facts, user context across runs

## Supabase / Postgres — Legislation RAG DB

Окремий Supabase проєкт для legislation catalog management:

- **`legislation_documents`** — **374 акти** з metadata, qdrant_status tracking (`indexed` / `pending` / `failed`), last sync timestamps
- **`legislation_import_jobs`** — **966 processed jobs**: кожен job відповідає за import або re-index конкретного акту
- **`legislation_chunks_metadata`** — tracking для chunk-level indexing status, quality scores, version history

Ізоляція від LegalAgentDB — на рівні окремих Supabase projects і credentials. Cross-DB joins не існують.

## Redis

Redis holds **transient** і **coordination** state:

- **BullMQ** queues — зазвичай **one queue per pipeline stage** ([[Lexery - Brain Architecture]])
- **RunContext** — per-run working state під час активної обробки: intermediate results, stage outputs, retry counters
- **Run context cache** — швидкий доступ до frequently read run data без Supabase roundtrips
- **Shared client pool** — namespace via **`REDIS_QUEUE_NAMESPACE`** (і related env) для **multi-tenant / multi-env isolation**

> [!warning] Redis is not the archive
> Якщо Redis flushed, **reconstruct** state з **Supabase snapshots** і replay policy — не вважайте queues durable.

## Qdrant

Vector indices розподілені по кількох collections:

- **Legislation chunks** — **`lexery_legislation_chunks`** (~**21,266** chunks): semantic search по текстах нормативних актів, кожен chunk прив'язаний до конкретного акту і статті
- **Legislation acts** — **`lexery_legislation_acts`** (~**374** acts): metadata-level vectors для act-level similarity і [[Lexery - DocList Surface|disambiguation]]
- **Lexery-LA Memory semantic** — vectors для [[Lexery - Memory and Documents|agent memory]]: user context, conversation summaries, extracted legal patterns
- **MM Docs** — vectors для [[Lexery - U9 Assemble|multi-modal document]] content: tables, diagrams, structured data з uploaded documents

Mismatch між **DocList catalog** і **Qdrant** drives [[Lexery - Import Proposal Loop|import proposals]]. Cross-check: [[Lexery - Coverage Gap Honesty]].

## Local filesystem

**Production** does not rely on local disk for authoritative data — only **dev/test artifacts** і ephemeral worker scratch (if configured).

> [!info] Debugging uploads
> Для "I uploaded a file" issues, verify **R2 object**, **DB metadata**, і **processing job** — саме в такому порядку.

## Related

- [[Lexery - Provider Topology]]
- [[Lexery - Deployment and Infra]]
- [[Lexery - LLDBI Surface]]
- [[Lexery - Memory and Documents]]
- [[Lexery - API and Control Plane]]
- [[Lexery - Retrieval, LLDBI, DocList]]
- [[Lexery - Run Lifecycle]]
- [[Lexery - Cost Ledger]]

## See Also

- [[Lexery - Technology Stack]]
- [[Lexery - DocList Surface]]
- [[Lexery - Glossary]]
