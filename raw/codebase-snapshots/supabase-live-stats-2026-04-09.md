# Supabase Live Production Stats — 2026-04-09

## Run Status Distribution (26,680 total)

| Status | Count | % |
|--------|-------|---|
| completed | 17,169 | 64.4% |
| Planning (stuck) | 7,449 | 27.9% |
| Profiling (stuck) | 895 | 3.4% |
| Intake (stuck) | 695 | 2.6% |
| failed | 277 | 1.0% |
| U10_RUNNING | 100 | 0.4% |
| U11_DONE | 60 | 0.2% |
| U12_RUNNING | 20 | 0.1% |
| U10_DONE | 12 | 0.0% |
| U11_RUNNING | 3 | 0.0% |

**Key insight:** ~9,039 runs (34%) stuck in early stages (Intake/Profiling/Planning). These likely represent runs that entered the pipeline but didn't progress — either due to timeouts, queue issues, or cancellations before the new ORCH was added.

## Daily Run Volume (14-day window)

| Date | Runs |
|------|------|
| Apr 9 | 316 |
| Apr 8 | 174 |
| Apr 7 | 132 |
| Apr 6 | 115 |
| Apr 5 | 178 |
| Apr 4 | 516 |
| Apr 3 | 781 |
| Apr 2 | 180 |
| Apr 1 | 315 |
| Mar 31 | 82 |
| Mar 30 | 404 |
| Mar 29 | 664 |
| Mar 28 | 978 |
| Mar 27 | 1,122 |
| Mar 26 | 199 |

**14-day total:** ~6,156 runs
**Peak:** 1,122 (Mar 27) — likely a load test / stress test day
**Recent trend:** decreasing from ~780/day early Apr to ~200-300/day

## Memory Manager Outbox

| Event Type | Status | Count |
|------------|--------|-------|
| index_memory | done | 3,548 |
| index_memory | pending | 35 |

No `summarize_case` events exist — this event type is defined in schema but not yet emitted in production.

## Table Sizes

| Table | Rows |
|-------|------|
| runs | 26,661 |
| messages | 7,224 |
| mm_memory_items | 3,553 |
| mm_outbox | 3,564 |
| chat_sessions | 928 |
| mm_doc_records | 679 |
| mm_doc_ingest_log | 1,363 |
| mm_summaries | 321 |
| tenants | 242 |
| projects | 0 |
