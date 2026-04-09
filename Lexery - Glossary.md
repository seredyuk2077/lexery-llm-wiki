---
aliases:
  - Glossary
  - Terms
tags:
  - lexery
  - meta
created: 2026-04-09
updated: 2026-04-09
status: observed
layer: meta
---

# Lexery - Glossary

Canonical definitions for **Lexery-internal** and **Brain-pipeline** vocabulary. Use this page when docs, Linear, or chat use shorthand without context.

## How to use

- **Scan the table** for the term you hit in logs or code.
- Follow the **See Also** column in the tables below into stage docs and surface maps.
- Terms that span product + infra link to both [[Lexery - Brain Architecture]] and [[Lexery - Product Surface]] where useful.

## Core terms

| Term | Definition | See Also |
|------|------------|----------|
| **Brain** | The legal agent runtime engine (`apps/brain`). Processes legal queries through a U1–U12 pipeline. | [[Lexery - Brain Architecture]] |
| **ORCH** | Bounded orchestration layer that makes branch-point decisions using `gpt-5.2` structured reasoning or deterministic policy. | [[Lexery - ORCH and Clarification]] |
| **U1–U12** | The twelve pipeline stages of Brain: Gateway → Query Profiling → Planning → Retrieval → Gate → Recovery → Evidence Assembly → Legal Reasoning → Assemble → Writer → Verify → Deliver. | [[Lexery - U1-U12 Runtime]] |
| **LLDBI** | Lexery Legislation DataBase Index. Qdrant-backed legislation corpus. | [[Lexery - LLDBI Surface]] |
| **DocList** | Rada parliament catalog resolver for act identification and disambiguation. | [[Lexery - DocList Surface]] |
| **CacheRAG** | Historical name for the early retrieval system in the bridge repo, predecessor to U4. | [[Lexery - U4 Retrieval]] |
| **RunContext** | Redis-backed per-run state container during Brain processing. | [[Lexery - Run Lifecycle]] |
| **coverage_gap** | Indicator that Brain could not find sufficient legal evidence for a query. Values: `none`, `likely_missing_act`, `partial_coverage`. | [[Lexery - Coverage Gap Honesty]] |
| **public_trace** | Event stream for run execution visibility. API: `GET /v1/runs/:id/events`. | [[Lexery - Public Trace]] |
| **clarification** | `ASK_USER` mechanism for resolving ambiguity mid-pipeline. | [[Lexery - ORCH and Clarification]] |
| **retrieval_retry_request** | First-class contract for bounded U6→U4 recovery reruns. | [[Lexery - Retry and Recovery]] |
| **nreg** | Rada registration number for legislation acts (e.g., `2074-20`, `771/97-вр`). Case-sensitive in LLDBI lookups. | [[Lexery - LLDBI Surface]] |
| **Portal** | The user-facing web application (`apps/portal`). | [[Lexery - Portal Surface Map]] |
| **Mike Ross** | Original product codename/identity, from *Suits* character. | [[Lexery - Naming Evolution]] |
| **Lexora** | Intermediate brand identity between "Ukrainian Lawyer" and "Lexery". | [[Lexery - Naming Evolution]] |
| **MM** | Memory Manager — document and context memory subsystem. | [[Lexery - Memory and Documents]] |
| **import_proposal** | AI-generated suggestion to import a missing legislation act into LLDBI. | [[Lexery - Import Proposal Loop]] |
| **agentivity** | Internal term for the bounded orchestration + recovery upgrade (April 2026). | [[Lexery - Decision Registry]] |
| **compact-repair** | Post-write pass that shortens verbose answers. Skipped for multi-section structured answers. | [[Lexery - U10 Writer]] |
| **structure-repair** | Post-write pass that ensures required section headings exist. | [[Lexery - U10 Writer]] |
| **verdict** | U11 verification outcome: `complete`, `retry_write`, `retry_retrieval`, `ask_user`. | [[Lexery - U11 Verify]] |

## Derived terms (implementation & data plane)

These names appear constantly in `apps/brain` code, traces, and architecture docs.

| Term | Definition | See Also |
|------|------------|----------|
| **RunRecord** | Durable per-run row (e.g. Supabase): audit trail, persisted profiles, plans, and outcomes — contrast with hot RunContext in [[Lexery - Run Lifecycle]]. | [[Lexery - Contracts and Run Schema]] |
| **query_profile** | Structured U2 output: intent, legal domain, extracted entities, ambiguity strength, and routing flags feeding U3. | [[Lexery - U2 Query Profiling]] |
| **SearchPlan** | U3 rules-engine output: where to search (`use_lldbi`, `use_doclist`, thresholds, `reason_codes`, meta). | [[Lexery - U3 Planning]] |
| **U3a / Plan Builder** | Stage that expands `SearchPlan` into ordered `SearchStep[]` (chunks, acts, DocList, memory, web) before U4. | [[Lexery - U3 Planning]] |
| **GateDecision** | U5 outcome: whether evidence is strong enough to continue, needs [[Lexery - U6 Recovery]], or should stop/branch. | [[Lexery - U5 Gate]] |
| **evidence_assembly** | U7’s explicit pack of grounded evidence and traces consumed by U8 reasoning and downstream write path. | [[Lexery - U7 Evidence Assembly]] |
| **Qdrant** | Vector database used for LLDBI semantic retrieval over legislation chunks. | [[Lexery - LLDBI Surface]], [[Lexery - Retrieval, LLDBI, DocList]] |
| **R2 (snippets)** | Cloudflare R2 object storage holding canonical law snippet payloads U9 loads after U4 hits. | [[Lexery - U9 Assemble]], [[Lexery - Deployment and Infra]] |
| **ASK_USER** | Formal clarification channel paired with `clarification` — user-visible questions with run state coordination. | [[Lexery - ORCH and Clarification]] |
| **import_fast** | DocList-oriented fast path in plan building when catalog/disambiguation must run before deep retrieval. | [[Lexery - DocList Surface]], [[Lexery - Import Proposal Loop]] |
| **assembled_prompt** | U9 output: system + user + bounded law/memory/history context passed to U10. | [[Lexery - U9 Assemble]] |

## Conventions

- **Stage IDs** (`U1`…`U12`) refer to queue consumers and docs under `apps/brain/docs/architecture/app/`.
- **ENV-shaped flags** (`ORCH_ENABLED`, etc.) are deployment contracts — see [[Lexery - API and Control Plane]] and brain `lib/config` patterns.
- **Honesty signals** (`coverage_gap`, corpus-gap terminal states) tie UX copy to verifier policy — see [[Lexery - U8 Legal Reasoning]] and [[Lexery - U11 Verify]].

## Related navigation

- [[Lexery - Index]]
- [[Lexery - Brain Architecture]]
- [[Lexery - Project Brain]]
- [[Lexery - Source Map]] — where terminology is grounded in repo paths vs inference.

---

*If a term is missing, add a row here and link the defining doc or ADR in [[Lexery - Log]].*
