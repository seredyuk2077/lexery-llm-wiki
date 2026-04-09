---
aliases:
  - Test Map
  - Verify Map
  - Brain Scripts
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
> - `apps/brain/package.json` (`scripts`)
> - `raw/codebase-snapshots/test-inventory.txt`

# Lexery - Brain Test and Verify Map

Єдина карта **усіх** pnpm-скриптів і harness-ів у `@lexery/brain`. Мета: швидко знайти «що запускати» для регресії U2–U12, retrieval, MM, ORCH і навантаження. Джерело правди в репо — `package.json`; ця нотатка — **індекс** з поясненнями.

## Як користуватися

1. **Щоденна перевірка після змін у U4/U5:** `pnpm brain:verify:smoke` (ланцюжок U3+U4+U5 + короткі retrieval smoke).
2. **Перед merge великого retrieval PR:** `pnpm brain:verify:retrieval-quality` + `pnpm brain:verify:retrieval-multigoal` (або їх `:smoke`).
3. **Пам’ять / MM:** `pnpm brain:test:mm-units`, `pnpm brain:verify:memory-runtime` (потрібен semantic, див. env у [[Lexery - Brain Environment Reference]]).
4. **Повний gate без LLM:** U5 verify використовує `LEGAL_AGENT_DISABLE_LLM=true` у скрипті.

Усі команди виконувати з кореня пакета: `pnpm --filter @lexery/brain run <script>` або з `apps/brain` як у monorepo docs.

## Default CI / verify:migration

| Script | Що робить |
|--------|-----------|
| `verify:migration` | `lint` + `brain:test:rag-units` — мінімальний бар’єр у `build` |
| `test` | Alias на `brain:test:rag-units` |

## U2 — Classify / domain / routing

| Script | Призначення |
|--------|-------------|
| `brain:u2:test` | Інтерактивні / файлові тестові запити U2 |
| `brain:u2:stress` | Навантаження U2 |
| `brain:u2:bench-models` | Порівняння моделей |
| `brain:u2:loadtest` | Load test U2 |
| `brain:verify:u2-cues` | Domain cues |
| `brain:verify:u2-domain:smoke` / `:fast` | Аудит домену (обмежені набори) |
| `brain:verify:u2-routing:smoke` / `:fast` | Аудит routing |
| `brain:test:u2-classify-json-units` | JSON / schema units (`tools/_units`) |

## U3 — Planning

| Script | Призначення |
|--------|-------------|
| `brain:u3:test` | Ручний / CLI план |
| `brain:test:u3-units` | Unit tests план-консьюмера |
| `brain:verify:u3` | Smoke verify U3 |

## U4 — Retrieval / RAG / LLDBI

| Script | Призначення |
|--------|-------------|
| `brain:verify:u4` | Загальний verify U4 |
| `brain:verify:u4-runtime-config` | Конфіг і knobs |
| `brain:verify:routing-hints-low-recall` | Recovery при слабкому recall |
| `brain:verify:retrieval-latency-profile` | Профіль затримок |
| `brain:verify:lldbi-kku115` | Цільовий кейс KKU |
| `brain:verify:retrieval` | Suite retrieval |
| `brain:verify:retrieval-quality` | Якість (+ `:smoke`) |
| `brain:verify:retrieval-multigoal` | Multi-goal (+ `:smoke`) |
| `brain:verify:retrieval-real-dev` | Реальні dev запити (+ `:smoke`, `:fast`) |
| `brain:verify:retrieval-real-holdout` | Holdout |
| `brain:verify:edge-cases` | Edge cases |
| `brain:verify:u4-query-rewrite:smoke` | Query rewrite |
| `brain:verify:act-type-audit` (+ smoke/fast) | Типи актів |
| `brain:verify:rag-assessment` (+ explicit/natural/out/smoke) | Оцінка RAG |
| `brain:verify:rag-golden` (+ smoke) | Golden set |
| `brain:verify:rag-secondary-acts` | Супутні акти |
| `brain:audit:lldbi-act-coverage` | Покриття актів у LLDBI |
| `brain:audit:runs-retrieval-quality` | Аудит якості по runs |
| `brain:audit:runs-chunks` | MCP / chunks quality |
| `brain:dataset:retrieval-real` | Датасет |
| `brain:dataset:act-type-audit` | Датасет act-type |
| `brain:dataset:lldbi-vocabulary` | Знімок vocabulary |
| `brain:generate:act-type-audit-cases` | Генерація кейсів |
| `brain:label:retrieval-expectations` | Розмітка очікувань |
| `brain:report:retrieval-real-failures` | Звіт фейлів |
| `brain:report:retrieval-real-dev-regression` | Регресії |
| `brain:report:retrieval-real-failures-policy-targets-v2` (+ repeat3) | Policy targets |
| `brain:manual:query` | Ручний запит |
| `brain:inspect:run` | Інспекція run |
| `brain:test:rag-units` | **Основні** RAG units |
| `brain:test:rag-golden-units` | Golden eval units |
| `brain:test:prod-hardening` | Prod hardening |
| `brain:test:u4-memory-units` | Поширення memory у U4 |
| `brain:test:u4-query-rewrite-units` | Rewrite phase units |
| `brain:test:retrieval-trace-compact-units` | Compact trace |
| `brain:test:plan-rules-units` | Plan rules (у tree u4) |
| `brain:stress:e2e` | E2E stress |
| `brain:stress:dev` | Dev server з високими лімітами |

## U5 — Gate

| Script | Призначення |
|--------|-------------|
| `brain:test:gate-units` | Units (потрібен `DOCLIST_ENABLED=true` у скрипті) |
| `brain:verify:u5` | Verify gate (LLM вимкнено в рядку скрипта) |

## U6 — Expand / DocList

| Script | Призначення |
|--------|-------------|
| `brain:test:u6-units` | Expand units |
| `brain:test:doclist-lookup-units` | DocList lookup |

## U7 / U8 — Evidence / Reasoning

| Script | Призначення |
|--------|-------------|
| `brain:test:u7-u8-units` | Спільні evidence + reasoning units |

## U9 — Assemble

| Script | Призначення |
|--------|-------------|
| `brain:test:u9-units` | Assemble units |
| `brain:u9:snippet-audit` | Ручний аудит snippets |

## U10 — Writer

| Script | Призначення |
|--------|-------------|
| `brain:test:u10-units` | Legal agent + post-draft policy |
| `brain:test:focus-spec-units` | Focus spec |
| `brain:test:evidence-triage-units` | Evidence triage |
| `brain:test:output-validator-units` | Output validator |
| `brain:test:u10-memory-search-units` | Memory search |
| `brain:test:u10-preview-units` | Preview |

## U11 / U12 / Deliver

| Script | Призначення |
|--------|-------------|
| `brain:test:u11-units` | Verify units |
| `brain:test:u12-units` | Deliver / idempotency |
| `brain:test:memory-summary-units` | Memory summary (write/) |
| `brain:test:source-summary-units` | Source summary (mm) |

## ORCH / Clarification

| Script | Призначення |
|--------|-------------|
| `brain:test:orch-units` | Orchestrator units |
| `brain:test:clarification-units` | Clarification resume |
| `brain:verify:agentivity-live` | Live agentivity (TSX cache off) |

## Gateway / Queue / Storage

| Script | Призначення |
|--------|-------------|
| `brain:test:queue-units` | Черга |
| `brain:test:redis-queue-units` | Redis queue |
| `brain:test:run-view-units` | Run view |
| `brain:test:storage-history-units` | Storage + history |

## Memory (MM) / MM Docs

| Script | Призначення |
|--------|-------------|
| `brain:test:mm-units` | Outbox / core MM |
| `brain:test:mm-doc-units` | MM Docs units |
| `brain:mm:smoke` | Smoke memory |
| `brain:mm:seed-dev-user` | Seed dev |
| `brain:mm:migrate-memory-vectors` | Міграція векторів |
| `brain:verify:memory-runtime` | Runtime semantic |
| `brain:verify:memory-e2e` | E2E |
| `brain:verify:memory-parallel-stress` | Паралельний stress |
| `brain:verify:memory-isolation-real` | Ізоляція |
| `brain:verify:mm-doc-readiness` | Готовність MM Docs |
| `brain:verify:mm-doc-live` | Live smoke |
| `brain:verify:mm-doc-pipeline-live` | Pipeline live |
| `brain:verify:mm-doc-large-stress` | Великий контекст |
| `brain:repair:mm-doc-failed` | Ремонт failed ingest |

## Public trace / DB / R2 / Load

| Script | Призначення |
|--------|-------------|
| `brain:test:public-trace-units` | Контракт public trace |
| `brain:db:capabilities` | Supabase capabilities |
| `brain:r2:capabilities` | R2 capabilities |
| `brain:concurrency:smoke` | Concurrency smoke |
| `brain:verify:api-acceptance` | API acceptance (202, latency) |

## Forensics / Dev chat

| Script | Призначення |
|--------|-------------|
| `brain:forensics:law-refs` | Звіт law refs |
| `brain:forensics:u10-debug` | U10 prompt debug |
| `brain:forensics:u9-u10-chunks` | Діагностика chunks |
| `brain:chat` / `brain:chat:interactive` / `brain:chat:run` / `brain:chat:dev` | Dev chat CLI |
| `brain:test:dev-chat-units` | Dev chat units |

## Misc units

| Script | Призначення |
|--------|-------------|
| `brain:test:json-extract-units` | JSON extract |
| `brain:test:openrouter-units` | OpenRouter client |
| `brain:test:config-key-precedence` | Precedence ключів |
| `brain:test:u2-lldbi-hints-units` | LLDBI hints |
| `brain:test:u2-intent-classifier-units` | Intent classifier |
| `brain:test:u2-parser-units` | Parser |
| `brain:verify:memory-long-conversation` | Довга розмова (mm/) |

## Server / selftest

| Script | Призначення |
|--------|-------------|
| `brain:dev` | `server.ts` |
| `brain:selftest` | U1 selftest |
| `brain:migrate-r2-runs` | Міграція R2 runs |

## Файли тестів у `tools/` (інвентар)

Повний список шляхів до `test_*`, `verify_*`, `stress_*` зберігається в `raw/codebase-snapshots/test-inventory.txt` після `scan-codebase.mjs`. Типово **90+** файлів — це окремий шар доказів покриття поряд з pnpm scripts.

## Рекомендовані комбінації (оператору)

| Сценарій | Команди (послідовно) |
|----------|----------------------|
| Швидка регресія після U4 | `pnpm brain:verify:smoke` |
| Перед релізом retrieval | `pnpm brain:verify:retrieval` + `pnpm brain:verify:retrieval-real-dev:fast` |
| Пам’ять увімкнена | `MEMORY_SEMANTIC_ENABLED=true pnpm brain:verify:memory-runtime` |
| MM Docs | `pnpm brain:verify:mm-doc-readiness` then `MM_DOCS_VERIFY_ALLOW_FALLBACK=true pnpm brain:verify:mm-doc-live` |
| Повна відсутність LLM у write path | уже вбудовано в `brain:verify:u5`; для U10 використовуй `LEGAL_AGENT_DISABLE_LLM` + `U10_DRY_RUN_KEEP_TRIAGE` за потреби |

## See Also

- [[Lexery - Brain Architecture]]
- [[Lexery - U1-U12 Runtime]]
- [[Lexery - Brain Environment Reference]]
- [[Lexery - Maintenance Runbook]]
- [[Lexery - Pipeline Health Dashboard]]
- [[Lexery - Current State]]
- [[Lexery - Technology Stack]]
- [[Lexery - Contributing]]
