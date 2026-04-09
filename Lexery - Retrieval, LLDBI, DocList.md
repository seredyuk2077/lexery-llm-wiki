---
aliases:
  - Retrieval, LLDBI, DocList
tags:
  - lexery
  - data
  - infra
created: 2026-04-09
updated: 2026-04-09
status: observed
layer: data
---

> [!info] Compiled from
> - `raw/architecture-docs/app-README.md`
> - `raw/architecture-docs/LEXERY_LEGAL_AI_AGENT_ARCHITECTURE.md`
> - `raw/architecture-docs/CURRENT_PIPELINE_STATE.md`

# Lexery - Retrieval, LLDBI, DocList

## Short Read

Якщо `apps/brain` є серцем Lexery, то retrieval/data plane є його **системою доказів**. Саме тут проєкт найсильніше відрізняється від generic AI chat products.

## Core Surfaces Today

### [[Lexery - LLDBI Surface|LLDBI]]

- Current repo surface:
  `apps/lldbi`
- Role:
  legal corpus retrieval/admin/repair surface.
- Brain relationship:
  Brain treats LLDBI as primary legal authority for retrieved law fragments.

### [[Lexery - DocList Surface|DocList]]

- Current repo surfaces:
  `apps/doclist-resolver-api`
  `apps/doclist-full-import`
  `apps/doclist-updater-db`
- Role:
  act catalog discovery, import, resolver, updater.

### Retrieval inside Brain

- Current module:
  `apps/brain/retrieval`
- Legacy ancestor:
  `scripts/lexery-legal-agent/retrieval`

## Why Retrieval Is So Central

- `docs/lexery-current-runtime-map.md` explicitly says U4 already had the strongest intelligence in the system.
- Retrieval already handled:
  LLDBI-first search, taxonomy support, query rewrite, routing hints, coverage-gap derivation.

## Legacy Evolution

### DocList / legislation phase

- January 2026 bridge repo history shows intense work around:
  daily updater, Qdrant sync, validation phases, soak tests, health gates, canonical JSON, importer correctness.
- This phase created the discipline that later Brain relies on.

### Architecture phase

- `plan.md` and `answer.md` describe retrieval not as one call, but as layered system:
  Query Understanding, Legal Navigator, Candidate Discovery, Act Acquisition, Chunk Retrieval, Evidence Assembly, Rerank/Coverage, WebHints fallback.

### Current phase

- `legal-agent-brain-dev` continues retrieval hardening:
  multi-goal retrieval, weak-evidence semantics, missing-act honesty, act recovery, query rewrite tests, doclist lookup tests.

## Structural Model

### Layer 1 — query shaping

- understand legal intent
- extract entities / citations
- derive routing hints

### Layer 2 — act discovery

- direct references
- LLDBI act index
- DocList catalog resolver

### Layer 3 — fragment retrieval

- retrieve legal snippets with provenance

### Layer 4 — evidence shaping

- trace, coverage, confidence, next-step signals

## Supreme Court Direction

### Observed in bridge repo

- `docs/supreme_court_rag.md`
- `docs/supreme_court_benchmark.md`
- earlier commit cluster around Supreme Court RAG

### Reading

- `Observed`:
  case law was explored seriously.
- `Inferred`:
  legislation remained the primary authoritative path, while case law was treated as an advanced or premium extension.

## Current Retrieval Truths

- LLDBI remains authority-first.
- DocList acts as discovery/catalog plane, not the answer writer.
- Retrieval quality is still a top engineering focus.
- [[Lexery - Coverage Gap Honesty|Honesty]] under missing or weak evidence is treated as product-critical.

## Current Limits

- soft / natural-language multi-goal queries still weaker than hard/direct citations
- product-shell integration of advanced retrieval is still incomplete
- some U7/U8 semantics are more explicit in docs and orchestration than in clean top-level module boundaries

## Best Synthesis

Lexery’s retrieval stack is not “RAG pasted onto chat”.
It is a layered legal evidence system built from:

- legislation corpus engineering
- act catalog discovery
- provenance discipline
- explicit coverage gating
- runtime loops that try to recover before the writer speaks

## Key Sources

- `apps/lldbi/**`
- `apps/doclist-*/**`
- `apps/brain/retrieval/**`
- `docs/lexery-current-runtime-map.md`
- bridge repo `scripts/legislation/**`
- bridge repo `docs/supreme_court_rag.md`

## See Also

- [[Lexery - Technology Stack]]
- [[Lexery - Brain Architecture]]
- [[Lexery - U1-U12 Runtime]]
- [[Lexery - Legacy Architecture Bridge]]
- [[Lexery - Deployment and Infra]]
- [[Lexery - LLDBI Surface]]
- [[Lexery - DocList Surface]]
- [[Lexery - Import Proposal Loop]]
- [[Lexery - Provider Topology]]
- [[Lexery - Storage Topology]]
- [[Lexery - Coverage Gap Honesty]]
- [[Lexery - Run Lifecycle]]
- [[Lexery - Memory and Documents]]
- [[Lexery - ORCH and Clarification]]
- [[Lexery - U6 Recovery]]
- [[Lexery - Log]]
