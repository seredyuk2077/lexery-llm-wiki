#!/usr/bin/env node
/**
 * Autonomous Supabase stats poller.
 * Queries both Supabase projects and writes snapshots to raw/.
 * Requires: SUPABASE_LEXERY_LEGAL_AGENT_DB_URL, SUPABASE_LEXERY_LEGAL_AGENT_DB_SERVICE_ROLE_KEY,
 *           SUPABASE_LEGISLATION_URL, SUPABASE_LEGISLATION_SERVICE_ROLE_KEY
 * Falls back gracefully if credentials missing.
 */
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const RAW = join(__dirname, '..', '..', 'raw', 'codebase-snapshots');
if (!existsSync(RAW)) mkdirSync(RAW, { recursive: true });

function today() { return new Date().toISOString().slice(0, 10); }

async function querySupabase(url, key, sql) {
  if (!url || !key) return null;
  const restUrl = url.replace(/\/$/, '') + '/rest/v1/rpc/';
  try {
    const resp = await fetch(`${url.replace(/\/$/, '')}/rest/v1/rpc/`, {
      method: 'POST',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({ query: sql }),
    });
    if (!resp.ok) return null;
    return await resp.json();
  } catch { return null; }
}

const date = today();
console.log(`[scan-supabase] ${date}`);

// For now, write a placeholder — the real MCP-based queries happen during maintenance
// This script creates a template that the AI delta generator can fill
const statsTemplate = `# Supabase Stats Request — ${date}

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
`;

writeFileSync(join(RAW, `supabase-refresh-request-${date}.md`), statsTemplate);
console.log(`  Stats refresh request written`);
console.log(`[scan-supabase] done`);
