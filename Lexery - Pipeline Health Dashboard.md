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

## Overall Health (2026-04-09, live Supabase)

| Indicator | Value | Status |
|-----------|-------|--------|
| Total runs processed | **26,704** | 🟢 |
| Completed | **17,183** (64.3%) | 🟡 |
| Failed | **277** (1.0%) | 🟢 |
| Stuck (Intake + Profiling + Planning) | **9,049** (33.9%) | 🔴 |
| Avg completed run latency (7d) | **23.6 sec** | 🟢 |
| Daily throughput (7d avg) | **~228 runs/day** | 🟡 |
| Peak daily throughput (30d) | **2,786** (Mar 24) | — |
| Tenants | 242 | 🟢 |
| Chat sessions | 935 | 🟢 |
| Messages | 7,239 | 🟢 |
| Memory items | 3,565 | 🟢 |
| MM Outbox events | 3,596 | 🟢 |
| MM Doc records | 679 | 🟢 |

### DB Table Sizes

| Table | Size | Note |
|-------|------|------|
| `runs` | **370 MB** | Largest; JSONB columns (snapshot, retrieval_trace, llm_result) |
| `mm_outbox` | 5.3 MB | Durable event queue for memory extraction |
| `messages` | 5.2 MB | User + assistant messages per conversation |
| `mm_memory_items` | 2.3 MB | Extracted user knowledge items |
| `mm_doc_ingest_log` | 1.6 MB | Document ingestion audit trail |
| `mm_doc_records` | 928 kB | Indexed document metadata |
| `chat_sessions` | 272 kB | One per user conversation |
| `tenants` | 80 kB | Multi-tenant configuration |

## Pipeline Stage Funnel

Де губляться запити в pipeline — аналіз на основі run status distribution:

```
U1 Gateway     → 26,704 enters
U2 Profiling   → ~25,999 (705 stuck at Intake)
U3 Planning    → ~25,104 (895 stuck at Profiling)
U4 Retrieval   → ~17,655 (7,449 stuck at Planning) ← BOTTLENECK
U5 Gate        → (transparent, no stuck status)
U6-U9          → ...
U10 Writer     → 17,295+ (100 running, 12 done)
U11 Verify     → 17,183+ (3 running, 60 done)
U12 Deliver    → 17,183+ (20 running)
Completed      → 17,183
Failed         → 277
```

> [!warning] Ключова проблема
> **7,449 runs (28%)** зупинились на стадії Planning. Це найбільший bottleneck у pipeline. Можливі причини:
> - Ці runs створені до впровадження [[Lexery - ORCH and Clarification|ORCH]]
> - Redis queue timeouts до додавання retry логіки
> - Runs без валідного query profile з [[Lexery - U2 Query Profiling|U2]]

## Daily Volume (30 days)

| Period | Runs/Day | Context |
|--------|----------|---------|
| Mar 10-13 | 150-500 | Early pipeline testing |
| Mar 14-16 | 400-1,200 | Stress testing phase |
| Mar 17-20 | 28-1,787 | Mixed: quiet days + massive bursts |
| Mar 22-24 | 1,500-2,786 | **Peak period** — intensive retrieval testing |
| Mar 25-28 | 316-1,122 | Quality improvements |
| Mar 29-31 | 82-664 | Stabilisation |
| Apr 1-4 | 180-781 | Active ORCH development |
| Apr 5-9 | 115-340 | Hardening phase, fewer test runs |

**30-day total:** ~16,783 runs. Тренд: від stress testing до quality-focused development.

## Memory Manager Health

| Component | Status |
|-----------|--------|
| MM Outbox total | 3,596 events |
| MM Memory Items | 3,565 items |
| MM Doc Records | 679 documents |
| MM Doc Ingest Log | ~800 entries |
| `mm_summaries` | Active (328 kB) |
| Semantic search | Enabled via Qdrant |

MM працює стабільно. Outbox -> memory items pipeline майже 1:1 (3,596 events → 3,565 items), що означає ~99% успішної обробки.

## Legislation RAG Health

| Metric | Value |
|--------|-------|
| Total documents | **374** |
| Indexed in Qdrant | **374** (100%) |
| In force | 360 (96.3%) |
| Expired | 13 (3.5%) |
| Not in force | 1 (0.3%) |
| Schema columns | 42 |

Повна індексація — всі 374 документи в Qdrant. Це означає zero gap між Supabase metadata і vector search.

## Key Signals for Monitoring

1. **Completion rate** — має рости з впровадженням ORCH і bounded recovery
2. **Stuck run count** — не повинен зростати (нові runs мають проходити pipeline)
3. **MM Outbox pending** — має бути < 50 (зараз ~31 = здоровий)
4. **Failure rate** — 1% = прийнятно; > 3% = алярм
5. **Daily throughput** — залежить від тестування; стабільний prod = ~100-200/day
6. **Run latency p50** — 23.6s поточне; < 30s = здоровий
7. **runs table size** — 370 MB; consider archival strategy at ~1 GB

## See Also

- [[Lexery - Current State]]
- [[Lexery - Run Lifecycle]]
- [[Lexery - U1-U12 Runtime]]
- [[Lexery - ORCH and Clarification]]
- [[Lexery - Retry and Recovery]]
- [[Lexery - Brain Architecture]]
- [[Lexery - Memory and Documents]]
- [[Lexery - Storage Topology]]
- [[Lexery - Contracts and Run Schema]]
- [[Lexery - Provider Topology]]
- [[Lexery - Corpus Evolution]]
