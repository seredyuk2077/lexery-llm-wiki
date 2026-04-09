# Supabase Live Stats — 2026-04-09

## Legal Agent DB

### Run Status Distribution
| Status | Count |
|--------|-------|
| completed | 17,183 |
| Planning | 7,449 |
| Profiling | 895 |
| Intake | 705 |
| failed | 277 |
| U10_RUNNING | 100 |
| U11_DONE | 60 |
| U12_RUNNING | 20 |
| U10_DONE | 12 |
| U11_RUNNING | 3 |

**Total runs: ~26,704**

### Daily Volume (30 days)
| Date | Runs |
|------|------|
| 2026-04-09 | 340 |
| 2026-04-08 | 174 |
| 2026-04-07 | 132 |
| 2026-04-06 | 115 |
| 2026-04-05 | 178 |
| 2026-04-04 | 516 |
| 2026-04-03 | 781 |
| 2026-04-02 | 180 |
| 2026-04-01 | 315 |
| 2026-03-31 | 82 |
| 2026-03-30 | 404 |
| 2026-03-29 | 664 |
| 2026-03-28 | 978 |
| 2026-03-27 | 1,122 |
| 2026-03-26 | 316 |
| 2026-03-25 | 627 |
| 2026-03-24 | 2,786 |
| 2026-03-23 | 477 |
| 2026-03-22 | 1,509 |
| 2026-03-20 | 1,787 |
| 2026-03-19 | 334 |
| 2026-03-18 | 343 |
| 2026-03-17 | 28 |
| 2026-03-16 | 396 |
| 2026-03-15 | 1,197 |
| 2026-03-14 | 532 |
| 2026-03-13 | 168 |
| 2026-03-12 | 511 |
| 2026-03-11 | 646 |
| 2026-03-10 | 195 |

**30-day peak: 2,786 (2026-03-24)**

### Entity Counts
| Entity | Count |
|--------|-------|
| Tenants | 242 |
| Chat Sessions | 935 |
| Messages | 7,239 |
| MM Memory Items | 3,565 |
| MM Outbox | 3,596 |
| MM Doc Records | 679 |

### Table Sizes
| Table | Size |
|-------|------|
| runs | 370 MB |
| mm_outbox | 5,336 kB |
| messages | 5,200 kB |
| mm_memory_items | 2,304 kB |
| mm_doc_ingest_log | 1,656 kB |
| mm_doc_records | 928 kB |
| mm_summaries | 328 kB |
| chat_sessions | 272 kB |
| tenants | 80 kB |
| projects | 16 kB |

### Performance
- Average completed run time (7d): **23.6 seconds**

### Runs Schema
id (uuid), run_id (text), tenant_id (uuid), user_id (uuid), conversation_id (uuid), status (text), query (text), query_profile (jsonb), search_plan (jsonb), created_at (timestamptz), updated_at (timestamptz), completed_at (timestamptz), snapshot (jsonb), degraded_flags (jsonb), error_code (text), attachments_manifest (jsonb), idempotency_key (text), retrieval_trace (jsonb), gate_decision (jsonb), llm_result (jsonb), verify_result (jsonb), assembled_prompt (jsonb)

### Chat Sessions Schema
id (uuid), tenant_id (uuid), user_id (uuid), created_at (timestamptz), updated_at (timestamptz), project_id (uuid), chat_system_prompt (text), user_system_prompt (text)

### MM Memory Items Schema
id (uuid), user_id (uuid), tenant_id (uuid), conversation_id (uuid), scope_type (text), scope_id (text), content (text), metadata (jsonb), content_hash (text), created_at (timestamptz), r2_key (text), content_size (integer)

## Legislation RAG DB

### Document Stats
| Metric | Value |
|--------|-------|
| Total documents | 374 |
| All indexed in Qdrant | 374 (100%) |

### By Validity Status
| Status | Count |
|--------|-------|
| in_force | 360 |
| expired | 13 |
| not_in_force | 1 |

### Legislation Documents Schema (42 columns)
rada_nreg, rada_dokid, title, document_type, category, law_number, rada_datred, content_hash, previous_hash, imported_at, updated_at, r2_key, source_url, articles_count, is_active, sync_status, keywords, topics, chunks_count, indexed_content_hash, qdrant_status, qdrant_indexed_at, expected_chunks, indexed_chunks, last_checked_at, auto_update, last_sync_error, summary, aliases, act_group_key, act_is_part, act_part_label, act_group_title, storage_category, document_type_slug, document_number, sync_health, sync_issue, validity_status, status_note, source_status_text, source_status_location
