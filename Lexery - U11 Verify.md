---
aliases:
  - U11 Verify
tags:
  - lexery
  - brain
  - runtime
created: 2026-04-09
updated: 2026-04-09
status: observed
layer: brain
---

# Lexery - U11 Verify

## Runtime Role

U11 checks whether the drafted answer is complete, grounded, and acceptable to deliver.

## Current Code Surfaces

- `apps/brain/write/verify.ts`
- current consumer path still tied into write-runtime split

## Documented Surface

U11 docs explicitly mention:

- inputs / output
- current logic
- important April 9 truth
- concurrency and durable persistence
- code
- observability
- pipeline

## Current Observed Themes

- verifier now respects [[Lexery - Coverage Gap Honesty|coverage-gap]] reality more honestly
- citation requirements can be relaxed when coverage gap is real and explicit
- verify-complete finalization can skip unnecessary ORCH arbitration in some cases

## Why It Matters

U11 is Lexery’s last legal trust gate before user delivery.

## Best Reading

- `Observed`:
  U11 is no longer a trivial “answer exists?” check.
- `Inferred`:
  verifier behavior is one of the project’s strongest product-trust differentiators.

## Статус у коді: mode-aware scaffold

U11 у поточному **Brain** — це насамперед **deterministic**, **mode-aware scaffold** навколо `evaluateVerifyResult` у `apps/brain/write/verify.ts`, а не повноцінний **critic loop** з веб-перевіркою чи зовнішнім **fact-check** [[Lexery - Public Trace]]. Архітектурні діаграми прямо позначають **Verify** як етап з durable `verify_result`, тоді як «повний critic-loop» лишається в планах — варто тримати в голові цей розрив між продуктовою амбіцією й поточною реалізацією.

## Ключові файли та тести

- **`apps/brain/write/verifyConsumer.ts`** — production **consumer** `handleU11Event`: зчитує **RunContext** / `runs`, викликає `evaluateVerifyResult`, пише результат, вирішує наступний крок через `resolvePostVerifyOutcome`, за потреби — **inline orchestrator** (`maybeRunInlineDeterministicOrchestrator`).
- **`apps/brain/tools/u11/test_verify_units.ts`** — юніт-перевірки вердиктів: наприклад, наявність цитати в **law mode**, `retry_write` без цитати, `failed_grounding` при хибному **law framing** у **docs_only**, `ask_user` при `clarification_pending` з `ask_user_reason_code: 'AMBIGUOUS_ACT_MATCH'`, **dry-run bypass** тощо. Запуск: `pnpm brain:test:u11-units`.

## Durable `verify_result` у `runs`

Результат верифікації зберігається в таблиці **`runs`** у колонці **`verify_result` (JSONB)** згідно з контрактом **`VerifyResult`**: насамперед поля **`verdict`** та масив **`reasons`** (плюс опційні **`metrics`**, **`clarification_question`**, **`recommended_next_action`**). Це **durable** джерело істини: повторний вхід у U11 може short-circuit, якщо `verify_result` уже є в БД.

## Переходи статусу run

Типовий шлях: після **claim** атомарно виставляється **`U11_RUNNING`**, після успішного збереження вердикту — **`U11_DONE`** (разом із узгодженими перехідними статусами на кшталт **Deliver** у legacy-шляхах — див. `apps/brain/docs/architecture/app/u11/README.md`). Це важливо для **multi-instance** (Azure) та ідемпотентності.

## Маршрутизація після вердикту

- Якщо **`verify_result.verdict === 'complete'`**, наступний крок — **U12** (`deliverConsumer`), без зайвого round-trip через **ORCH**, коли **orchestrator** вимкнений або коли inline **ORCH** не перехопив сценарій — див. [[Lexery - ORCH and Clarification]] та `resolvePostVerifyOutcome`.
- Для **`retry_write`** / **`retry`** з урахуванням ліміту спроб — повернення до **U10** ([[Lexery - U10 Writer]]).
- Для **`retry_retrieval`** — відкат у сторону **expand/retrieval** (**U6**).
- При сильному **`AMBIGUOUS_ACT_MATCH`** у поєднанні з **`clarification_pending`** вердикт **`ask_user`** узгоджується з політикою **clarification resume**: після відповіді користувача **orchestrator** може відновлювати пайплайн із **U7** (**Evidence** / **Reasoning**), а не завжди проганяти повний **U4** знову — деталі в [[Lexery - ORCH and Clarification]] та документації **U6**.

## Відомі обмеження

- Немає повного **critic / web verification loop** — лише правила та евристики на основі **evidence**, **reasoning** і тексту відповіді.
- Поведінка залежить від **mode** (**law**, **docs_only**, **coverage gap**): ті самі слова відповіді можуть дати різний **`verdict`**.

## See Also

- [[Lexery - U1-U12 Runtime]]
- [[Lexery - U10 Writer]]
- [[Lexery - U12 Deliver]]
- [[Lexery - ORCH and Clarification]]
- [[Lexery - Coverage Gap Honesty]]
- [[Lexery - Retry and Recovery]]
- [[Lexery - Run Lifecycle]]
