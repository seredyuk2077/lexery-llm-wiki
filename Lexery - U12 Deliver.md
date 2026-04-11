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

## Config Knobs

These knobs govern the **MM outbox worker** that drains `mm_outbox` after U12 enqueues memory-oriented events. Names follow the runtime `config` object in `apps/brain/lib/config.ts` (env vars in `SCREAMING_SNAKE_CASE`).

| Knob | Default (wiki / operator profile) | Purpose |
|------|-----------------------------------|---------|
| `mmOutboxWorkerEnabled` | `true` | When enabled, the brain server runs a polling worker and U12 may trigger a non-blocking `runOutboxWorkerBatch` wake-up for the conversation after a successful outbox insert. |
| `mmOutboxBatchSize` | `10` | Maximum number of outbox rows processed per worker cycle (clamped in code to 1–20). |
| `mmOutboxLeaseTimeoutSec` | `300` | Lease window in seconds: how long a claimed row stays “owned” before it can be reclaimed; corresponds to `mmOutboxLeaseWindowSec` / `MM_OUTBOX_LEASE_WINDOW_SEC`. |
| `mmOutboxMaxAttempts` | `3` | Per-row retry budget before the worker treats the event as exhausted (clamped in code to 1–10). |

**Repo truth check:** if `MM_OUTBOX_WORKER_ENABLED` is unset, `mmOutboxWorkerEnabled` is `false` until explicitly set to `'true'` (batch-only / tests). If `MM_OUTBOX_BATCH_SIZE` is unset, the code default is `5`, not `10`—tune env for heavier throughput. Related: `mmOutboxPollIntervalMs`, `mmOutboxStaleProcessingThresholdSec`.

## Run Status After U12

- **`U12_RUNNING` → `completed` (normal):** after `claimU12Run` succeeds, U12 performs message insert (when applicable), patches `source_summary` / optional `lldbi_admin_hints`, enqueues `mm_outbox`, then calls `completeRun(run_id)`. That path sets status to **`completed`** together with a fresh **`completed_at`** timestamp (ISO string, same instant as the successful terminal update).
- **`U12_RUNNING` → `failed` (`U12_DELIVER_ERROR`):** if any step throws before `completeRun` finishes, `handleU12Event` catches the error and, when `completed_at` was **not** yet set, calls `markFailed(run_id, 'U12_DELIVER_ERROR')`. If completion already happened, the failure path does not overwrite a successful terminal state.
- **`completed_at`:** set inside `RunRepository.completeRun` via `safeUpdateRunStatus`, which writes `completed_at: now` (current time in ISO 8601) alongside the transition to **`completed`** from eligible prior statuses (`completed`, `U11_DONE`, `Deliver` per the safe-update allowlist).
- **Idempotent delivery:** the consumer **returns immediately** if `findByRunId` shows `completed_at` already populated—no second assistant message, no duplicate outbox row for the same `(run_id, event_type)`, and no re-completion. A lost claim after another instance finished behaves the same way once `completed_at` is visible.

## mm_outbox Schema

Core columns used for routing, payload, and worker lease semantics (lease migration adds reliability fields; additional first-class columns such as `conversation_id`, `run_id`, `tenant_id`, and `status` are populated by U12 inserts):

| Column | Role |
|--------|------|
| `id` | Primary key for the outbox row. |
| `event_type` | Event discriminator (U12 uses `'index_memory'` for memory extraction; other types may exist for future MM flows). |
| `payload` | JSON payload: conversation/tenant/user, bounded `answer_summary`, `source_summary`, embedded `run_id`, etc. |
| `worker_id` | Identifier of the worker instance that holds the lease while processing. |
| `lease_expires_at` | Timestamp after which another worker may reclaim the row. |
| `attempt_count` | Number of processing attempts (drives retry / max-attempt policy). |
| `last_error` | Last failure message or structured error for observability and debugging. |
| `created_at` | Insert time when U12 (or another producer) enqueued the event. |
| `processed_at` | Set when the worker finishes successfully (or transitions the row out of pending processing). |

## Live Production Metrics

Snapshot figures from the Lexery production Supabase footprint (use as order-of-magnitude telemetry, not compile-time constants):

- **Total completed runs:** 17,183  
- **MM Outbox events (`mm_outbox` rows):** 3,596  
- **Messages table row count:** 7,239  
- **`runs` table approximate size:** 370 MB  

These numbers inform capacity planning for outbox worker batch sizing, index health, and retention—not guarantees in code or migrations.

## LLDBI Admin Hints

U12 can append conservative, additive **`snapshot.lldbi_admin_hints`** so downstream **LLDBI brain-admin** jobs see which acts were actually grounded in live runs.

- **Emitter:** `buildDeliveryLldbiHints` in `apps/brain/write/deliverConsumer.ts` inspects `retrieval_trace.meta.selected_acts`. For each act with a non-empty `rada_nreg`, it appends a **`hint_type: 'touch'`** record with **`reason_code: 'RUN_COMPLETED_WITH_GROUNDED_ACT'`** and **`source_stage: 'U12'`**, plus optional `title` from `act_title` and a short `metadata.query` preview.
- **Persistence:** `handleU12Event` merges deduped hints into the run snapshot (`patchSnapshotField(..., 'lldbi_admin_hints', nextHints)`) only when the new list is strictly longer than the existing one—so reruns or replays do not spam duplicates.
- **Weekly batch bridge:** `apps/lldbi/brain-admin` (`fetchSignalsFromBrainRuns` / `extractSignalsFromBrainRuns`) scans recent **`runs`** rows, reads **`snapshot.lldbi_admin_hints`**, and maps `touch` hints into **`BrainAdminSignal`** entries with `note` carrying **`reason_code`** (including **`RUN_COMPLETED_WITH_GROUNDED_ACT`**). The GitHub Actions workflow **`.github/workflows/lldbi-brain-admin.yml`** runs **`brain-admin batch --brain-runs`** on a schedule with widened `--brain-lookback-hours` / `--brain-limit` so a weekly cadence still captures hints emitted earlier in the week.
- **Semantics:** hints are **telemetry for corpus maintenance** (usage ledger, `touch` bias toward protect/refresh decisions)—not control-plane commands. They complement DocList-derived fallbacks (`doclist_trace`) when explicit hints are missing.

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

- [[Lexery - Brain Test and Verify Map]]

- [[Lexery - U11 Verify]]
- [[Lexery - U1-U12 Runtime]]
- [[Lexery - Memory and Documents]]
- [[Lexery - API and Control Plane]]
- [[Lexery - Run Lifecycle]]
- [[Lexery - Public Trace]]
- [[Lexery - Brain Architecture]]
