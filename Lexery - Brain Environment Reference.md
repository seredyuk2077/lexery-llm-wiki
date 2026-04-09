---
aliases:
  - Environment Reference
  - Brain ENV
  - Config ENV
tags:
  - lexery
  - brain
  - meta
created: 2026-04-09
updated: 2026-04-09
status: observed
layer: brain
---

> [!info] Compiled from
> - `apps/brain/lib/config.ts` (single source of truth)
> - `raw/codebase-snapshots/brain-config.ts` (vault snapshot)

# Lexery - Brain Environment Reference

Довідник **змінних середовища** для `@lexery/brain`. Значення секретів (ключі API, service role) **не** документуються тут — лише **назви** та семантика. Реальні default-и й bounded ranges див. у коді `config`.

## OpenRouter і LLM

| Variable | Role |
|----------|------|
| `OPENROUTER_API_KEY_BRAIN` | Primary key для Brain (LLM + embeddings), перевага над ONLINE |
| `OPENROUTER_API_KEY_ONLINE` | Fallback key |
| `OPENROUTER_LOG_ENABLED` | Логування викликів OpenRouter |
| `CLF_MODEL_ID` | U2 classify model |
| `CLF_FALLBACK_MODEL_ID` | Fallback classify |
| `CLF_TIMEOUT_SEC` | Timeout classify |
| `LEGAL_AGENT_MODEL_ID` / `U10_MODEL_ID` | U10 writer |
| `LEGAL_AGENT_TIMEOUT_SEC` | U10 timeout |
| `LEGAL_AGENT_MAX_TOKENS` | U10 max tokens |
| `LEGAL_AGENT_DISABLE_LLM` | Вимкнути реальний LLM у U10 |
| `LLM_MODE` | `mock` — режим без LLM |
| `U10_REPAIR_MODEL_ID` / `LEGAL_AGENT_REPAIR_MODEL_ID` | Repair passes |
| `U10_REPAIR_STRICT_MODEL_ID` | Строгий repair |
| `U10_PROMPT_DEBUG_ENABLED` | Verbose U10 debug |
| `U10_DRY_RUN_KEEP_TRIAGE` | Dry-run з triage |
| `PROMPT_COMPOSER_*` | `ENABLED`, `MODEL_COMPLEX_ID`, `MODEL_SIMPLE_ID`, `SKIP_THRESHOLD`, `USE_COMPLEX_THRESHOLD`, `TIMEOUT_SEC`, `MAX_TOKENS` |
| `U9_META_TRIAGE_*` | `ENABLED`, `THRESHOLD`, `MAX_SELECT`, `MODEL_ID`, `FALLBACK_MODEL_ID`, `TIMEOUT_SEC`, token/retry knobs, `REASONING_EFFORT`, `RETRIES` |
| `EVIDENCE_TRIAGE_*` | `ENABLED`, `THRESHOLD`, `MODEL_ID`, `FALLBACK_MODEL_ID`, token/retry/excerpt/`MIN_SELECTED`/`MAX_SELECTED`/`SOFT_MIN`/`HARD_MIN` |
| `MM_EXTRACTION_MODEL_ID` | MM fact extraction |
| `MM_EXTRACTION_TIMEOUT_MS` | Extraction timeout |
| `MM_MAX_FACTS_PER_EVENT` | Facts per event |
| `MM_EMBEDDING_MAX_CHARS` | Embed cap |
| `MM_DOCS_TEST_MODEL_ID` | Тестовий override для MM Docs |
| `MM_DOCS_VISION_*` | `ENABLED`, `MODEL_ID`, `TIMEOUT_SEC`, `MAX_TOKENS`, `MAX_IMAGE_BYTES` |
| `MM_DOCS_PDF_VISION_OCR_ENABLED` | OCR для PDF |
| `MM_DOCS_PDF_VISION_MAX_PAGES` | Ліміт сторінок OCR |

## ORCH і public trace

| Variable | Role |
|----------|------|
| `ORCH_ENABLED` | Увімкнути bounded orchestrator (`true` required) |
| `ORCH_MODEL_ID` | Модель ORCH |
| `ORCH_TIMEOUT_SEC` | Timeout |
| `ORCH_REASONING_EFFORT` | Напр. `low` |
| `ORCH_JSON_STRICT` | Строгий JSON |
| `ORCH_ALLOW_ASK_USER` | Дозволити ask_user |
| `ORCH_MAX_LOOPS` | Макс. циклів |
| `ORCH_MAX_IDENTICAL_ACTIONS` | Анти-loop |
| `ORCH_MAX_CLARIFICATIONS` | Ліміт clarification |
| `PUBLIC_TRACE_ENABLED` | Увімкнути public trace |
| `PUBLIC_TRACE_MAX_EVENTS` | Макс. подій на run |

> У деяких deployment описах зустрічаються `PUBLIC_TRACE_RETENTION_DAYS` / `PUBLIC_TRACE_VERBOSE` — перевіряй відповідність поточному `gateway`/`public-trace` коду; канонічні knobs у snapshot `config` можуть відрізнятися.

## U2 — Classify

| Variable | Role |
|----------|------|
| `U2_DISABLE_CONSUMER` | Вимкнути consumer |
| `USE_RULE_BASED_CLASSIFIER` | Тільки rules |
| `U2_INTENT_LLM_ENABLED` | LLM intent |
| `U2_DOMAIN_LLM_ENABLED` | LLM domain |
| `U2_ENTITY_EXTRACTOR_STRICT` | Строгий extractor |
| `U2_GATING_*` | `CONFIDENCE_THRESHOLD`, `ENABLED` |
| `U2_AI_DOMAIN_*` | `ENABLED`, `MODEL`, `MAX_TOKENS`, `TIMEOUT_MS`, `MAX_CALLS_PER_RUN`, `MIN_CONFIDENCE` |
| `U2_WORKER_CONCURRENCY` | Workers |
| `U2_LLM_CONCURRENCY` | Паралельні LLM |
| `U2_U4_STRUCTURED_SEED` | Детермінований seed для structured JSON |

## Redis, queue, run context

| Variable | Role |
|----------|------|
| `REDIS_URL` | Redis endpoint |
| `RUN_CONTEXT_DRIVER` | `inmemory` \| `redis` |
| `QUEUE_DRIVER` | `inmemory` \| `redis` |
| `REDIS_RUN_CONTEXT_COMPRESSION_THRESHOLD_BYTES` | Поріг стиснення RunContext |

## Supabase і taxonomy

| Variable | Role |
|----------|------|
| `SUPABASE_LEXERY_LEGAL_AGENT_DB_URL` | Legal Agent DB |
| `SUPABASE_LEXERY_LEGAL_AGENT_DB_SERVICE_ROLE_KEY` | Service role |
| `SUPABASE_LEGISLATION_URL` / `SUPABASE_LEGISLATION_RAG_URL` | Legislation metadata DB |
| `SUPABASE_LEGISLATION_SERVICE_ROLE_KEY` / `..._RAG_SERVICE_ROLE_KEY` | Keys |
| `ACT_TAXONOMY_TTL_SEC` | TTL ActTaxonomyStore |

## R2

| Variable | Role |
|----------|------|
| `R2_ENDPOINT` | S3-compatible endpoint |
| `R2_ACCESS_KEY_ID` / `R2_ACCESS_KEY` | Access |
| `R2_SECRET_ACCESS_KEY` / `R2_SECRET_KEY` | Secret |
| `R2_RUNS_BUCKET` / `R2_BUCKET_RUNS` | Bucket runs / traces |
| `LLDBI_R2_BUCKET` / `R2_LEGISLATION_BUCKET` / `R2_BUCKET_LEGISLATION` | Legislation canonical JSON |
| `LLDBI_R2_PREFIX` | Optional prefix |
| `R2_REGION` | Region (`auto`) |

## Qdrant — legislation (U4 LLDBI)

| Variable | Role |
|----------|------|
| `QDRANT_URL` / `QDRANT_CLUSTER_ENDPOINT_LEXERY_LEGISLATION_DB` | Endpoint |
| `QDRANT_API_KEY` / `qdrant_clusterAPI_LEXERY_LEGISLATION_DB` | API key |
| `QDRANT_TIMEOUT_SEC` | Timeout |
| `QDRANT_RETRY_ONCE` | Retry |
| `LLDBI_COLLECTION_CHUNKS` / `LLDBI_COLLECTION_ACTS` | Імена колекцій |
| `LLDBI_TOP_K` | Top-K chunks |
| `LLDBI_EMBED_MODEL_ID` | Embeddings model id |
| `LLDBI_EMBED_TIMEOUT_SEC` | Embed timeout |
| `LLDBI_EMBED_BATCH_SIZE` | Batch size |
| `U4_QDRANT_CONCURRENCY` | Паралельність Qdrant |
| `MIN_SCORE_THRESHOLD` | Мінімальний score |
| `MIXED_MODE_LAW_TOP_K_CHUNKS` | Mixed mode law cap |
| `MIXED_MODE_LAW_MAX_SNIPPETS` | Snippets cap |
| `MEMORY_RECALL_LAW_MAX_SNIPPETS` | Memory path law snippets |

## U4 — planner, rewrite, hints, fusion (вибірково)

| Variable | Role |
|----------|------|
| `U4_PLANNER_*` | `ENABLED`, `MODEL_ID`, `TIMEOUT_SEC`, `MAX_TOKENS`, `CONCURRENCY` |
| `U4_ACT_PLANNER_*` | `ENABLED`, `MODEL`, tokens tier1/tier2, `MAX_CALLS_PER_RUN`, `TIMEOUT_SEC` |
| `U4_ROUTING_HINTS_*` | `ENABLED`, `MODEL`, `MAX_TOKENS`, `MAX_CALLS_PER_RUN`, `CONCURRENCY`, `TIMEOUT_SEC`, `CACHE_BY_RUN_ID` |
| `U4_QUERY_REWRITE_*` | `ENABLED`, `MODEL`, `MAX_TOKENS`, `TIMEOUT_SEC`, `MAX_CALLS_PER_RUN`, `MIN_CONFIDENCE` |
| `U4_MULTI_QUERY_*` | `ENABLED`, `MAX_VARIANTS` |
| `U4_REFERENCE_EXPANSION_*` | `ENABLED`, max acts/hits/Qdrant calls |
| `U4_ARTICLE_BACKFILL_*` | `ENABLED`, max calls/added hits |
| `U4_LLDBI_SOFT_PRIOR_*` | Category/doc_type boost |
| `U4_OOD_GUARD_*` | `ENABLED`, score thresholds |
| `U4_GOALS_MAX` | Multi-goal cap |
| `U4_FUSION_TOP_N` / `U4_FUSION_MIN_HITS_PER_GOAL` | Fusion |
| `U4_HITS_CAP` | Cap hits downstream |
| `U4_RERANK_*` | `ENABLED`, `TIMEOUT_SEC` |
| `U4_LABELER_*` | Weak-labeling optional |
| `U4_GOALS_MAX` | Max evidence goals |

## U5 — Gate

| Variable | Role |
|----------|------|
| `GATE_MIN_HITS_THRESHOLD` | Мін. hits |
| `GATE_MIN_AVG_SCORE` | Мін. avg score |
| `DOCLIST_ENABLED` | DocList у gate/plan |
| `FORCE_EXPAND` | Примусовий expand |
| `GATE_DECISION_VERSION` | Версія рішення |
| `U5_STOP_AFTER_GATE` | Зупинитись після gate (verify mode) |

## U9 — Assemble budget (вибірково)

Префікс `U9_*` охоплює десятки knobs: `BUDGET_PROFILE`, `MAX_LAW_SNIPPETS`, `MAX_SNIPPET_CHARS`, `MAX_TOTAL_LAW_CHARS`, per-mode (`MIXED_MODE_*`, `LAW_MODE_*`), weights (`U9_WEIGHT_*`), floors (`U9_RELEVANCE_FLOOR*`), `U9_R2_CONCURRENCY`, `U9_MAX_CHUNKS_PER_SOURCE`, `U9_ANCHOR_TOP_K`, `U9_DOC_MAX_SNIPPET_CHARS`, `U9_META_TRIAGE_*` (дубль у секції LLM). Повний список — у `config.ts`.

## Memory (recent + semantic) і MM outbox

| Variable | Role |
|----------|------|
| `MEMORY_RECENT_ENABLED` | Supabase recent items |
| `MEMORY_RECENT_LIMIT` | Limit |
| `MEMORY_RECENT_TIMEOUT_MS` | Timeout fetch |
| `MEMORY_SEMANTIC_ENABLED` | Qdrant semantic memory |
| `MEMORY_QDRANT_ALLOW_LEGISLATION_FALLBACK` | Небезпечний fallback |
| `QDRANT_MEMORY_URL` / `QDRANT_CLUSTER_ENDPOINT_LEXERY_LA` | Memory cluster |
| `QDRANT_MEMORY_API_KEY` / `..._LEXERY_LA` | Key |
| `MEMORY_QDRANT_COLLECTION` | Collection name |
| `MEMORY_TOP_K` | Top K |
| `MEMORY_SEMANTIC_TIMEOUT_MS` | Timeout |
| `MM_OUTBOX_WORKER_ENABLED` | Background worker |
| `MM_OUTBOX_POLL_INTERVAL_MS` | Poll interval |
| `MM_OUTBOX_BATCH_SIZE` | Batch size |
| `MM_OUTBOX_LEASE_WINDOW_SEC` | Lease |
| `MM_OUTBOX_STALE_PROCESSING_THRESHOLD_SEC` | Stale reclaim |
| `MM_OUTBOX_MAX_ATTEMPTS` | Max attempts |
| `MM_OFFLOAD_*` | `ENABLED`, `THRESHOLD_CHARS`, `PREVIEW_CHARS` |
| `MM_MAX_FACT_TEXT_CHARS` | Max fact length |

## MM Docs

| Variable | Role |
|----------|------|
| `MM_DOCS_ENABLED` | Feature flag |
| `MM_DOCS_BUCKET` / `R2_MM_DOCS_BUCKET` | Bucket |
| `MM_DOCS_RAW_MAX_BYTES` | Upload cap |
| `MM_DOCS_CHUNK_MAX_CHARS` / `MM_DOCS_CHUNK_OVERLAP_CHARS` | Chunking |
| `MM_DOCS_TOP_K` | Retrieval K |
| `MM_DOCS_QDRANT_*` | URL, API key, collection, timeout, memory fallback flag |
| `MM_DOCS_INGEST_LOG_*` | Retention, max rows, prune batch, cooldown |

## DocList recovery

| Variable | Role |
|----------|------|
| `DOCLIST_API_URL` / `CATALOG_RESOLVER_URL` | Resolver URL |
| `DOCLIST_API_TIMEOUT_MS` | Timeout |
| `DOCLIST_RECOVERY_MAX_CANDIDATES` | Candidates |
| `U6_DIRECT_RETRY_MAX` | U6→U4 retry cap без ORCH |

## LLDBI admin hints

| Variable | Role |
|----------|------|
| `LLDBI_ADMIN_HINTS_ENABLED` | Увімкнути hints у snapshot |

## U10 / U11 межі

| Variable | Role |
|----------|------|
| `U11_DIRECT_WRITE_RETRY_MAX` | Макс. прямих U10 rewrite після U11 |

## Server і dev

| Variable | Role |
|----------|------|
| `BRAIN_PORT` | HTTP port |
| `NODE_ENV` | `development` / `production` |
| `DEV_API_KEY` | Dev API key |
| `DEV_ALLOW_ANONYMOUS` | Anonymous dev |
| `RUNS_PER_MINUTE` | Rate limit |
| `MAX_CONCURRENT_RUNS` | Concurrency cap |
| `ATTACHMENT_INLINE_MAX_BYTES` | Inline attachment |
| `REQUEST_INLINE_MAX_BYTES` | Whole request |
| `QUERY_R2_THRESHOLD_BYTES` | Query overflow |
| `QUERY_PREVIEW_HEAD_CHARS` / `QUERY_PREVIEW_TAIL_CHARS` | Preview у DB |

## Як оновлювати цю нотатку

1. Після змін у `apps/brain/lib/config.ts` запусти `scan-codebase.mjs` — оновиться `raw/codebase-snapshots/brain-config.ts`.
2. Додай нові **групи** або рядки в таблиці; для рідкісних knobs достатньо посилання на файл.
3. Не вставляй реальні ключі — лише назви змінних.

## Повнота

У `config.ts` **сотні** згадок `process.env.*` (багато — альтернативні імена для одного й того ж endpoint). Таблиці вище — **навігація**; точні default-и й `Math.min`/`Math.max` bounds завжди в коді.

## See Also

- [[Lexery - Technology Stack]]
- [[Lexery - Brain Test and Verify Map]]
- [[Lexery - Deployment and Infra]]
- [[Lexery - API and Control Plane]]
- [[Lexery - Storage Topology]]
- [[Lexery - Provider Topology]]
- [[Lexery - Public Trace]]
- [[Lexery - ORCH and Clarification]]
- [[Lexery - U1 Gateway]]
- [[Lexery - Memory and Documents]]
