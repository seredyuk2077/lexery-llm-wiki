---
aliases:
  - U3 Planning
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

# Lexery - U3 Planning

## Роль у Pipeline

U3 відповідає на питання **«де шукати?»** до того, як U4 торкнеться LLDBI чи пам’яті: це перше явне **рішення мозку** про джерела доказів і пороги retrieval. Детермінований rules engine перетворює `QueryProfile` і `RoutingFlags` на **`SearchPlan`** (прапорці `use_lldbi`, `use_memory`, `use_doclist`, `use_web`, thresholds, `reason_codes`). Далі **U3a** у тому ж модулі будує виконувані **`SearchStep`** лише для того, що U4 реально вміє (наприклад `lldbi_chunks`, `lldbi_acts`, `memory`); DocList / import / web залишаються в `SearchPlan.sources` для політики U5/U6 — без «декоративних» кроків у списку кроків. Аудит зберігається в `runs.search_plan` (JSONB) як plan + steps + `built_at` (LEX-105).

## Code Surfaces

- `apps/brain/plan/consumer.ts` — `handleU3Event` (rules → plan → persist → enqueue `U3a`), `handleU3aEvent` (builder → steps → enqueue U4); MM docs-only override (`applyMmDocsOnlyPlanOverride`)
- `apps/brain/plan/rules.ts` — `buildSearchPlanFromProfile` (U3 rules engine)
- `apps/brain/plan/builder.ts` — `buildSearchSteps` (U3a)
- `apps/brain/plan/types.ts` — `SearchPlan`, `SearchStep`, Zod, `RunRecordSearchPlanAudit`
- `apps/brain/lib/queryScopeHints.ts` — підказки для memory-only / legal reference (імпорт з consumer)

Документація: `apps/brain/docs/architecture/app/u3/README.md`, `pipeline.md`, `decisions/schema-search-plan.md`, `decisions/u3-u3a-step-boundary.md`.

## Runtime Behavior

**Input:** run з `query_profile` (з U2), зокрема `routing_flags.context_mode` (`law` | `memory` | `mixed`), `entities`, `ambiguity`, `computed_flags`. Якщо профілю немає — degraded plan з `degraded_no_profile`.

**Rules highlights (`rules.ts`):**

- Нерозв’язаний `context_mode` → обмежені або деградовані джерела (`CONTEXT_MODE_UNRESOLVED`, за наявності структурних legal cues — `DEGRADED_STRUCTURAL_LEGAL_FALLBACK`).
- `memory` / `mixed` вмикають `use_memory` і змішаний top_k для chunks.
- **`explicit_act_title_probe`:** `shouldProbeDoclistForExplicitActTitle` — рівно один `law_title`, без `article_ref` / `act_abbrev`, і лише в «research-like» контексті (`intent === 'research'` або `ambiguity.is_ambiguous`), без `exact_act_alias_grounded` → **`use_doclist: true`**.
- Hard ambiguity / `need_deep_retrieval` / `need_web` — за `doclistEnabled` і legal context можуть увімкнути DocList або web у sources.

**Output:** `SearchPlan` + optional `SearchStep[]` у audit; RunContext оновлюється полем `search_plan`. U3a enqueue на **U4**.

## Failure Modes

- **I/O до БД / RunContext:** `withTransientPlanIoRetry` на transient network errors; при повному провалі — `markFailed` з `U3_PLAN_ERROR`.
- **Відсутній або частковий query_profile:** degraded план; retrieval може бути слабшим.
- **Неправильне тлумачення context_mode:** усе ще можливі edge cases на межі memory vs law (див. query scope hints і MM override).
- **DocList probe:** занадто широкі запити раніше зачіпало probe — звуження `explicit_act_title_probe` зменшило live bug; моніторити regression через `reason_codes` у plan.

## Взаємодія з іншими стадіями

**Від U2:** `QueryProfile`, `routing_flags`. **До U4:** executable `SearchStep` + thresholds. **До U5/U6:** `SearchPlan.sources.use_doclist` / web / import policy не виконуються в U4 як окремі кроки, а керують expand/recovery після gate. **MM / документи:** `applyMmDocsOnlyPlanOverride` може вимкнути LLDBI для сценаріїв «лише користувацькі документи», зберігаючи memory за явного recall.

## Історична еволюція

`SearchPlan` довго був центральним об’єктом у легасі-архітектурі; контракт-first (LEX-105) формалізував audit у RunRecord. Пізніше розділили **U3 vs U3a**, щоби відділити політику джерел від конкретних executable steps і прибрати mismatch, коли в steps були «фантомні» doclist/import кроки, які U4 не виконував. `explicit_act_title_probe` навмисно звузили після інцидентів з широкими трудовими / multi-act запитами.

## Test Coverage

| Тест | Фокус |
|---|---|
| `test_plan_consumer_units.ts` | Rules engine → plan → persist → enqueue; degraded plan fallback |
| `u3_plan_test.ts` | Integration: повний цикл U3 → U3a → SearchStep[] enqueue |

## Критичний Bottleneck: Planning Stuck Runs

За даними [[Lexery - Pipeline Health Dashboard|Pipeline Health Dashboard]], **7 449 runs (28% від загальної кількості)** застрягли зі статусом `Planning`. Це найбільша single-stage затримка в pipeline. Причини:

- **I/O timeout до Supabase** при persist `search_plan` — transient network errors, які `withTransientPlanIoRetry` не завжди відловлює.
- **Відсутній або partial `query_profile`** з [[Lexery - U2 Query Profiling|U2]] — degraded plan генерується, але RunContext update може не завершитися.
- **BullMQ backpressure** — при високому concurrency enqueue U4 може бути відкладений, а run залишається в `Planning` status.
- **Unhandled edge cases** в `context_mode` resolution — mixed-mode запити з ambiguous routing можуть зависати на rules evaluation.

Моніторинг: `reason_codes` у `runs.search_plan` JSONB дозволяють post-hoc triage; [[Lexery - Decision Registry|Decision Registry]] трекає зміни порогів і правил.

## `search_plan` JSONB Structure

Поле `runs.search_plan` зберігає повний audit:

- **`sources`** — об'єкт з прапорцями `use_lldbi`, `use_memory`, `use_doclist`, `use_web` та thresholds
- **`steps`** — масив `SearchStep[]` (тільки executable: `lldbi_chunks`, `lldbi_acts`, `memory`); фантомні `doclist` / `import_fast` / `web` НЕ потрапляють
- **`reason_codes`** — масив рядків: `CONTEXT_MODE_UNRESOLVED`, `DEGRADED_STRUCTURAL_LEGAL_FALLBACK`, `EXPLICIT_ACT_TITLE_PROBE`, тощо
- **`built_at`** — ISO timestamp побудови (LEX-105 формалізація)
- **`degraded_no_profile`** — boolean marker якщо plan побудований без повного query_profile

Це основний контракт між U3 і downstream: [[Lexery - U4 Retrieval|U4]] виконує `steps`, [[Lexery - U5 Gate|U5]]/[[Lexery - U6 Recovery|U6]] читають `sources` для expand/recovery policy.

## Known Drift

- Коментарі в старих файлах інколи кажуть «enqueue U9» після gate — фактичний шлях після U5: **U6 або U7** (див. [[Lexery - U5 Gate|U5]]).
- `SearchStepKind` у types ще містить `doclist` / `import_fast` / `web`, але builder їх не емітить — джерело правди для DocList — `SearchPlan.sources` + [[Lexery - U6 Recovery|U6]].

## See Also

- [[Lexery - Pipeline Health Dashboard]]
- [[Lexery - U2 Query Profiling]]
- [[Lexery - U4 Retrieval]]
- [[Lexery - U5 Gate]]
- [[Lexery - U6 Recovery]]
- [[Lexery - DocList Surface]]
- [[Lexery - Brain Architecture]]
- [[Lexery - Decision Registry]]
- [[Lexery - Run Lifecycle]]
- [[Lexery - Retrieval, LLDBI, DocList]]
- [[Lexery - LLDBI Surface]]
- [[Lexery - Import Proposal Loop]]
- [[Lexery - Contracts and Run Schema]]
- [[Lexery - ORCH and Clarification]]
- [[Lexery - U7 Evidence Assembly]]
- [[Lexery - U8 Legal Reasoning]]
- [[Lexery - Retry and Recovery]]
- [[Lexery - Coverage Gap Honesty]]
- [[Lexery - Project Brain]]
