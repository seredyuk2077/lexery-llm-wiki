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
| **assembled_prompt** | U9 output persisted on the run: compact assembled-prompt metadata and the bounded system/user/law/memory/history context bundle passed to U10. | [[Lexery - U9 Assemble]], [[Lexery - Contracts and Run Schema]] |
| **act_planner** | U4 LLM-first act routing path (budgeted model, token tiers, and per-run call caps) that proposes which acts to retrieve. | [[Lexery - U4 Retrieval]] |
| **act_taxonomy_store** | TTL-cached act taxonomy/metadata from Supabase Legislation (`ACT_TAXONOMY_TTL_SEC`) backing act-aware U4 routing and resolution. | [[Lexery - LLDBI Surface]], [[Lexery - U4 Retrieval]] |
| **article_backfill** | U4 pass that adds retrieval hits for article references present in the query but missing from semantic top results, without domain wordlists. | [[Lexery - U4 Retrieval]] |
| **budget_profile** | U9 snippet budgeting mode: `default` vs `gpt5` (larger per-snippet and total law char ceilings for GPT-5-class models). | [[Lexery - U9 Assemble]] |
| **circuit_breaker** | U2 classify failure accumulator that opens after repeated LLM errors and forces rule-based or degraded classification instead of calling the classifier model. | [[Lexery - U2 Query Profiling]] |
| **compact_repair** | U10 post-write pass that shortens overly verbose answers (same capability as core **compact-repair**, named here as persisted/trace field style). | [[Lexery - U10 Writer]] |
| **degraded_flags** | Run/snapshot indicators that a subsystem used a fallback path (e.g. non-fatal memory fetch failure, circuit open, stub LLM). | [[Lexery - Run Lifecycle]], [[Lexery - Public Trace]] |
| **evidence_triage** | U10 pre-write LLM stage that selects which law snippets to keep when many candidates exceed the triage threshold, before the main Legal Agent call. | [[Lexery - U10 Writer]] |
| **focus_spec** | U10 `FocusSpec`: task type, law-snippet caps, primary norm hints, required sections, and validator constraints derived from query and assembled metadata. | [[Lexery - U10 Writer]] |
| **idempotency_key** | Client-supplied deduplication key on run creation so identical logical requests collapse to one processed run. | [[Lexery - Contracts and Run Schema]], [[Lexery - API and Control Plane]] |
| **lease_schema** | Durable-queue lease pattern on `mm_outbox` rows: `worker_id`, `lease_expires_at`, and `attempt_count` (plus related staleness rules). | [[Lexery - Memory and Documents]] |
| **lldbi_soft_prior** | U4 score shaping that boosts act candidates whose LLDBI category or `doc_type` matches U2 LLDBI hints (data-driven boosts, capped). | [[Lexery - U4 Retrieval]], [[Lexery - U2 Query Profiling]] |
| **memory_recent** | Bounded per-run fetch of recent `mm_memory_items` from Supabase; failures are non-fatal and mark degraded behavior. | [[Lexery - Memory and Documents]] |
| **memory_semantic** | Optional Qdrant semantic recall over the dedicated memory collection (`lexery_memory_semantic_v1`) when `MEMORY_SEMANTIC_ENABLED` is on. | [[Lexery - Memory and Documents]], [[Lexery - Provider Topology]] |
| **mm_offload** | MM path that stores oversized memory item bodies in R2 while Supabase keeps a short preview (`MM_OFFLOAD_*` thresholds). | [[Lexery - Memory and Documents]], [[Lexery - Storage Topology]] |
| **mm_outbox** | Durable Supabase outbox table of memory-extraction events processed by batch API or an optional background worker (`MM_OUTBOX_WORKER_ENABLED`). | [[Lexery - Memory and Documents]] |
| **multi_goal_fusion** | U4 multi-goal evidence mode: up to `U4_GOALS_MAX` goals with per-goal minimum hits checked inside a shared fusion top-N window. | [[Lexery - U4 Retrieval]] |
| **multi_query** | U4 retrieval mode that runs reciprocal rank fusion (RRF) across the primary query plus `query_variants` for synonym/paraphrase recall. | [[Lexery - U4 Retrieval]] |
| **ood_guard** | U4 out-of-domain confidence guard that can force `low_confidence` when scores are weak and domain signals are missing. | [[Lexery - U4 Retrieval]] |
| **prompt_composer** | Pre-U10 complexity router that picks a light vs heavy model to shape the writer prompt from run context (`PROMPT_COMPOSER_*` thresholds). | [[Lexery - U10 Writer]] |
| **prompt_stack** | Layered system instructions merged for U10: **global → project → chat → user**, stored in `runs.snapshot.prompt_stack` from `client_context.prompt_stack`. | [[Lexery - U10 Writer]], [[Lexery - U1 Gateway]] |
| **query_overflow_r2** | U1 behavior when the user query exceeds `QUERY_R2_THRESHOLD_BYTES`: full text goes to R2 and the DB row stores head/tail previews only. | [[Lexery - U1 Gateway]], [[Lexery - Storage Topology]] |
| **query_rewrite** | U4 always-on LLM step that enriches short or raw user text into a rewritten query plus variants and optional negative terms when confidence is high enough. | [[Lexery - U4 Retrieval]] |
| **queue_driver** | Brain queue backend selection: in-memory vs Redis (`QUEUE_DRIVER`), paired with worker deployment topology. | [[Lexery - Deployment and Infra]], [[Lexery - Run Lifecycle]] |
| **reference_expansion** | U4 pass that parses cross-references from top chunks, resolves acts via taxonomy, and adds budgeted extra Qdrant hits. | [[Lexery - U4 Retrieval]] |
| **retrieval_trace** | Retrieval observability split between a compact trace suitable for the database and a fuller artifact in R2 for deep debugging. | [[Lexery - U4 Retrieval]], [[Lexery - Storage Topology]] |
| **routing_hints** | U4 budgeted LLM recovery that proposes retrieval hints when evidence is weak, conflicting, or coverage fails (low/zero recall path). | [[Lexery - U4 Retrieval]], [[Lexery - Retry and Recovery]] |
| **run_context_driver** | RunContext persistence backend: in-memory vs Redis (`RUN_CONTEXT_DRIVER`), including optional compression thresholds for large blobs. | [[Lexery - Run Lifecycle]], [[Lexery - Deployment and Infra]] |
| **smart_gating** | U2 optimization that skips classifier LLM calls when rule-based confidence is at least `U2_GATING_CONFIDENCE_THRESHOLD` and the input is not complex. | [[Lexery - U2 Query Profiling]] |
| **structure_repair** | U10 post-write pass that injects or normalizes required section headings (same capability as core **structure-repair**, snake_case for log fields). | [[Lexery - U10 Writer]] |
| **u4_rerank** | Optional U4 LLM reranker over candidate hits with a strict timeout and fallback to hybrid re-scoring when disabled or slow. | [[Lexery - U4 Retrieval]] |
| **u4_weak_labeler** | Optional U4 LLM weak-labeling pass for low-confidence retrieval labels, gated by `U4_LABELER_ENABLED` and confidence thresholds. | [[Lexery - U4 Retrieval]] |
| **u9_meta_triage** | U9 LLM metadata pre-triage that selects relevant hits from the full raw retrieval set (not only top-N by score) before R2 snippet assembly. | [[Lexery - U9 Assemble]] |

## Configuration Terms

Brain `lib/config` (see snapshot `raw/codebase-snapshots/brain-config.ts`) maps these environment variables to runtime behavior:

- **CLF_MODEL_ID** — OpenRouter model id for U2 structured classification / classifier LLM calls (with optional `CLF_FALLBACK_MODEL_ID` and `CLF_TIMEOUT_SEC`). See [[Lexery - U2 Query Profiling]].
- **LEGAL_AGENT_MODEL_ID** — Primary U10 Legal Agent completion model (alias env: `U10_MODEL_ID`), with separate repair models via `U10_REPAIR_MODEL_ID` / `LEGAL_AGENT_REPAIR_MODEL_ID`. See [[Lexery - U10 Writer]].
- **U4_PLANNER_ENABLED** — Master switch for the selective U4 retrieval planner LLM (default on); disables structured planning when `false`. See [[Lexery - U4 Retrieval]].
- **ORCH_ENABLED** — Enables the bounded orchestrator (`gpt-5.2` structured JSON) for branch decisions, clarification loops, and recovery policy; when `false`, direct stage paths and caps still apply. See [[Lexery - ORCH and Clarification]].
- **MEMORY_SEMANTIC_ENABLED** — Opt-in flag for Qdrant semantic memory over `lexery_memory_semantic_v1` (requires memory cluster configuration). See [[Lexery - Memory and Documents]].
- **U9_BUDGET_PROFILE** — Set to `gpt5` to apply larger U9 law-snippet and total-char budgets tuned for GPT-5-class context; any other value keeps the `default` profile. See [[Lexery - U9 Assemble]].

## Conventions

- **Stage IDs** (`U1`…`U12`) refer to queue consumers and docs under `apps/brain/docs/architecture/app/`.
- **ENV-shaped flags** (`ORCH_ENABLED`, etc.) are deployment contracts — see [[Lexery - API and Control Plane]] and brain `lib/config` patterns.
- **Honesty signals** (`coverage_gap`, corpus-gap terminal states) tie UX copy to verifier policy — see [[Lexery - U8 Legal Reasoning]] and [[Lexery - U11 Verify]].

## Related navigation

- [[Lexery - Index]]
- [[Lexery - Brain Architecture]]
- [[Lexery - Project Brain]]
- [[Lexery - Source Map]] — where terminology is grounded in repo paths vs inference.
- [[Lexery - Brain Test and Verify Map]] — усі `pnpm brain:*` scripts у одному місці.
- [[Lexery - Brain Environment Reference]] — env knobs з `config.ts`.
- [[Lexery - Legal Agent Quality Priorities]] — пріоритет soft queries і RAG-дисципліна.

---

*If a term is missing, add a row here and link the defining doc or ADR in [[Lexery - Log]].*

## See Also

- [[Lexery - Provider Topology]]
- [[Lexery - Storage Topology]]
- [[Lexery - Unknowns Queue]]
