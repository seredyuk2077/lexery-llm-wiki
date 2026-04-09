---
aliases:
  - Decision Registry
  - Decisions
  - ADRs
tags:
  - lexery
  - meta
created: 2026-04-09
updated: 2026-04-09
status: observed
layer: governance
---

# Decision registry

Central list of **architectural and product decisions** for Lexery. Sources: `docs/adr/` in the repo, recurring **code patterns**, and **Linear** issues. Use this note as a map; the repo remains **source of truth** for full ADR text.

For unresolved tension and drift, see [[Lexery - Open Questions and Drift]].

---

## 1. ADR: Agentivity upgrade

- **Decision:** Introduce a **bounded ORCH plane** with structured decisions (e.g. `gpt-5.2`) instead of unconstrained tool-chaining everywhere.
- **Context:** Safer orchestration, clearer audit trail, alignment with legal-agent risk profile.
- **Alternatives:** Fully reactive tool loops without a dedicated ORCH layer; heavier hard-coded state machines only.
- **When / source:** Documented in `docs/adr/ADR-agentivity-upgrade.md`.
- **Maps to:** [[Lexery - ORCH and Clarification]], [[Lexery - Brain Architecture]].

## 2. Monorepo (Turborepo + pnpm)

- **Decision:** One workspace for apps and packages with **Turborepo** orchestration and **pnpm** for installs and linking.
- **Context:** Shared contracts, single CI story, coordinated releases across portal and services.
- **Alternatives:** Multi-repo with published packages; Nx instead of Turborepo.
- **When:** ~Mar 2026 (align with [[Lexery - PR Chronology|frontend migration PR]]).
- **Maps to:** [[Lexery - API and Control Plane]], [[Lexery - Current State]].

## 3. NestJS for API

- **Decision:** **NestJS** as the primary **control plane** HTTP/API framework.
- **Context:** Module boundaries, decorators, ecosystem fit for medium-large backend.
- **Alternatives:** Fastify-only minimal stack; other Node frameworks.
- **When:** ~Mar 2026.
- **Maps to:** [[Lexery - API and Control Plane]].

## 4. Redis queue-first pipeline

- **Decision:** **U1–U12** stages communicate primarily via **Redis queues** (async handoff between consumers).
- **Context:** Horizontal scaling, backpressure, retries independent of HTTP request lifetime.
- **Alternatives:** In-process only pipeline; Kafka-first (heavier ops).
- **When:** Early 2026 (evolution of Brain runtime).
- **Maps to:** [[Lexery - U1-U12 Runtime]], [[Lexery - Brain Architecture]], [[Lexery - Deployment and Infra]].

## 5. LLDBI as corpus truth

- **Decision:** **Qdrant-backed** legislation index (**LLDBI**) is the **retrieval truth** for statutory material, not ad hoc raw DB queries from the agent path.
- **Context:** Consistent embeddings, filtering, and operational ownership of the corpus.
- **Alternatives:** Direct SQL-only retrieval; per-run scraping.
- **When:** ~2025 (corpus hardening phase).
- **Maps to:** [[Lexery - Retrieval, LLDBI, DocList]], [[Lexery - Corpus Evolution]].

## 6. OpenRouter for model routing

- **Decision:** Route LLM calls through **OpenRouter** for **multi-provider** access and model selection.
- **Context:** Avoid single-vendor lock-in; swap models per stage.
- **Alternatives:** Single cloud provider SDK only; self-hosted inference everywhere.
- **When:** Ongoing.
- **Maps to:** [[Lexery - Brain Architecture]], [[Lexery - Deployment and Infra]].

## 7. Supabase for user and run state

- **Decision:** **Supabase** (Legal Agent DB) holds **user** and **run snapshot** state the product depends on.
- **Context:** Auth-adjacent patterns, RLS options, managed Postgres.
- **Alternatives:** Self-managed Postgres only; Firebase-style document store.
- **When:** ~2025.
- **Maps to:** [[Lexery - API and Control Plane]], [[Lexery - Contracts and Run Schema]], [[Lexery - Memory and Documents]].

## 8. Clarification as first-class stage

- **Decision:** **ASK_USER** / clarification is a **first-class pipeline stage** with **bounded resume** (not a one-off hack).
- **Context:** Legal queries are often under-specified; safe pause/resume beats guessing.
- **Alternatives:** Inline chat-only UX without pipeline semantics; blocking synchronous prompts only.
- **When:** Apr 2026.
- **Maps to:** [[Lexery - ORCH and Clarification]], [[Lexery - U1-U12 Runtime]].

## 9. Delta-first DocList

- **Decision:** **DocList** resolver emphasizes **delta** semantics: act disambiguation, catalog gap detection, incremental maintenance.
- **Context:** Legislation corpus changes over time; agents need stable document identity.
- **Alternatives:** Full re-index only; string matching without structured doc IDs.
- **When:** ~2026.
- **Maps to:** [[Lexery - Retrieval, LLDBI, DocList]].

## 10. Brain–LLDBI bridge

- **Decision:** **Brain emits hints**; **LLDBI admin** can **propose imports** with a degree of autonomy (human-in-the-loop where required).
- **Context:** Close the loop between “what the agent needed” and “what the corpus lacks.”
- **Alternatives:** Manual corpus updates only; fully automated imports without review.
- **When:** Apr 2026.
- **Maps to:** [[Lexery - Retrieval, LLDBI, DocList]], [[Lexery - Brain Architecture]], [[Lexery - Project Brain]] (if used for ops notes).

---

## How to extend this registry

1. Add a row here with **decision / context / alternatives / date**.
2. For material choices, add or update an ADR under `docs/adr/`.
3. Link the relevant runtime or product note so the graph stays navigable.

## Related notes (summary)

- [[Lexery - Brain Architecture]]
- [[Lexery - ORCH and Clarification]]
- [[Lexery - API and Control Plane]]
- [[Lexery - Retrieval, LLDBI, DocList]]
- [[Lexery - Deployment and Infra]]
- [[Lexery - Open Questions and Drift]]

## Українською (коротко)

**Реєстр рішень:** ORCH і агентність, монорепо, NestJS, Redis-черги, LLDBI як джерело істини для корпусу, OpenRouter, Supabase, стадія уточнення, DocList (дельти), міст Brain ↔ LLDBI. Деталі — у відповідних нотатках і ADR у репозиторії.
