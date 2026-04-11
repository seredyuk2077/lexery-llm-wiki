---
aliases:
  - U6 Recovery
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

# Lexery - U6 Recovery

## Роль у Pipeline

U6 — **expand / recovery** стадія: коли [[Lexery - U5 Gate|U5 Gate]] вирішує `expand === true`, U6 намагається знайти додаткові докази, яких бракує першому проходу [[Lexery - U4 Retrieval|U4]]. Замість фабрикації повноти, U6 чесно або знаходить реальні додаткові hits, або маркує неможливість відновлення — це фундамент [[Lexery - Coverage Gap Honesty|coverage-gap honesty]] у системі.

U6 може повернути run **назад до U4** (`RUN_U4`) через [[Lexery - ORCH and Clarification|ORCH]] для повторного evidence cycle з оновленими cues, або просунути далі до [[Lexery - U7 Evidence Assembly|U7]] якщо recovery вичерпана.

## Code Surfaces

- `apps/brain/expand/consumer.ts` — `handleU6Event`: load RunContext, execute recovery strategy, persist, enqueue **RUN_U4** або **U7**
- `apps/brain/lib/pipeline/contracts.ts` — `RetrievalRetryRequest`, `hasPendingRetrievalRetry`, `DoclistTrace`
- `apps/brain/lib/config.ts` — `DOCLIST_API_URL`, `U6_DIRECT_RETRY_MAX`, expand-specific flags

Документація: `apps/brain/docs/architecture/app/u6/README.md`.

## Конфігурація

| Ключ | Призначення |
|---|---|
| `DOCLIST_API_URL` | URL [[Lexery - DocList Surface|Cloudflare Worker]] для DocList API |
| `U6_DIRECT_RETRY_MAX` | Максимальна кількість direct retry reruns через U4 |
| `DOCLIST_ENABLED` | Global toggle для DocList resolution |

`U6_DIRECT_RETRY_MAX` обмежує bounded recovery: навіть при persistent `expand === true` від gate, U6 не дозволить нескінченний цикл. Після досягнення ліміту run просувається до [[Lexery - U7 Evidence Assembly|U7]] з `support_level: weak` або `partial`.

## Runtime Behavior

**Input:** `RunContext` з `gate_decision` (expand === true), `retrieval_trace`, `raw_hits`, `query_profile`, `search_plan`, опційно `retrieval_retry_request`.

**Recovery strategies:**

1. **DocList Resolution** — основна стратегія: запит до [[Lexery - DocList Surface|DocList Cloudflare Worker]] для resolve актів через Qdrant catalog. Worker приймає act name / abbreviation / rada_nreg і повертає знайдені акти з metadata. Reason codes: `ACT_FOUND_IN_CATALOG_NOT_INDEXED`, `ACT_NOT_FOUND_IN_CATALOG`, `AMBIGUOUS_ACT_MATCH`.
2. **Seeded Rerun** — повернення до [[Lexery - U4 Retrieval|U4]] (`RUN_U4`) з оновленими cues: додаткові act hints, уточнені query parameters, розширені search steps. Rerun реюзає попередній `retrieval_trace` для cost reduction.
3. **Direct Retry** — bounded retry до `U6_DIRECT_RETRY_MAX`: при transient Qdrant / network failures U6 ставить `retrieval_retry_request.pending` і повертає до U4 без зміни cues.

**Bounded recovery flow:**

```
U5 (expand=true) → U6 → DocList resolve → ORCH → RUN_U4 (rerun) → U5 → ...
```

Цикл обмежений `U6_DIRECT_RETRY_MAX` і DocList resolution finality. Після вичерпання — forward до **U7**.

**Output:** оновлений RunContext з `doclist_trace`, `retrieval_retry_request`; enqueue **RUN_U4** (через [[Lexery - ORCH and Clarification|ORCH]]) або **U7**.

## DocList Recovery: Cloudflare Worker

[[Lexery - DocList Surface|DocList API]] (`DOCLIST_API_URL`) — Cloudflare Worker, який:

- Приймає act identifiers (назва, абревіатура, rada_nreg)
- Шукає у **Qdrant catalog** (окремий від основного LLDBI index)
- Повертає match status з reason codes для downstream [[Lexery - U7 Evidence Assembly|U7]] / [[Lexery - U8 Legal Reasoning|U8]]
- Prioritizes **exact-cue matching** перед broad noise — навмисний дизайн для уникнення false positives

## Test Coverage

| Тест | Фокус |
|---|---|
| `test_doclist_lookup_units.ts` | DocList API interaction, reason code parsing, catalog matching |
| `test_expand_units.ts` | Full expand consumer: retry bounds, seeded rerun, ORCH enqueue, state persistence |

## Failure Modes

- **DocList Worker timeout:** Worker на Cloudflare має cold start і timeout; при failure U6 fallback на direct retry або forward.
- **Retry loop exhaustion:** після `U6_DIRECT_RETRY_MAX` run просувається з incomplete evidence — downstream має handle weak support.
- **Inconsistent RunContext:** якщо `gate_decision` відсутній або corrupt — U6 не може визначити recovery strategy; fail-safe forward.
- **ORCH race:** при inline ORCH після U5 і конкурентному U6 enqueue можливі state conflicts у RunContext.

## Clarification-Aware Resume

Якщо [[Lexery - ORCH and Clarification|ORCH]] визначив `AMBIGUOUS_ACT_MATCH` і запитав clarification у користувача, відновлення після відповіді потрапляє **через U7** для evidence reassembly з оновленим контекстом — не через повторний U6.

## Історична еволюція

Почалася як stub у legacy implementation. З часом стала центральною для bounded agentivity: U6 — місце, де [[Lexery - Brain Architecture|Brain]] найяскравіше поводиться як **bounded agent**, який чесно визнає межі знань замість фабрикації. Додано cost-aware policy (reuse seeded reruns), DocList resolution через окремий Worker, і explicit retry bounds.

## See Also

- [[Lexery - U1-U12 Runtime]]
- [[Lexery - Brain Test and Verify Map]]

- [[Lexery - U5 Gate]]
- [[Lexery - U7 Evidence Assembly]]
- [[Lexery - ORCH and Clarification]]
- [[Lexery - DocList Surface]]
- [[Lexery - LLDBI Surface]]
- [[Lexery - Import Proposal Loop]]
- [[Lexery - Retry and Recovery]]
- [[Lexery - U4 Retrieval]]
- [[Lexery - Run Lifecycle]]
- [[Lexery - Coverage Gap Honesty]]
- [[Lexery - Brain Architecture]]
- [[Lexery - Retrieval, LLDBI, DocList]]
