# Supabase Stats Request — 2026-04-10

This file signals that Supabase stats should be refreshed.
The maintenance pipeline should query:

## Legal Agent DB
- SELECT status, COUNT(*) FROM runs GROUP BY status
- SELECT date_trunc('day', created_at) as day, COUNT(*) FROM runs WHERE created_at > now() - interval '14 days' GROUP BY day ORDER BY day DESC
- SELECT COUNT(*) FROM tenants
- SELECT COUNT(*) FROM chat_sessions
- SELECT COUNT(*) FROM messages
- SELECT COUNT(*) FROM mm_memory_items
- SELECT COUNT(*) FROM mm_outbox
- SELECT COUNT(*) FROM mm_doc_records

## Legislation RAG
- SELECT COUNT(*) FROM legislation_documents
- SELECT qdrant_status, COUNT(*) FROM legislation_documents GROUP BY qdrant_status
- SELECT validity_status, COUNT(*) FROM legislation_documents GROUP BY validity_status

These queries should be executed via Supabase MCP tools during interactive sessions.
