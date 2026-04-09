---
aliases: [Pipeline Health, Health Dashboard]
tags: [lexery, brain, synthesis]
status: active
layer: brain
created: 2026-04-09
updated: 2026-04-09
sources: 4
---

> [!info] Compiled from
> - `raw/codebase-snapshots/supabase-live-stats-2026-04-09.md`
> - `raw/codebase-snapshots/supabase-schema-2026-04-09.md`
> - `raw/architecture-docs/CURRENT_PIPELINE_STATE.md`
> - [[Lexery - Current State]]

# Lexery - Pipeline Health Dashboard

## Overall Health (2026-04-09)

| Indicator | Value | Status |
|-----------|-------|--------|
| Total runs processed | 26,661 | 🟢 |
| Completion rate | 64.4% (17,169) | 🟡 |
| Failure rate | 1.0% (277) | 🟢 |
| Stuck runs | 33.9% (9,039) | 🔴 |
| Daily throughput (7d avg) | ~220 runs/day | 🟡 |
| Memory items extracted | 3,553 | 🟢 |
| Documents ingested | 679 | 🟢 |
| Active tenants | 242 | 🟢 |

## Pipeline Stage Funnel

Де губляться запити в pipeline — аналіз на основі run status distribution:

```
U1 Gateway     → 26,661 enters
U2 Profiling   → ~25,966 (695 stuck at Intake)
U3 Planning    → ~25,071 (895 stuck at Profiling)
U4 Retrieval   → ~17,622 (7,449 stuck at Planning) ← BOTTLENECK
U5 Gate        → (no stuck status for these)
U6-U9          → ...
U10 Writer     → 17,281+ (100 running, 12 done)
U11 Verify     → 17,169+ (3 running, 60 done)
U12 Deliver    → 17,169+ (20 running)
Completed      → 17,169
Failed         → 277
```

> [!warning] Ключова проблема
> **7,449 runs (28%)** зупинились на стадії Planning. Це найбільший bottleneck у pipeline. Можливі причини:
> - Ці runs створені до впровадження [[Lexery - ORCH and Clarification|ORCH]]
> - Redis queue timeouts до додавання retry логіки
> - Runs без валідного query profile з [[Lexery - U2 Query Profiling|U2]]

## Memory Manager Health

| Component | Status |
|-----------|--------|
| MM Outbox processing | 99.0% done (3,548/3,583) |
| Pending outbox events | 35 |
| Memory items | 3,553 |
| Case summaries | 321 |
| `summarize_case` events | 0 (event type defined but not yet emitted) |

## Throughput Trend

| Period | Avg runs/day | Note |
|--------|-------------|------|
| Mar 26-28 | **766** | Включає stress tests |
| Mar 29-31 | **383** | Стабілізація |
| Apr 1-4 | **448** | Активна розробка ORCH |
| Apr 5-9 | **183** | Hardening phase, менше тестових runs |

Тренд: зниження volume з peak у ~1,100/day до ~200-300/day відображає перехід від stress testing до hardening і якісної розробки.

## Key Signals for Monitoring

1. **Completion rate** — має рости з впровадженням ORCH і bounded recovery
2. **Stuck run count** — не повинен зростати (нові runs мають проходити pipeline)
3. **MM Outbox pending** — має бути < 50 (35 зараз = здоровий)
4. **Failure rate** — 1% = прийнятно; > 3% = алярм
5. **Daily throughput** — залежить від тестування; стабільний prod = ~100-200/day

## See Also

- [[Lexery - Current State]]
- [[Lexery - Run Lifecycle]]
- [[Lexery - U1-U12 Runtime]]
- [[Lexery - ORCH and Clarification]]
- [[Lexery - Retry and Recovery]]
- [[Lexery - Brain Architecture]]
- [[Lexery - Memory and Documents]]
