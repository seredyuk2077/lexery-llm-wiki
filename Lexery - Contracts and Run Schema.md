---
aliases:
  - Contracts and Run Schema
  - Run Schema
tags:
  - lexery
  - product
  - brain
created: 2026-04-09
updated: 2026-04-09
status: observed
layer: product
---

> [!info] Compiled from
> - `raw/codebase-snapshots/supabase-live-stats-2026-04-09.md`
> - `raw/codebase-snapshots/brain-config.ts`
> - `raw/architecture-docs/CURRENT_PIPELINE_STATE.md`

# Lexery - Contracts and Run Schema

Lexery має чіткий контрактний шар між Portal/API і Brain runtime. Зони відповідальності:
- **`@lexery/contracts`** (shared Zod schemas) — спільна правда між frontend, backend, agent
- **`runs` table** — durable run lifecycle, 370 MB у production
- **RunContext** — hot Redis state для pipeline processing

## Shared Contracts (`packages/contracts`)

PR #5 (Єгор, Apr 3): `[Backend / Agent] feat: add shared contracts(zod/types)` ([LEX-198](https://linear.app/lexery/issue/LEX-198)). Це єдиний пакет, що imports підходять і для NestJS backend, і для Brain agent:

### CreateRun Request

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `query` | string | yes | User legal question; if > 32KB → overflow to R2, DB keeps preview |
| `tenant_id` | uuid | yes | Multi-tenant isolation |
| `user_id` | uuid | yes | User identity |
| `conversation_id` | uuid | no | Links runs within a chat session |
| `locale` | string | no | Language hint (default: Ukrainian) |
| `client_context` | object | no | Portal metadata (UI state, device) |
| `attachments` | array | no | Documents (base64 or presigned URL) |
| `dry_run` | boolean | no | Skip LLM calls, validate pipeline |
| `debug` | boolean | no | Verbose tracing |
| `idempotency_key` | string | no | Prevents duplicate runs |
| `allow_anonymous` | boolean | no | Dev mode bypass |

### Attachment Shape

```
contentBase64: string | presignedUrl: string
filename: string
mimeType: string
```

Inline limit: **512 KB** per attachment, **2 MB** per request. Above → R2 upload via presigned URL (PR #2, Єгор: storage controller).

### Auth Context

| Field | Type | Purpose |
|-------|------|---------|
| `tenant_id` | uuid | Tenant isolation boundary |
| `user_id` | uuid | User identity |
| `plan_tier` | string | Subscription tier (affects rate limits) |
| `features` | string[] | Enabled feature flags |

## Runs Table Schema (Supabase)

22 columns, **370 MB** у production. Це серце всього pipeline — кожен run пишеться тут від U1 Gateway до U12 Deliver:

| Column | Type | Written By | Purpose |
|--------|------|-----------|---------|
| `id` | uuid | U1 | Primary key |
| `run_id` | text | U1 | Human-readable run identifier |
| `tenant_id` | uuid | U1 | Multi-tenant FK |
| `user_id` | uuid | U1 | User FK |
| `conversation_id` | uuid | U1 | Chat session FK |
| `status` | text | All stages | Pipeline status: Intake → Profiling → Planning → completed/failed |
| `query` | text | U1 | Original query (or preview if overflow) |
| `query_profile` | jsonb | U2 | Structured profile: intent, domain, entities, routing_flags |
| `search_plan` | jsonb | U3 | SearchPlan: use_lldbi, use_doclist, thresholds, reason_codes |
| `retrieval_trace` | jsonb | U4 | Compact retrieval results (full trace in R2) |
| `gate_decision` | jsonb | U5 | GateDecision: expand true/false, scores |
| `assembled_prompt` | jsonb | U9 | Compact assembled prompt metadata |
| `llm_result` | jsonb | U10 | LLM output, citations, coverage_gap |
| `verify_result` | jsonb | U11 | Verdict: complete / retry_write / retry_retrieval / ask_user |
| `snapshot` | jsonb | All | Accumulated runtime state snapshot |
| `degraded_flags` | jsonb | Various | Flags for fallback/degraded paths |
| `error_code` | text | Various | Error classification on failure |
| `attachments_manifest` | jsonb | U1 | Attachment metadata |
| `idempotency_key` | text | U1 | Dedup key |
| `created_at` | timestamptz | U1 | Run creation timestamp |
| `updated_at` | timestamptz | All | Last stage update |
| `completed_at` | timestamptz | U12 | Terminal completion timestamp |

### Run Status Flow

```
Intake → Profiling → Planning → U4 → U5 → U6 (if expand)
→ U8 → U9 → U10_RUNNING → U10_DONE → U11_RUNNING → U11_DONE
→ U12_RUNNING → completed | failed
```

Кожен статус означає "цей stage claim-нув run". Statuses використовуються для:
1. **Pipeline routing** — queue consumers claim runs за статусом
2. **Monitoring** — stuck runs = runs у non-terminal status > timeout
3. **Recovery** — ORCH може перемаршрутизувати stuck runs

### Current Status Distribution (live)

| Status | Count | % |
|--------|-------|---|
| completed | 17,183 | 64.3% |
| Planning | 7,449 | 27.9% |
| Profiling | 895 | 3.4% |
| Intake | 705 | 2.6% |
| failed | 277 | 1.0% |
| U10_RUNNING | 100 | 0.4% |
| U11_DONE | 60 | 0.2% |
| U12_RUNNING | 20 | <0.1% |
| U10_DONE | 12 | <0.1% |
| U11_RUNNING | 3 | <0.1% |

## RunContext (Redis)

Hot per-run state that lives in Redis during pipeline processing. Contrast with the durable `runs` table:

| Aspect | RunContext (Redis) | RunRecord (Supabase) |
|--------|-------------------|---------------------|
| Lifetime | During pipeline execution | Permanent |
| Speed | Sub-ms reads/writes | Network latency |
| Compression | zstd above 8 KB | None |
| Contains | Full pipeline state, evidence, traces | Compact summaries, profiles, decisions |
| Driver | `inmemory` or `redis` | PostgreSQL |

RunContext stores: `query_profile`, `search_plan`, `retrieval_trace` (full), `evidence_assembly`, `legal_reasoning`, `assembled_prompt` (full), `llm_result`, `clarification`, `notes` (retry/recovery metadata).

## Contract Evolution

| Date | Change | PR / LEX |
|------|--------|----------|
| Mar 29 | Monorepo created, frontend migrated | PR #1 (Єгор) |
| Mar 30 | Storage presigned URLs for attachments | PR #2 (Єгор, LEX-201) |
| Apr 2 | Auth service adapted for new auth | PR #3 (Єгор) |
| Apr 3 | **Shared contracts** — Zod schemas + types | PR #5 (Єгор, LEX-198) |
| Apr 6 | Auth refactor | PR #8 (Єгор) |

## Major Drift Still Present

- Plan taxonomy inconsistency between backend (`plan_tier`) and frontend (subscription plans PR #10)
- Some contract richness exists in `origin/dev` that hasn't fully synced with local Brain branch work
- `snapshot` JSONB has grown organically — no formal versioning scheme yet

## See Also

- [[Lexery - API and Control Plane]]
- [[Lexery - Business Model]]
- [[Lexery - Branch Divergence]]
- [[Lexery - Run Lifecycle]]
- [[Lexery - U1 Gateway]]
- [[Lexery - U2 Query Profiling]]
- [[Lexery - U12 Deliver]]
- [[Lexery - Pipeline Health Dashboard]]
- [[Lexery - Who Built What]]
- [[Lexery - Yehor Puhach]]
- [[Lexery - Memory and Documents]]
- [[Lexery - Glossary]]
