---
aliases:
  - U4 Retrieval
tags:
  - lexery
  - brain
  - runtime
created: 2026-04-09
updated: 2026-04-09
status: observed
layer: brain
---

> [!info] Compiled from
> - `raw/architecture-docs/app-README.md`

# Lexery - U4 Retrieval

## Роль у Pipeline

U4 — **головний retrieval engine** [[Lexery - Brain Architecture|Brain]]: перетворює виконувальні кроки з [[Lexery - U3 Planning|U3 SearchPlan]] на реальні vector-hits із [[Lexery - LLDBI Surface|LLDBI / Qdrant]], memory, та інших джерел. Це найскладніша і найконфігурабельніша стадія pipeline: десятки env-змінних, кілька retrieval modes, query rewrite, multi-goal fusion, planner routing, OOD guard, reference expansion — і все це до того, як [[Lexery - U5 Gate|U5 Gate]] вирішить, чи достатньо знайденого.

Результат — **`retrieval_trace`** і **`raw_hits`** у [[Lexery - Contracts and Run Schema|RunContext]], які споживаються U5 (gate), U7 (evidence assembly), і далі U9/U10 (writer).

## Code Surfaces

- `apps/brain/retrieval/consumer.ts` — `handleU4Event`: оркестрація етапів retrieval, persist, enqueue U5
- `apps/brain/retrieval/queryRewrite.ts` — query rewrite phase: перефразування запиту для vector search
- `apps/brain/retrieval/planRules.ts` — маппінг SearchStep → retrieval strategy
- `apps/brain/retrieval/fusion.ts` — multi-query RRF (Reciprocal Rank Fusion) для об'єднання результатів
- `apps/brain/retrieval/referenceExpansion.ts` — reference expansion: доповнення hits пов'язаними статтями
- `apps/brain/retrieval/articleBackfill.ts` — article backfill для direct citation gaps
- `apps/brain/retrieval/oodGuard.ts` — Out-of-Domain guard: відсікання запитів поза юрисдикцією
- `apps/brain/retrieval/helpers/*` — finalization clusters, hit dedup, scoring normalization

## Конфігурація (найбільша серед усіх stages)

**Qdrant / Vector:**

| Ключ | Призначення |
|---|---|
| `QDRANT_URL` | URL Qdrant vector DB instance |
| `QDRANT_API_KEY` | API key для Qdrant auth |
| `LLDBI_TOP_K` | Кількість top-k hits з vector search |

**Feature Flags і Caps:**

| Ключ | Призначення |
|---|---|
| `MIXED_MODE_LAW_CAPS` | Ліміти law hits для mixed-mode (memory + law) |
| `MULTI_GOAL_FUSION_ENABLED` | Увімкнення multi-goal RRF fusion |
| `QUERY_REWRITE_ENABLED` | Дозвіл LLM query rewrite перед vector search |
| `MULTI_QUERY_RRF_ENABLED` | Дозвіл multi-query Reciprocal Rank Fusion |
| `REFERENCE_EXPANSION_ENABLED` | Розширення hits пов'язаними article references |
| `ARTICLE_BACKFILL_ENABLED` | Доповнення прямих citation gaps |
| `OOD_GUARD_ENABLED` | Out-of-Domain guard filter |
| `PLANNER_ACT_PLANNER_ENABLED` | Act-level planner routing |

Більшість feature flags мають парні `*_MODEL` та `*_TIMEOUT_MS` для LLM-driven фаз (query rewrite, OOD guard).

## Runtime Behavior

**Input:** `SearchStep[]` з [[Lexery - U3 Planning|U3a]], `query_profile` з [[Lexery - U2 Query Profiling|U2]], RunContext.

**Етапи виконання:**

1. **Query Rewrite** — LLM перефразовує оригінальний query у vector-friendly форму; зберігає оригінал для fallback.
2. **Vector Search** — parallel запити до [[Lexery - LLDBI Surface|Qdrant]] за кожним `SearchStep` (chunks, acts, memory); `LLDBI_TOP_K` визначає глибину.
3. **Multi-Query RRF** — якщо є кілька варіантів query (rewrite + original), результати об'єднуються через Reciprocal Rank Fusion з configurable weights.
4. **Multi-Goal Fusion** — для запитів з кількома legal goals (наприклад, «чи можна звільнити + які виплати»), окремі sub-goal hits зливаються у єдиний ranked list.
5. **Reference Expansion** — hits доповнюються пов'язаними статтями (наприклад, стаття 232 КЗпП → стаття 233 з процедурними деталями).
6. **Article Backfill** — якщо `query_profile` містить `article_ref` а прямий hit відсутній, backfill шукає конкретну статтю.
7. **OOD Guard** — відсікає запити, де найкращі hits не перетинають поріг релевантності (Out-of-Domain).
8. **Finalization** — dedup, scoring normalization, coverage-gap derivation, trace shaping.

**Output:** `retrieval_trace` (meta: `coverage_gap`, timing, hit stats) і `raw_hits` у RunContext; enqueue **U5**.

## Test Coverage

| Тест | Фокус |
|---|---|
| `test_plan_rules_units.ts` | Маппінг SearchStep → retrieval strategy |
| `test_query_rewrite_phase_units.ts` | Query rewrite LLM phase |
| `test_rag_golden_eval_units.ts` | Golden evaluation: precision/recall на reference queries |
| `test_rag_units.ts` | Core retrieval pipeline end-to-end |
| `test_retrieval_consumer_units.ts` | Consumer orchestration, error handling |
| `test_u4_memory_propagation_units.ts` | Memory items propagation через retrieval |
| `test_verify_retrieval_real_dev_units.ts` | Real-dev verification з живим Qdrant |
| 4 stress tests | Concurrency, large result sets, timeout resilience |

## Failure Modes

- **Qdrant timeout / unreachable:** retrieval degraded; `retrieval_trace.meta.degraded_lldbi = true`; [[Lexery - U5 Gate|U5]] бачить `DEGRADED_LLDBI` reason code.
- **Query rewrite hallucination:** rewrite phase може змінити семантику запиту; fallback на оригінал зменшує ризик.
- **Post-U4 tail latency:** відома проблема з архітектурних docs — multi-query RRF + reference expansion + Qdrant round-trips складають основну частину pipeline latency.
- **Mixed-mode caps:** занадто агресивні `MIXED_MODE_LAW_CAPS` → memory-heavy запити втрачають law context і навпаки.

## Взаємодія з іншими стадіями

**Від [[Lexery - U3 Planning|U3]]:** executable `SearchStep[]` + thresholds. **Від [[Lexery - U2 Query Profiling|U2]]:** `query_profile` (entities, intent, ambiguity, routing_flags). **До [[Lexery - U5 Gate|U5]]:** `retrieval_trace`, `raw_hits`. **Зворотний цикл через [[Lexery - U6 Recovery|U6]]:** при expand gate U6 може повернути run до U4 (`RUN_U4`) з оновленими cues для повторного retrieval.

## Історична еволюція

Почалося як legacy `CacheRAG` з простим vector search. Гілка `codex/legal-rag-foundation` додала helper clustering, soft-query honesty, multi-goal coverage. Поточна `legal-agent-brain-dev` продовжує з query rewrite і recovery optimization. Runtime docs визнають, що U4 мав **найсильніший інтелект** у системі ще до [[Lexery - ORCH and Clarification|ORCH]] upgrade.

## Current Risk / Opportunity

- Сильний на direct / hard references (конкретна стаття конкретного акту).
- Слабший на soft multi-goal natural legal requests (абстрактні питання з кількома правовими аспектами).
- Tail latency залишається ключовим bottleneck для загального часу відповіді.

## See Also

- [[Lexery - Retrieval, LLDBI, DocList]]
- [[Lexery - U5 Gate]]
- [[Lexery - Corpus Evolution]]
- [[Lexery - LLDBI Surface]]
- [[Lexery - Provider Topology]]
- [[Lexery - Run Lifecycle]]
- [[Lexery - Retry and Recovery]]
- [[Lexery - Coverage Gap Honesty]]
- [[Lexery - U3 Planning]]
- [[Lexery - U6 Recovery]]
- [[Lexery - ORCH and Clarification]]
- [[Lexery - Brain Architecture]]
- [[Lexery - U7 Evidence Assembly]]
- [[Lexery - Import Proposal Loop]]
- [[Lexery - U8 Legal Reasoning]]
- [[Lexery - U10 Writer]]
- [[Lexery - U11 Verify]]
