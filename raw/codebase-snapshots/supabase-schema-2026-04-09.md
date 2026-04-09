# Supabase Database Schema Snapshot — 2026-04-09

## Lexery Legal Agent DB

### Tables

| Table | Rows | RLS | Purpose |
|-------|------|-----|---------|
| tenants | 242 | ✅ | Multi-tenant accounts |
| chat_sessions | 928 | ✅ | User conversations (tenant_id, user_id, project_id, system prompts) |
| runs | 26,661 | ✅ | Pipeline runs (status, query, profile, plan, retrieval, gate, llm_result, verify_result) |
| messages | 7,224 | ✅ | Chat messages (role: user/assistant/system) |
| mm_memory_items | 3,553 | ✅ | Memory Manager items (user knowledge, scope, content_hash, R2 offload) |
| mm_summaries | 321 | ✅ | Memory case summaries |
| mm_outbox | 3,564 | ✅ | MM event queue (index_memory, summarize_case) with lease/retry |
| projects | 0 | ✅ | System prompt projects (empty — new feature) |
| mm_doc_records | 679 | ✅ | Uploaded documents (chat_attachment, project_upload, user_upload) |
| mm_doc_ingest_log | 1,363 | ✅ | Document ingest audit log |

### Run Status Values
Intake → Profiling → Planning → Retrieval → Assemble → Writing → Verifying → Deliver → completed/failed/cancelled
Also: U10_RUNNING, U10_DONE, U11_RUNNING, U11_DONE, U12_RUNNING

### Migrations (9 total, Feb 6 - Feb 27, 2026)
1. 20260206111025 — create_main_schema (runs, tenants, chat_sessions, messages)
2. 20260206111038 — create_memory_schema (mm_memory_items, mm_summaries, mm_outbox)
3. 20260206115552 — add_runs_u1_fields (snapshot, degraded, error, attachments, idempotency)
4. 20260207095253 — add_runs_retrieval_trace
5. 20260207102533 — add_runs_gate_decision
6. 20260225183710 — lexery_runs_llm_result
7. 20260225183721 — lexery_runs_verify_result_and_status
8. 20260225183826 — lexery_db_capabilities_rpc
9. 20260227114147 — lexery_runs_assembled_prompt

### Key Foreign Keys
- chat_sessions.tenant_id → tenants.id
- chat_sessions.project_id → projects.id
- runs.tenant_id → tenants.id
- runs.conversation_id → chat_sessions.id
- messages.conversation_id → chat_sessions.id
- mm_doc_ingest_log.doc_id → mm_doc_records.id

## Legislation RAG DB

### Tables

| Table | Rows | RLS | Purpose |
|-------|------|-----|---------|
| legislation_documents | 374 | ✅ | Ukrainian legal acts from rada.gov.ua (with Qdrant index status, R2 keys, AI summaries) |
| legislation_import_jobs | 966 | ✅ | Batch import jobs (pending/running/completed/failed) |
| legislation_import_proposals | 2 | ✅ | Brain-suggested import proposals (from brain-admin) |

### legislation_documents Key Fields
- rada_nreg (PK), rada_dokid, title, document_type, category, law_number
- content_hash (SHA256), r2_key (mandatory)
- validity_status: in_force / expired / not_in_force / suspended / unknown
- qdrant_status: pending / indexed / error
- AI fields: summary, aliases (JSON array)
- Act grouping: act_group_key, act_is_part, act_part_label, act_group_title
- Chunk counts: expected_chunks, indexed_chunks, chunks_count
- sync_health: green / yellow / red / unknown

### Key Numbers
- 374 legislation documents tracked
- 966 import jobs processed
- Documents sourced from rada.gov.ua (Ukrainian parliament)
