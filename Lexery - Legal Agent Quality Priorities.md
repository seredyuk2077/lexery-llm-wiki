---
aliases:
  - Quality Priorities
  - Soft Query Priority
tags:
  - lexery
  - brain
  - product
created: 2026-04-09
updated: 2026-04-09
status: observed
layer: brain
---

> [!info] Compiled from
> - `codex/LEGAL_AGENT_CONTEXT.md`
> - `raw/architecture-docs/CURRENT_PIPELINE_STATE.md`

# Lexery - Legal Agent Quality Priorities

Сторінка фіксує **продуктовий пріоритет** розвитку Legal Agent: що вважати успіхом, а що — відволіканням. Технічні терміни англійською; пояснення українською.

## Головний пріоритет

**Підняти якість на м’яких, природних, «advocate-style» юридичних запитах** — важливіше, ніж ідеальні демо на явних запитах типу «за законом X» або «знайди статтю Y».

Це означає:

- Retrieval і U2 мають стабільно працювати, коли **немає** готового `nreg` у тексті.
- Honesty (`coverage_gap`, doclist reason codes) має бути **передбачуваною** для користувача, а не випадковою.
- U10 якість — головний відкритий gap у pipeline (див. [[Lexery - Current State]], [[Lexery - Pipeline Health Dashboard]]).

## Як мислити про RAG / retrieval

**Правильно:**

- Системні покращення, підкріплені кодом і runtime-доказами.
- Переносимість на різні акти й класи питань.
- Увага до: act selection, companion acts, finalization / honesty, low-confidence behavior, multi-goal retrieval.

**Неправильно:**

- Підгонка під один dataset.
- Hardcode під один кейс.
- Великі словники замість архітектурного виправлення.

Деталі реалізації: [[Lexery - U4 Retrieval]], [[Lexery - Retrieval, LLDBI, DocList]], [[Lexery - DocList Surface]].

## Фокус змін у репозиторії

За замовчуванням інженерні зміни — у **`apps/brain`**. Пакети `apps/api`, `apps/portal`, `apps/lldbi`, `doclist-*` — лише коли задача явно вимагає.

## Мінімальні перевірки після змін

З `LEGAL_AGENT_CONTEXT.md` (запускати з monorepo):

- `pnpm --filter @lexery/brain run brain:test:rag-units`
- `pnpm --filter @lexery/brain run brain:verify:u5`

Розширені сценарії: [[Lexery - Brain Test and Verify Map]].

## Зв’язок із pipeline стадіями

| Тема | Де в pipeline |
|------|----------------|
| Query shape / domain | [[Lexery - U2 Query Profiling]], [[Lexery - U3 Planning]] |
| Recall / latency | [[Lexery - U4 Retrieval]], [[Lexery - U6 Recovery]] |
| Чесність доказів | [[Lexery - U5 Gate]], [[Lexery - U7 Evidence Assembly]] |
| Готовність до write | [[Lexery - U8 Legal Reasoning]] |
| Контекст для моделі | [[Lexery - U9 Assemble]] |
| Якість відповіді | [[Lexery - U10 Writer]] |
| Trust gate | [[Lexery - U11 Verify]] |

## Старі review findings

Будь-які висновки з минулих сесій без повторної перевірки коду вважати **stale**. Перед архітектурними твердженнями — grep / read поточний `Lexery` mainline.

## See Also

- [[Lexery - Brain Architecture]]
- [[Lexery - U1-U12 Runtime]]
- [[Lexery - Decision Registry]]
- [[Lexery - Open Questions and Drift]]
- [[Lexery - Drift Radar]]
- [[Lexery - Coverage Gap Honesty]]
- [[Lexery - Retry and Recovery]]
- [[Lexery - Andrii Serediuk]]
- [[Lexery - Project Brain]]
- [[Lexery - Brain Test and Verify Map]]
- [[Lexery - Brain Environment Reference]]
