---
aliases:
  - U5 Gate
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

# Lexery - U5 Gate

## Роль у Pipeline

U5 — **контроль якості retrieval** після U4: він порівнює фактичні hits з очікуваннями профілю й плану й вирішує, чи достатньо доказів для подальшої збірки, чи потрібен **expand / recovery** через U6. Рішення виражається в **`GateDecision`** з полем **`expand`** і **`reason_codes`**; у сигналах фіксуються `hits_count`, `top_score`, `avg_score`, `coverage_gap`, покриття direct citation (статті / act hints), стан DocList probe. Після формалізації квітня 2026 **немає стрибка напряму в writer:** при `expand === false` наступний крок — **U7** (evidence assembly), при `expand === true` — **U6**. Це відокремлює «чесність щодо доказів» від генерації відповіді й дає U7/U8 формальний evidence layer.

## Code Surfaces

- `apps/brain/gate/consumer.ts` — `handleU5Event`: load run + RunContext, `evaluateGate`, `updateGateDecision`, `runContext.gate_decision`, enqueue **U6** або **U7**, опційно inline ORCH
- `apps/brain/gate/gate.ts` — `evaluateGate(input)` — core логіка порогів і reason codes
- `apps/brain/gate/types.ts` — Zod `GateDecision`, `GateDecisionReasonCode`, signals
- `apps/brain/lib/pipeline/contracts.ts` — `DoclistTrace`, `RetrievalRetryRequest`, `hasPendingRetrievalRetry` (вхід у gate)
- `apps/brain/lib/config.ts` — `GATE_MIN_HITS_THRESHOLD`, `GATE_MIN_AVG_SCORE`, `FORCE_EXPAND`, `DOCLIST_ENABLED`, тощо

Документація: `apps/brain/docs/architecture/app/u5/README.md` (LEX-118, LEX-131).

## Runtime Behavior

**Input (`EvaluateGateInput`):** `retrievalTrace`, `rawHits`, `queryProfile`, `searchPlan`, опційно `doclistTrace`, `retrievalRetryRequest` (з RunContext або run snapshot).

**Core logic (`evaluateGate`):**

- Обчислює `hits_count`, `avg_score`, `top_score`, `degraded_lldbi`, **`coverage_gap`** з `retrieval_trace.meta.coverage_gap` (`none` | `weak_evidence` | `likely_missing_act` | `out_of_scope`).
- **Direct ref coverage:** для `has_direct_citation` рахує збіги **article_number** (нормалізація форм на кшталт `332-2` / `3322`) та act hints по `title` / `r2_key`, не по змішуванню rada_nreg з назвою акту.
- **`expand === true`** якщо є хоч одна причина з набору: `FORCE_EXPAND`, мало hits, низький avg score, `DEGRADED_LLDBI`, **`DIRECT_REF_MISSING`** (лише article refs), **`PLANNED_DOCLIST_PROBE`** (план мав `use_doclist`, ще не було `doclist_trace`, bare `law_title` без article, відповідні `reason_codes` плану), а також комбінації з `coverage_gap` / ambiguity / need_deep залежно від `planUseLldbi` і конфігу.
- Якщо **`DOCLIST_DISABLED`** або план без legal retrieval — окрема гілка з `expand: false` і чесними reason codes про gap / weak evidence.

**Output:** `GateDecision` персиститься в **`runs.gate_decision`** і RunContext; далі queue **U6** або **U7**. При `ORCH_ENABLED` можливий inline deterministic orchestrator після персисту рішення.

## Failure Modes

- **Неконсистентний RunContext:** відсутній `retrieval_trace` / `raw_hits` → слабкі сигнали, ризик `FEW_HITS` / expand.
- **`FORCE_EXPAND` / тестові env:** завжди recovery; не для production.
- **Пороги `GATE_MIN_HITS_THRESHOLD` / `GATE_MIN_AVG_SCORE`:** занадто агресивні значення → зайві U6 цикли або навпаки.
- **DocList probe race:** `shouldForcePlannedDoclistProbe` залежить від відсутності `doclist_trace` і pending retry — некоректний snapshot → зайвий expand.
- **Misleading hits:** високий score без семантичного покриття — gate дивиться на метрики та direct ref match, не на «змістову правильність»; тому важливі U7/U8.

## Взаємодія з іншими стадіями

**Від U4:** `retrieval_trace`, `raw_hits` у контексті. **Від U2/U3:** `query_profile` (citation, ambiguity, routing), `search_plan` (use_doclist, reason_codes). **До U6:** expand path — recovery, DocList, import loops за політикою expand consumer. **До U7:** no-expand — нормалізація evidence pack. U5 **не** відправляє напряму в U9/U10 — проміжний шар U7/U8 обов’язковий у поточній історії pipeline.

## Історична еволюція

Gate з’явився в bridge-репозиторії разом з раннім U6; з часом додали persistence (`runs.gate_decision`), версіонування рішення, explicit `coverage_gap` signals, planned DocList probe, і **розвели U7/U8** замість прихованого стрибка до writer. З’явився inline ORCH fast-path після U5/U8 для детермінованих гілок без зайвого queue hop — при цьому snapshot/decision trace лишаються узгодженими.

## Конфігурація

| Ключ | Призначення |
|---|---|
| `GATE_MIN_HITS_THRESHOLD` | Мінімальна кількість hits для pass |
| `GATE_MIN_AVG_SCORE` | Мінімальний avg score для pass |
| `DOCLIST_ENABLED` | Дозвіл DocList probe у gate evaluation |
| `FORCE_EXPAND` | Примусовий expand (для тестування [[Lexery - U6 Recovery\|U6]]) |
| `U5_STOP_AFTER_GATE` | Debug: зупинити pipeline після gate decision |

`FORCE_EXPAND` і `U5_STOP_AFTER_GATE` — виключно для dev / staging; у production вони не повинні бути active.

## `gate_decision` JSONB Structure

Поле `runs.gate_decision` зберігає повне рішення gate:

```json
{
  "expand": true,
  "reason_codes": ["FEW_HITS", "DIRECT_REF_MISSING"],
  "thresholds": {
    "min_hits": 3,
    "min_avg_score": 0.42
  },
  "signals": {
    "hits_count": 1,
    "top_score": 0.61,
    "avg_score": 0.38,
    "coverage_gap": "likely_missing_act",
    "degraded_lldbi": false,
    "has_direct_citation_match": false
  }
}
```

Ключові `reason_codes`: `FORCE_EXPAND`, `FEW_HITS`, `LOW_AVG_SCORE`, `DEGRADED_LLDBI`, `DIRECT_REF_MISSING`, `PLANNED_DOCLIST_PROBE`, `COVERAGE_GAP_WEAK`, `DOCLIST_DISABLED`. Кожен reason є self-documenting маркером для post-hoc triage у [[Lexery - Pipeline Health Dashboard|Dashboard]].

## Test Coverage

| Тест | Фокус |
|---|---|
| `test_gate_units.ts` | Core `evaluateGate` logic: thresholds, reason codes, expand decision, direct ref matching, DocList probe, edge cases |

Gate є одним з найбільш unit-testable stages завдяки чисто детермінованій логіці без LLM — кожна комбінація signals/thresholds має передбачуваний outcome.

## Known Drift

- У шапці `gate/consumer.ts` досі зустрічається застарілий коментар про enqueue **U9**; фактичний код ставить **`nextStep = decision.expand ? 'U6' : 'U7'`**.
- Документація інколи описує «confidence» як окреме поле рішення; у контракті домінують **`expand`**, **`reason_codes`**, **`signals`** (scores, counts, coverage_gap).

## See Also

- [[Lexery - U1-U12 Runtime]]
- [[Lexery - Brain Test and Verify Map]]

- [[Lexery - U4 Retrieval]]
- [[Lexery - U6 Recovery]]
- [[Lexery - U7 Evidence Assembly]]
- [[Lexery - Coverage Gap Honesty]]
- [[Lexery - Brain Architecture]]
- [[Lexery - Run Lifecycle]]
- [[Lexery - ORCH and Clarification]]
- [[Lexery - Decision Registry]]
- [[Lexery - DocList Surface]]
- [[Lexery - Retrieval, LLDBI, DocList]]
- [[Lexery - Retry and Recovery]]
- [[Lexery - U3 Planning]]
- [[Lexery - U8 Legal Reasoning]]
- [[Lexery - U2 Query Profiling]]
- [[Lexery - Import Proposal Loop]]
- [[Lexery - LLDBI Surface]]
- [[Lexery - U11 Verify]]
