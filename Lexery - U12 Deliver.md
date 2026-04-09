---
aliases:
  - U12 Deliver
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

# Lexery - U12 Deliver

## Runtime Role

U12 persists and delivers the final result.

## Current Code Surfaces

- `apps/brain/write/deliverConsumer.ts`
- outbox and downstream persistence hooks

## Documented Surface

U12 docs explicitly mention:

- inputs
- actions
- output
- code
- idempotency and concurrency
- pipeline
- DB schema notes

## What U12 Owns

- final message delivery
- persistence semantics
- outbox/event emission
- completion handoff

## Current Observed Themes

- direct `verify complete -> U12` shortcut in some runtime paths
- preservation of delivery semantics even when orchestration vocabulary expands

## Why It Matters

U12 is where Lexery stops being an internal runtime and becomes an actual user-visible system effect.

## Головний consumer

**`deliverConsumer`** експортує **`handleU12Event`** у `apps/brain/write/deliverConsumer.ts`: це production-вхід для кроку **U12** після постановки події в чергу (**RunEvent** з `step === 'U12'`). Модуль також містить допоміжні функції на кшталт **`buildRunSourceSummary`**, **`buildMmOutboxPayloadForMemory`**, **`buildDeliveryLldbiHints`** — щоб фінальний **snapshot** і **memory payload** були узгоджені з тим, що вже пройшли **U9**/**U10**.

## Юніт-тести

Файл **`apps/brain/tools/u12/test_deliver_units.ts`** фіксує критичні інваріанти **idempotency**: пропуск deliver, якщо **`completed_at`** уже встановлено; дедуплікація **messages** за `metadata.run_id`; дедуплікація **`mm_outbox`** за парою `payload.run_id` + **`event_type`**; побудова **LLDBI touch hints** для **grounded acts**. Запуск: `pnpm brain:test:u12-units`.

## Що робить U12 покроково

1. **Claim** run у статусі після U11 (**`claimU12Run`**: **`U12_RUNNING`**) з атомарним `UPDATE`, щоб інший інстанс не дублював deliver.
2. За наявності **conversation_id** і тексту відповіді — **insert** асистентського повідомлення в **`messages`** через **`insertAssistantMessageIfNotExists`** (дедуп по **run_id**).
3. Оновлення **`source_summary`** у **snapshot** та опційно **`lldbi_admin_hints`** (наприклад, **`RUN_COMPLETED_WITH_GROUNDED_ACT`**).
4. Постановка події в **`mm_outbox`** для **memory extraction** — у коді безпосередньо використовується **`event_type: 'index_memory'`** з payload (conversation, tenant, user, стислий **`answer_summary`**, **`source_summary`**). Архітектурні документи додатково описують **`summarize_case`** як цільовий тип події для оновлення резюме справи; **MM outbox worker** зараз явно спеціалізується на обробці **`index_memory`**, інші **`event_type`** проходять обмежений шлях.
5. **`completeRun`**: фінальний статус **`completed`**, **`completed_at`**, або при помилці — **`markFailed`** з кодом на кшталт **`U12_DELIVER_ERROR`**.
6. Якщо увімкнено **`mmOutboxWorkerEnabled`**, після enqueue викликається неблокуючий **`runOutboxWorkerBatch`** для «пробудження» воркера по **conversation_id**.

## `mm_outbox`: lease, retry, масштаб

Події лежать у таблиці **`mm_outbox`** з полями оренди та надійності: **`worker_id`**, **`lease_expires_at`**, **`attempt_count`**, **`last_error`** (після міграцій на **lease schema**). Воркер забирає **pending** рядки, оновлює lease, матеріалізує **memory items** / **summaries** / **Qdrant** залежно від конфігурації. Операційний зріз: у реальному **Supabase** накопичувалось порядку **3 564** подій загалом по таблиці — корисно як орієнтир навантаження, не як константа коду.

## Статуси run

**`U12_RUNNING`** → після успішного **`completeRun`** — термінальний **`completed`** (або **`failed`** при винятку до виставлення **`completed_at`**). Разом із цим замикається видимий для користувача ефект: відповідь у **messages** і тригери **MM** [[Lexery - Memory and Documents]].

## Зв’язок з іншими нотатками

- [[Lexery - U11 Verify]] — останній **trust gate** перед тим, як U12 щось пише в **messages** і **outbox**.
- [[Lexery - U1-U12 Runtime]] — повний контур стадій і черг.
- [[Lexery - Memory and Documents]] — як **index_memory** перетворюється на **mm_memory_items**, **embeddings**, політики **scope**.

## See Also

- [[Lexery - U11 Verify]]
- [[Lexery - U1-U12 Runtime]]
- [[Lexery - Memory and Documents]]
- [[Lexery - API and Control Plane]]
- [[Lexery - Run Lifecycle]]
- [[Lexery - Public Trace]]
- [[Lexery - Brain Architecture]]
