# Lexery Legal Agent — Current Pipeline State
**Дата оновлення:** 2026-04-09  
**Джерело правди:** код у `apps/brain/`, міграції `supabase/migrations/`, stage docs `apps/brain/docs/architecture/app/`, реальні CLI smoke/live прогони цього monorepo.

---

## 1. Executive summary

Поточний runtime уже не є просто skeleton. End-to-end ланцюг `U1 -> U2 -> U3 -> U4 -> U5 -> U9 -> U10 -> U11 -> U12` працює, MM memory і MM Docs інтегровані, Redis queue + Redis RunContext стали штатною durable основою, а `Supabase / R2 / Qdrant` реально використовуються в бойовому маршруті.

Головний незакритий борг зараз не в самому handoff між стадіями, а в **post-retrieval tail latency** і в **якості/ціні U10 write+repair loop**. `ORCH`, `U6`, `U7`, `U8` уже live, bounded і реально беруть участь у runtime. Найбільший runtime tail зараз живе після `U4`, а не всередині retrieval.

Оновлення за 2026-04-09:

- Redis shared-client hardening прибрав live `ERR max number of clients reached` і повернув `brain:verify:api-acceptance` до чистого PASS.
- `ASK_USER` clarification race закритий: fast user clarification більше не перезаписується назад у `pending` stale worker-ом.
- `U6 -> U4` recovery rerun став дешевшим: повторний `U4` може перевикористати rewrite/variant seed з `retrieval_retry_request` і не платити за другий identical query-rewrite LLM hop.
- DocList lookup тепер спочатку пробує exact `nreg` / act-title cues, а вже потім broad rewrite variants; це зменшило timeout/noise path на live missing-act probes.
- missing-act path `ACT_FOUND_IN_CATALOG_NOT_INDEXED` тепер завершується через `U10 -> U11 -> U12`, а не падає у `STOP_FAILED`
  - `U8` treats terminal corpus-gap states as write-compatible
  - `U10` now preserves effective coverage-gap truth from `evidence_assembly/doclist_trace`, not only from the last `retrieval_trace`
  - `retry_write` now really re-runs `U10` instead of idempotently reusing stale `llm_result`
  - `U11` no longer requires legal citations for honest `coverage_gap != none` answers

---

## 2. Поточний pipeline по стадіях

| Stage | Поточна роль | Реальний стан |
|------|---------------|---------------|
| **U1 Gateway** | HTTP intake, auth/dev gate, run persistence, enqueue | Працює. Durable path через `runs`, Redis queue, Redis RunContext. |
| **U2 Classify** | Query profile, domain tagging, ambiguity, routing flags | Працює. Є unit coverage, але quality/JSON-brittleness ще не ідеальні. |
| **U3 / U3a Plan** | Build SearchPlan (`use_lldbi`, `use_memory`, `use_doclist`, thresholds, reason_codes`) | Працює стабільно; mixed/memory/law routing реально керують downstream policy. |
| **U4 CacheRAG** | LLDBI retrieval, memory retrieval hooks, retrieval trace | Працює. Побудовано `compact trace in DB + full trace in R2`; semantic memory infra жива. |
| **U5 Gate** | Decide `expand=false/true`, degrade handling | Працює. Поточний baseline: A `expand=false`, B `expand=false`, C degraded `expand=true`. |
| **U6 Expand** | Expansion / DocList / corpus-gap recovery path | Працює. Реальний bounded recovery stage з `doclist_trace`, `retrieval_retry_request`, corpus-gap reason codes і LLDBI admin hints. |
| **U9 Assemble** | Build evidence-only prompt from `law + docs + memory + history` | Працює добре. Є MM Docs channel, meta-triage, budgeting, R2 snippet load, compact persistence. |
| **U10 Write** | Prompt stack, evidence triage, focus spec, model call, output validation | Працює. Це головне місце поточного quality gap: pipeline живий, але answer quality ще треба покращувати. |
| **U11 Verify** | Verdict after U10 | Працює як bounded mode-aware verifier (`complete | retry_write | retry_retrieval | ask_user | failed_*`). Повного deep critic/web-loop ще немає. |
| **U12 Deliver** | Persist assistant message, patch source summary, enqueue MM outbox, complete run | Працює. Durable/idempotent path побудований. |
| **MM Memory** | Outbox -> summaries/items -> semantic index -> U9 memory channel | Працює. Semantic infra, outbox, source summary, isolation tests і runtime checks є. |
| **MM Docs** | Ingest attachments/doc candidates -> R2/DB/Qdrant -> retrieve snippets into U9 | Працює. Live smoke підтверджує indexing, retrieval, scope isolation і shared Lexery-LA Qdrant path. |

---

## 3. Що реально побудовано понад стару архітектуру

### 3.1 Durable orchestration

- **Redis queue factory + Redis streams** для U1→U12.
- **Redis RunContext store** як окремий durable layer, а не лише in-memory helper.
- **Idempotent claim logic** у U11/U12 для multi-instance execution.

### 3.2 Retrieval / evidence layer

- **Compact retrieval trace** persisted у DB.
- **Full retrieval trace** persisted у R2.
- U4 вже не просто “rag lookup”, а вузол з memory-aware retrieval і trace persistence.

### 3.3 U9 assemble expanded

- Канали: **law + docs + memory + history**.
- **MM Docs retrieve/ingest** включені прямо перед assemble.
- **Meta triage** на law hits.
- Compact `assembled_prompt` persistence у `runs`.

### 3.4 U10 write expanded

- **Prompt Stack** (`global -> project -> chat -> user`).
- **Evidence Triage**.
- **Focus Spec**.
- **Output Validator**.
- **Memory Search fallback/tooling**.

### 3.5 MM layer expanded

- `mm_memory_items`, `mm_summaries`, `mm_outbox`.
- Semantic memory collection.
- MM Docs foundation: `mm_doc_records`, `mm_doc_ingest_log`, docs Qdrant collection, docs R2 storage, scope isolation.

---

## 4. Де поточний runtime відрізняється від старої full architecture

| Тема | Старе уявлення | Поточна реальність |
|------|----------------|--------------------|
| **Supabase topology** | 3 окремі проєкти: Main + Legislation + Memory | Фактично 2: **Lexery DB** + **Legislation DB**. MM tables і MM Docs tables зараз у Lexery DB. |
| **R2 topology** | 1 bucket з різними prefix | Фактично 2 buckets: `legislation` і `lexery-legal-agent`. |
| **OpenRouter keys** | 3 key families: online / rag / web | Поточний runtime використовує **single Brain key family** з precedence `OPENROUTER_API_KEY_BRAIN > OPENROUTER_API_KEY_ONLINE`; цим самим шляхом ідуть і LLM, і embedding виклики Brain. |
| **Qdrant topology** | Legislation + separate memory only | Зараз: Legislation cluster + Lexery-LA cluster, де memory semantic і MM Docs можуть жити разом, якщо docs-specific endpoint не заданий. |
| **U11** | Повний verify loop як current runtime | Насправді current runtime має **minimal scaffold**; повний critic/rerank/web loop поки planned. |
| **U10** | Просто один Write call | Насправді U10 має Prompt Stack, Evidence Triage, Focus Spec, Output Validator і memory-aware helpers. |
| **U9** | Law + memory + history | Насправді U9 уже став `law + docs + memory + history`. |

---

## 5. Verification snapshot — 2026-03-16

### 5.1 Unit / focused verification

PASS:

- `pnpm -s brain:test:queue-units`
- `pnpm -s brain:test:gate-units`
- `pnpm -s brain:test:u9-units`
- `pnpm -s brain:test:u10-units`
- `pnpm -s brain:test:u10-preview-units`
- `pnpm -s brain:test:u10-memory-search-units`
- `pnpm -s brain:test:u11-units`
- `pnpm -s brain:test:u12-units`
- `pnpm -s brain:test:mm-units`
- `pnpm -s brain:test:mm-doc-units`
- `pnpm -s brain:test:storage-history-units`
- `pnpm -s brain:test:redis-queue-units`
- `pnpm -s brain:test:rag-units`
- `pnpm -s brain:test:u4-memory-units`
- `pnpm -s brain:test:config-key-precedence`
- `pnpm -s brain:test:dev-chat-units`
- focused `tsx` unit scripts under `tools/u2`, `tools/u3`, `tools/u4`

Деталі:

- `brain:test:redis-queue-units` має **expected skip** для reclaim-сценарію без `REDIS_RECLAIM_MIN_IDLE_MS`.
- `brain:test:queue-units` був timing-flaky один раз; тест hardened polling-based `waitUntil(...)`, після чого стабільно PASS.

### 5.2 Smoke / live verification

PASS:

- `pnpm -s brain:verify:u3`
- `pnpm -s brain:verify:u4-runtime-config`
- `pnpm -s brain:verify:u5`
- `pnpm -s brain:db:capabilities`
- `pnpm -s brain:r2:capabilities`
- `MEMORY_SEMANTIC_ENABLED=true pnpm -s brain:verify:memory-runtime`
- `pnpm -s brain:verify:api-acceptance`
- `pnpm -s brain:concurrency:smoke`
- `pnpm -s brain:verify:mm-doc-readiness`
- `MM_DOCS_VERIFY_ALLOW_FALLBACK=true pnpm -s brain:verify:mm-doc-live`
- `DEV_ALLOW_ANONYMOUS=true pnpm --filter @lexery/brain exec tsx tools/dev_chat/runner_legacy.ts --message "Що передбачає ст. 115 ККУ?" --dry-run`
- `pnpm -s brain:mm:smoke`

Ключові результати:

- `brain:verify:u5`: A `expand=false`, B `expand=false`, C degraded `expand=true`.
- `brain:concurrency:smoke`: `50/50 PASS`; є warning по total time, але cross-contamination не знайдено.
- `brain:verify:memory-runtime`: isolated rerun дав `semantic_infra_healthy`.
- `brain:verify:mm-doc-live`: PASS, `docs_indexed=9`, shared Lexery-LA docs Qdrant path підтверджено.
- `api_acceptance_verify.ts`: isolated run PASS, `accepted_202=10/10`, `p50_latency_ms=929`, `queue_driver=redis`, `run_context_driver=redis`.
- повторний isolated acceptance на 2026-04-09 після Redis hardening теж PASS:
  - `accepted_202=10/10`
  - `status_5xx=0`
  - `p50_latency_ms=930`
- `brain:mm:smoke`: PASS після оновлення smoke під поточну mixed/memory policy U9.

### 5.3 Важливі нюанси інтерпретації

- `brain:verify:memory-runtime` і `brain:verify:api-acceptance` можуть дати хибний red під агресивним паралельним навантаженням verification-suite. У чистому повторі обидва підтвердились.
- `brain:mm:smoke` падав до виправлення smoke-скрипта, бо він очікував memory parts у `law mode`, що вже суперечило поточній U9 policy. Це був **дріфт smoke**, а не runtime regression.

---

## 6. Що працює добре вже зараз

- **Stage handoff** від U1 до U12.
- **Durable queue/run-context path** на Redis.
- **U4 -> U5 -> U9 -> U10 -> U12** як реальний робочий маршрут.
- **MM outbox + memory semantic infra**.
- **MM Docs ingest/retrieve/isolation**.
- **DB / R2 / Qdrant capability checks**.
- **Dry-run dev chat path** до U12.
- **Source summary / prompt budgeting / law-doc-memory-history accounting**.

---

## 7. Що ще не ідеально

### 7.1 Якість відповіді U10

Основний поточний gap. Pipeline працює, але:

- triage/focus selection ще може бути занадто агресивною;
- answer quality залежить від prompt composition і evidence reduction;
- великі модулі `gateway/storage.ts`, `retrieval/cache-rag.ts`, `retrieval/memory-store.ts`, `classify/consumer.ts` ще потребують окремого cleanup/refactor slice.

### 7.2 U11 ще не фінальний

Поки що немає повного production verify-loop з:

- coverage critic,
- reranker/citation audit,
- refined-query retry orchestration,
- web enrichment branch.

Є тільки durable scaffold, який не ламає pipeline.

### 7.3 U6 / expand path

Код і wiring існують, але це ще не завершений quality subsystem. Основний стабільний шлях зараз не на ньому.

Однак важливі live зрушення вже є:

- clarification-resume correctness:
  - `clarification_resume_single_case_after_ask_user_race_fix_2026-04-09.json`
  - `completed=1`, `clarification_pending=0`
- seeded retry rewrite:
  - `real_soft_labor_rights_after_seeded_u4_retry_2026-04-09.json`
  - `elapsed_ms: 67629 -> 60835`
- DocList exact-cue priority:
- `virtual_assets_gap_live_after_doclist_priority_2026-04-09.json`
  - `elapsed_ms: 55008 -> 45723`
  - ambiguity truthfully remained `AMBIGUOUS_ACT_MATCH`, but the earlier timeout-heavy noise path was removed
- `virtual_assets_gap_single_post_effective_gap_2026-04-09.json`
  - `completed = 1`
  - `doclist_reason_code = ACT_FOUND_IN_CATALOG_NOT_INDEXED`
  - `U10 evidence_insufficient = true`
  - `U11 verdict = complete`
  - this is the first clean live proof that the bounded corpus-gap answer path is working end-to-end instead of collapsing into `retry_write -> STOP_FAILED`

---

## 8. Поточна інфраструктурна карта

### Supabase

- **Lexery DB**: `runs`, `messages`, `mm_memory_items`, `mm_summaries`, `mm_outbox`, `mm_doc_records`, `mm_doc_ingest_log`.
- **Legislation DB**: `legislation_documents`, import/job metadata, catalog-related tables.

### R2

- **`legislation` bucket**: canonical legislation/doclist artifacts.
- **`lexery-legal-agent` bucket**: retrieval traces, MM Docs payloads, MM offload/runtime artifacts.

### Qdrant

- **Legislation cluster**: chunks, acts, catalog.
- **Lexery-LA cluster**: memory semantic, MM Docs chunks by default when docs-specific endpoint is absent.

### Redis

- Durable event queue / retry / DLQ paths.
- Durable RunContext store.

---

## 9. Практичний висновок для наступного блоку

Архітектурно ми вже глибше, ніж це показували старі docs: pipeline не просто “skeleton”, а **дійсно працюючий multi-stage legal-agent runtime** з memory, docs, durable queue/context, compact/full traces і delivery/outbox.

Найбезпечніший наступний етап робіт:

1. окремим slice розкласти великі runtime-модулі без зміни контрактів;
2. покращувати якість U10 answers;
3. тільки після цього повертатись до глибокого переписування важких підсистем.
