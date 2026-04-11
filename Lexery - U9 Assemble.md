---
aliases:
  - U9 Assemble
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

# Lexery - U9 Assemble

## Роль у Pipeline

U9 — **context assembly** стадія: стискає всі зібрані докази (law, [[Lexery - Memory and Documents|memory]], user docs, history) у **bounded prompt context** для [[Lexery - U10 Writer|U10 Writer]], зберігаючи provenance і дотримуючись token budget. Якщо context engineering — прихований craft Lexery, U9 — місце, де цей craft стає конкретним.

U9 отримує `evidence_assembly` від [[Lexery - U7 Evidence Assembly|U7]] / [[Lexery - U8 Legal Reasoning|U8]] і трансформує його в `assembled_prompt` — фінальний артефакт, що потрапляє до LLM.

## Code Surfaces

- `apps/brain/assemble/assemblePrompt.ts` — core assembly: snippet loading, budget allocation, truncation, provenance tagging
- `apps/brain/assemble/metaTriage.ts` — meta-triage: вибір і ранжування evidence channels перед збіркою
- `apps/brain/assemble/consumer.ts` — `handleU9Event`: orchestration, persist, enqueue U10
- `apps/brain/assemble/types.ts` — `AssembledPrompt`, `BudgetProfile`, snippet types

Документація: `apps/brain/docs/architecture/app/u9/README.md`.

## Конфігурація

| Ключ | Призначення |
|---|---|
| `U9_BUDGET_PROFILE` | Профіль token budget: `compact`, `standard`, `extended` |
| snippet/char caps per mode | Окремі ліміти для `law`, `mixed`, `memory` modes |
| multi-signal weights | Ваги для ранжування evidence channels у meta-triage |
| meta-triage model | LLM model для meta-triage phase |
| meta-triage timeout | Timeout для meta-triage LLM call |

`U9_BUDGET_PROFILE` визначає загальний token envelope: `compact` (~4K tokens context) для простих law-only, `standard` (~8K) для типових mixed, `extended` (~16K) для складних multi-goal. Snippet/char caps розподіляються пропорційно до mode (`law` отримує більше при legal context, `memory` — при memory-heavy).

## Runtime Behavior

**Input:** `RunContext` з `evidence_assembly` (від [[Lexery - U8 Legal Reasoning|U8]]), `raw_hits`, `memory_items`, `doc_snippets`, `history`, `query_profile`, `legal_reasoning` (від U8).

**Етапи виконання:**

1. **Meta-Triage** — LLM-driven (configurable model + timeout) або deterministic: оцінює які evidence channels найрелевантніші для конкретного запиту. Для очевидних law-only turns **пропускає MM Docs probe** (оптимізація tail-latency).
2. **Snippet Loading** — canonical snippets завантажуються з [[Lexery - Storage Topology|R2]] (повний текст НЕ зберігається в DB); кожен snippet тегується provenance: `{source: 'lldbi' | 'memory' | 'doc', r2_key, article_ref}`.
3. **Budget Allocation** — розподіл token budget між law refs, memory, docs, history згідно `U9_BUDGET_PROFILE` і multi-signal weights.
4. **Truncation** — при перевищенні budget snippets обрізаються за пріоритетом (top-ranked залишаються повними, lower-ranked truncated або dropped).
5. **Provenance Tagging** — кожен включений snippet отримує `lawSourceRef` для downstream citation validation у [[Lexery - U11 Verify|U11]].

**Output:** `assembled_prompt` JSONB у RunContext і `runs` таблиці; enqueue **U10**.

## `assembled_prompt` JSONB Structure

```json
{
  "meta": {
    "mode": "law",
    "budget_profile": "standard",
    "total_tokens_est": 7842,
    "channels_used": ["lldbi_chunks", "memory"],
    "triage_model": "gpt-4o-mini",
    "assembled_at": "2026-04-09T..."
  },
  "lawSourceRefs": [
    {"article_ref": "КЗпП ст. 36", "r2_key": "...", "score": 0.89}
  ],
  "budget": {
    "law_chars": 12000,
    "memory_chars": 4000,
    "doc_chars": 0,
    "history_chars": 2000
  }
}
```

**Повний snippet text НЕ зберігається в DB** — лише metadata і refs. При потребі (debug, replay) snippets re-loadable з [[Lexery - Storage Topology|R2]] за `r2_key`.

## Test Coverage

| Тест | Фокус |
|---|---|
| `test_assemble_units.ts` | Budget allocation, truncation, provenance tagging, mode detection, meta-triage skip logic, edge cases (empty evidence, mixed-mode) |

## Failure Modes

- **R2 snippet load failure:** timeout або missing key → snippet excluded з assembly; `assembled_prompt.meta` містить warning.
- **Meta-triage LLM timeout:** fallback на deterministic channel selection (law-first priority).
- **Budget overflow:** при extreme multi-goal запитах budget може бути недостатнім — truncation агресивніша, quality знижується.
- **Stale evidence:** якщо RunContext оновився між U8 і U9 (конкурентний [[Lexery - ORCH and Clarification|ORCH]]) — assembly може включити inconsistent evidence; RunContext lock мінімізує ризик.

## Взаємодія з іншими стадіями

**Від [[Lexery - U8 Legal Reasoning|U8]]:** `evidence_assembly`, `legal_reasoning`. **Від [[Lexery - U4 Retrieval|U4]] (transitively):** `raw_hits`, `retrieval_trace`. **До [[Lexery - U10 Writer|U10]]:** `assembled_prompt` — єдиний артефакт, який writer бачить. **До [[Lexery - U11 Verify|U11]] (transitively):** `lawSourceRefs` для citation verification.

## Current Runtime Themes

- **Tail-latency reduction** у meta-triage — skip unnecessary probes.
- **Cost/quality choke point** — U9 визначає upper bound якості відповіді: навіть ідеальний [[Lexery - U10 Writer|U10]] не може компенсувати погану assembly.

## See Also

- [[Lexery - U1-U12 Runtime]]
- [[Lexery - Brain Test and Verify Map]]

- [[Lexery - U8 Legal Reasoning]]
- [[Lexery - U10 Writer]]
- [[Lexery - Memory and Documents]]
- [[Lexery - Provider Topology]]
- [[Lexery - Run Lifecycle]]
- [[Lexery - Brain Architecture]]
- [[Lexery - Storage Topology]]
- [[Lexery - U11 Verify]]
- [[Lexery - Coverage Gap Honesty]]
- [[Lexery - Contracts and Run Schema]]
- [[Lexery - U4 Retrieval]]
- [[Lexery - ORCH and Clarification]]
