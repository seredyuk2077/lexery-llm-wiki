---
aliases:
  - U10 Writer
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

# Lexery - U10 Writer

## Роль у Pipeline

U10 — **генератор юридичної відповіді**: отримує `assembled_prompt` від [[Lexery - U9 Assemble|U9]], компонує повний prompt stack, викликає premium LLM і валідує output. Це **найдорожча стадія** pipeline — використовує найбільшу модель з найвищим token budget. Якість U10 визначає, чи вся попередня bounded робота (retrieval, evidence, assembly) трансформується у корисну юридичну відповідь — або зіпсується hallucination чи poor formatting.

## Code Surfaces

- `apps/brain/write/legalAgent.ts` — core legal agent: prompt construction, LLM call, response parsing
- `apps/brain/write/promptComposer.ts` — prompt stack composition: system prompt, evidence context, instructions, user query
- `apps/brain/write/outputValidator.ts` — structural validation output: format, citations, length
- `apps/brain/write/consumer.ts` — `handleU10Event`: orchestration, persist `llm_result`, enqueue [[Lexery - U11 Verify|U11]]

Документація: `apps/brain/docs/architecture/app/u10/README.md`.

## Конфігурація

| Ключ | Призначення |
|---|---|
| Legal agent model | `gpt-5.2` — premium модель для генерації |
| Repair model | Окрема модель для repair / retry attempts |
| Token caps | Max input / output tokens для LLM call |
| `LEGAL_AGENT_DISABLE_LLM` | Повне вимкнення LLM (для testing) |
| `LLM_MODE=mock` | Mock mode — детерміновані відповіді без real LLM |
| `U10_DRY_RUN_KEEP_TRIAGE` | Зберегти triage навіть при dry-run |

`LEGAL_AGENT_DISABLE_LLM` і `LLM_MODE=mock` дозволяють повний pipeline testing без витрат на LLM — critical для CI/CD і stress tests.

## Runtime Behavior

**Input:** `assembled_prompt` (від [[Lexery - U9 Assemble|U9]]), `evidence_assembly`, `legal_reasoning` (від [[Lexery - U8 Legal Reasoning|U8]]), `query_profile`, RunContext.

**Етапи виконання:**

1. **Prompt Composition** (`promptComposer.ts`) — будує повний prompt stack:
   - System prompt з legal agent instructions
   - Evidence context з `assembled_prompt` snippets
   - [[Lexery - Coverage Gap Honesty|Coverage gap]] propagation: якщо evidence insufficient — explicit instruction "відповісти чесно про обмеження"
   - User query з conversation history
   - Output format instructions (Markdown, citations, structure)

2. **LLM Call** (`legalAgent.ts`) — виклик `gpt-5.2` з повним prompt stack. Включає:
   - Token budget monitoring
   - Timeout handling
   - Retry з repair model при failure

3. **Output Validation** (`outputValidator.ts`) — structural перевірка:
   - Формат (Markdown headers, lists)
   - Наявність citations (cross-ref з `lawSourceRefs` від [[Lexery - U9 Assemble|U9]])
   - Довжина відповіді (min / max bounds)
   - Відсутність заборонених patterns (hallucinated article numbers, etc.)

4. **Repair Policy** — якщо validation fails:
   - Перший retry з repair model і explicit fix instructions
   - Якщо repair fails — `llm_result` зберігається з `validation_warnings`
   - Не блокує pipeline — downstream [[Lexery - U11 Verify|U11]] робить фінальну перевірку

**Output:** `llm_result` у RunContext і `runs` таблиці; enqueue **U11**.

## `llm_result` JSONB Structure

```json
{
  "answerText": "...(Markdown відповідь)...",
  "model": "gpt-5.2",
  "latencyMs": 4200,
  "usage": {
    "prompt_tokens": 7842,
    "completion_tokens": 1523,
    "total_tokens": 9365
  },
  "validation": {
    "passed": true,
    "warnings": [],
    "repair_attempts": 0
  }
}
```

## Test Coverage

| Тест | Фокус |
|---|---|
| `test_evidence_triage_units.ts` | Evidence triage перед prompt composition |
| `test_focus_spec_units.ts` | Focus specification для targeted answers |
| `test_legal_agent_units.ts` | Core legal agent: prompt → LLM → parse |
| `test_memory_search_units.ts` | Memory search integration у writer context |
| `test_output_validator_units.ts` | Output validation: format, citations, bounds |
| `test_u10_preview_units.ts` | Preview mode: partial answers, streaming |

## Failure Modes

- **LLM timeout / rate limit:** retry з exponential backoff; при повному failure — `llm_result` з error status, run marked failed.
- **Hallucination:** output validation ловить деякі випадки (невалідні article refs); але semantic hallucination — downstream проблема для [[Lexery - U11 Verify|U11]].
- **Cost overrun:** `gpt-5.2` — premium pricing; `usage` tracking у `llm_result` для cost monitoring.
- **Retry-write idempotency:** при конкурентних retries U10 може згенерувати два results — idempotency logic забезпечує один winner.

## Взаємодія з іншими стадіями

**Від [[Lexery - U9 Assemble|U9]]:** `assembled_prompt`. **Від [[Lexery - U8 Legal Reasoning|U8]]:** `legal_reasoning`, `evidence_assembly`. **До [[Lexery - U11 Verify|U11]]:** `llm_result` для citation verification і quality check. **[[Lexery - Coverage Gap Honesty|Coverage gap]]:** propagation від upstream визначає tone і completeness disclaimer у відповіді.

## Cost Profile

U10 — головний cost driver pipeline: premium model (`gpt-5.2`) з великим context window. Оптимізації:
- [[Lexery - U9 Assemble|U9]] budget profiles стискають context
- `LLM_MODE=mock` для CI
- Repair model дешевший за primary
- `latencyMs` і `usage` tracking для anomaly detection

Це один з головних remaining bottlenecks між "good architecture" і "consistently great product behavior" — поточна гілка активно працює над reliability і repair behavior.

## See Also

- [[Lexery - U9 Assemble]]
- [[Lexery - U11 Verify]]
- [[Lexery - Current State]]
- [[Lexery - Coverage Gap Honesty]]
- [[Lexery - Retry and Recovery]]
- [[Lexery - Run Lifecycle]]
- [[Lexery - Provider Topology]]
- [[Lexery - ORCH and Clarification]]
- [[Lexery - U4 Retrieval]]
- [[Lexery - Brain Architecture]]
- [[Lexery - Contracts and Run Schema]]
- [[Lexery - U8 Legal Reasoning]]
- [[Lexery - Storage Topology]]
