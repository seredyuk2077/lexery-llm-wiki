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

## Supabase / Postgres — LegalAgentDB

**Tables / concerns** (representative):

- **`legal_agent_runs`** — [[Lexery - Run Lifecycle|run]] rows and **`snapshot`** payloads (traces, ORCH, public trace mirrors)
- **`legislation_import_proposals`** — [[Lexery - Import Proposal Loop|import proposal]] queue and decisions

This database is the **source of truth** for **legal agent execution history** and **corpus gap ticketing**.

## Supabase / Postgres — App DB (Prisma)

Accessed through the **NestJS** API with **Prisma**:

- Users, workspaces, subscriptions
- Auth-adjacent application data

Keep **LegalAgentDB** vs **App DB** credentials separate in configuration — cross-DB joins do not exist at the SQL layer.

## Redis

Redis holds **transient** and **coordination** state:

- **BullMQ** queues — commonly **one queue per pipeline stage** ([[Lexery - Brain Architecture]])
- **RunContext** — per-run working state during active processing
- **Shared client pool** — namespace via **`REDIS_QUEUE_NAMESPACE`** (and related env) for **multi-tenant / multi-env isolation**

> [!warning] Redis is not the archive
> If Redis is flushed, **reconstruct** state from **Supabase snapshots** and replay policy — do not assume queues are durable.

## Qdrant

Vector indices for:

- **Legislation acts** — **`lexery_legislation_acts`** (~**374** acts observed)
- **Legislation chunks** — **`lexery_legislation_chunks`** (~**21,266** chunks observed)
- **Memory** semantic index — see [[Lexery - Memory and Documents]]

Mismatch between **DocList catalog** and **Qdrant** drives [[Lexery - Import Proposal Loop|import proposals]].

## Cloudflare R2

Object storage for:

- **Legislation document files** (source PDFs / derivatives depending on pipeline)
- **User-uploaded documents** with **presigned** access patterns

If R2 has the file but Qdrant lacks chunks, the issue is **ingestion/indexing**, not upload.

## Local filesystem

**Production** does not rely on local disk for authoritative data — only **dev/test artifacts** and ephemeral worker scratch (if configured).

> [!info] Debugging uploads
> For “I uploaded a file” issues, verify **R2 object**, **DB metadata**, and **processing job** in that order.

## Related

- [[Lexery - Provider Topology]]
- [[Lexery - Deployment and Infra]]
- [[Lexery - LLDBI Surface]]
- [[Lexery - Memory and Documents]]
- [[Lexery - API and Control Plane]]
- [[Lexery - Retrieval, LLDBI, DocList]]
- [[Lexery - Run Lifecycle]]
