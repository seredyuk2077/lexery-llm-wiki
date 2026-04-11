---
aliases:
  - U1 Gateway
tags:
  - lexery
  - brain
  - runtime
created: 2026-04-09
updated: 2026-04-09
status: observed
layer: brain
---

> [!info] Compiled from
> - `raw/architecture-docs/app-README.md`

# Lexery - U1 Gateway

## Роль у Pipeline

U1 — **вхідна точка** всього [[Lexery - Brain Architecture|Brain]]: приймає запити від [[Lexery - API and Control Plane|API / control plane]], перевіряє авторизацію, нормалізує вхідні дані, зберігає вкладення й створює запис [[Lexery - Run Lifecycle|run]] у [[Lexery - Contracts and Run Schema|Supabase]]. Стадія цілком детермінована (без LLM), слугує єдиним local boundary між зовнішнім світом і внутрішнім pipeline.

Кожен запит `POST /v1/runs` проходить такий шлях: auth → rate-limit → attachment processing → **`runs` INSERT** (status `Intake`) → enqueue до [[Lexery - Brain Architecture|Redis / BullMQ]] → відповідь клієнту з `run_id`. Додатково сервер відповідає на `GET /health` для liveness / readiness.

## Code Surfaces

- `apps/brain/gateway/auth.ts` — перевірка `DEV_API_KEY` і `DEV_ALLOW_ANONYMOUS` mode
- `apps/brain/gateway/handler.ts` — основний HTTP handler для `POST /v1/runs`
- `apps/brain/gateway/attachments.ts` — обробка вкладень, byte caps, overflow до [[Lexery - Storage Topology|R2]]
- `apps/brain/gateway/storage.ts` — persistence run record у Supabase `runs` таблиці
- `apps/brain/gateway/queue*.ts` — enqueue до Redis / BullMQ для U2

## Конфігурація

| Ключ | Призначення | Приклад |
|---|---|---|
| `BRAIN_PORT` | HTTP порт Brain сервера | `3081` |
| `DEV_API_KEY` | API ключ для dev-середовища | string |
| `DEV_ALLOW_ANONYMOUS` | Дозволити запити без ключа (dev only) | `true` / `false` |
| `RUNS_PER_MINUTE` | Rate limit: max runs на хвилину | числове |
| `MAX_CONCURRENT_RUNS` | Обмеження одночасних runs у pipeline | числове |
| `QUERY_R2_THRESHOLD_BYTES` | Поріг byte для overflow query у R2 | числове |

Rate-limiting працює per-tenant: `RUNS_PER_MINUTE` і `MAX_CONCURRENT_RUNS` перевіряються до створення run. При перевищенні — HTTP 429 без запису в базу.

## Supabase `runs` Record

При intake U1 створює запис з такими ключовими колонками:

- **`id`** — UUID primary key у Postgres (Supabase)
- **`run_id`** — текстовий зовнішній ідентифікатор run (контракт API / trace; не плутати з `id`)
- **`tenant_id`** — ідентифікатор тенанта (з auth token або dev override)
- **`user_id`** — ідентифікатор користувача (nullable для anonymous)
- **`query`** — оригінальний текст запиту; при перевищенні `QUERY_R2_THRESHOLD_BYTES` тіло мігрує до R2, у колонці лишається ref
- **`status`** — `Intake` на створення, далі змінюється [[Lexery - Run Lifecycle|lifecycle]] при проходженні stages
- **`attachments_manifest`** — JSONB з метаданими вкладень (MIME, розмір, R2 key)
- **`idempotency_key`** — optional клієнтський ключ для запобігання дублікатам

Підтримка **idempotency key**: якщо клієнт передає однаковий ключ повторно, U1 повертає існуючий `run_id` замість створення нового запису — критично для retry-safe інтеграцій з [[Lexery - API and Control Plane|apps/api]].

## Attachment Processing

Вкладення проходять:

1. **Byte-cap перевірка** — максимальний розмір кожного файлу з конфігу; перевищення → rejection.
2. **Run-scoped R2 upload** — кожен attachment зберігається під префіксом `runs/{run_id}/attachments/` у [[Lexery - Storage Topology|Cloudflare R2]].
3. **Manifest запис** — `attachments_manifest` JSONB у `runs` таблиці містить масив `{filename, mime_type, size_bytes, r2_key}` для downstream stages.
4. **Query overflow** — якщо `query` перевищує `QUERY_R2_THRESHOLD_BYTES`, тіло запиту також мігрує в R2 з ref у колонці.

## Runtime Behavior

**Auth modes:** production — bearer token через `apps/api`; dev — `DEV_API_KEY` header або `DEV_ALLOW_ANONYMOUS`. Handler перевіряє auth першим і відхиляє запит до будь-якого I/O.

**Dry-run:** частина контракту — клієнт може передати `dry_run: true`, і U1 створить run з відповідним прапорцем, який downstream stages ([U2](Lexery%20-%20U2%20Query%20Profiling.md), [[Lexery - U3 Planning|U3]]) перевіряють для skip або mock поведінки.

**Enqueue:** після успішного запису handler ставить BullMQ job із `run_id` до черги U2 (`RUN_U2`). Redis connection переиспользовується між requests для low-latency enqueue.

## Test Coverage

| Тест | Фокус |
|---|---|
| `test_attachment_units.ts` | byte caps, MIME validation, R2 upload, manifest |
| `test_queue_units.ts` | BullMQ enqueue, job data, retry semantics |
| `test_redis_queue_units.ts` | Redis connection handling, queue isolation |
| `test_run_view_units.ts` | Run record creation, idempotency key dedup |
| `test_storage_history_units.ts` | Storage persistence, query overflow to R2 |

## Failure Modes

- **Supabase I/O:** якщо INSERT в `runs` не пройшов — HTTP 500 без enqueue; клієнт може retry з idempotency key.
- **Redis / BullMQ:** якщо enqueue впав після INSERT — run залишається в status `Intake` без просування; [[Lexery - Pipeline Health Dashboard|Health Dashboard]] показує такі «застряглі» runs.
- **Rate limit:** перевищення лімітів → HTTP 429; run не створюється.
- **Attachment rejection:** byte-cap або MIME validation fail → HTTP 400 з описом помилки.

## Історична еволюція

Legacy bridge repo мав окремий `U1 Gateway/Intake + R2 bucket migration`. Linear трекав dry-run harness і R2 attachment flow як first-class implementation tasks. Поточна версія зберігає run state переважно через additive snapshot fields, а не через розростання колонок у `runs` — це дозволяє гнучко додавати нові поля без міграцій.

## Key Risk

У міру зрілості production-інтеграцій U1 має перестати бути переважно dev-friendly intake і стати суворішим bridge від `apps/api` [[Lexery - API and Control Plane|control plane]]: формальна валідація контрактів, tenant isolation, structured error responses.

## HTTP surface (коротко)

Окрім `POST /v1/runs`, Brain зазвичай експонує (точний набір — `server.ts` / gateway):

- **`GET /health`** — liveness для оркестраторів і load balancer
- **`GET /v1/runs/:id`** / **`GET /v1/runs/:id/events`** — перегляд run і [[Lexery - Public Trace|public trace]] (див. API docs у репо)
- **`POST /v1/runs/:id/clarification`** — відповідь на clarification (resume path)

Версіонування API: префікс **`/v1/`** узгоджений з [[Lexery - Contracts and Run Schema|shared contracts]].

## Зв’язок із env (gateway + limits)

Повний перелік: [[Lexery - Brain Environment Reference]]. Мінімум для U1: `BRAIN_PORT`, `DEV_*`, `RUNS_PER_MINUTE`, `MAX_CONCURRENT_RUNS`, R2/Supabase ключі для persistence та вкладень.

## See Also

- [[Lexery - U1-U12 Runtime]]

- [[Lexery - API and Control Plane]]
- [[Lexery - U2 Query Profiling]]
- [[Lexery - Brain Architecture]]
- [[Lexery - Run Lifecycle]]
- [[Lexery - Public Trace]]
- [[Lexery - Brain Environment Reference]]
- [[Lexery - Brain Test and Verify Map]]
