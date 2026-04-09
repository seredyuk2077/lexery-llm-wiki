---
aliases:
  - U7 Evidence Assembly
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

# Lexery - U7 Evidence Assembly

## Роль у Pipeline

U7 **нормалізує пакет доказів** після retrieval (і можливих циклів U6): зводить law hits, memory, history, user doc snippets до одного явного контракту **`evidence_assembly`**, щоб U8 і writer не «вгадували» рівень підтримки чи наявні прогалини. Стадія чисто детермінована в коді: без LLM, лише агрегація з **RunContext**. Результат пишеться в RunContext і в snapshot (`u7_evidence`). Наступний крок черги — завжди **U8**. Коди DocList на кшталт **`ACT_FOUND_IN_CATALOG_NOT_INDEXED`** і **`ACT_NOT_FOUND_IN_CATALOG`** потрапляють у **`unresolved_gaps`** як чесні маркери корпусу; «термінальність» у сенсі зупинки безкінечного recovery визначає вже **U8** (дозвіл на write з grounded corpus-gap відповіддю).

## Code Surfaces

- `apps/brain/evidence/consumer.ts` — `handleU7Event`, `buildEvidenceAssembly`
- `apps/brain/lib/pipeline/contracts.ts` — типи `EvidenceAssemblyResult`, `RunContext` (споживаються U7/U8)

Документація: `apps/brain/docs/architecture/app/u7/README.md`.

## Runtime Behavior

**Input:** повний `RunContext` (мінімум `run_id`, типово з `runContextGet`): `raw_hits` або `retrieval_trace.hits`, `memory_items` / `memory_summaries`, `history`, `doc_snippets`, `query_profile` (для `context_mode`), `doclist_trace`, `clarification`.

**`buildEvidenceAssembly` логіка:**

- **`mode`:** `law` | `memory_only` | `docs_only` | `mixed` залежно від підрахунків law vs memory/doc; корекція для `context_mode === 'mixed'` коли law присутній.
- **`source_counts`:** law, memory, history, doc.
- **`coverage_gap_status`:** `doclist_trace.corpus_gap_status` якщо є, інакше `retrieval_trace.meta.coverage_gap`, інакше `none`.
- **`unresolved_gaps`:** для не-`none` coverage — `coverage_gap:<status>`; якщо є `doclist_trace.reason_code` — рядок `doclist:<reason_code>` (включно з **`ACT_FOUND_IN_CATALOG_NOT_INDEXED`**, **`ACT_NOT_FOUND_IN_CATALOG`**, **`AMBIGUOUS_ACT_MATCH`**); pending clarification → `clarification_pending`.
- **`support_level`:** `strong` якщо law ≥ 3 і coverage_gap `none`; інакше `partial` при будь-яких доказах; інакше `weak`.
- **`required_citation_refs`:** до 6 унікальних шляхів цитування з hits.

**Output:** `EvidenceAssemblyResult` (`version`, `assembled_at`, …) у RunContext + `patchSnapshotField(..., 'u7_evidence', result)`; enqueue **U8**.

## Failure Modes

- **Відсутній контекст після U5/U6:** нульові hits і порожні memory → `support_level: weak`, `mode` може бути memory/docs edge cases — U8 вирішує recovery чи clarification.
- **Роз’їзд `raw_hits` vs `retrieval_trace.hits`:** consumer пріоритизує `raw_hits` з контексту; неконсистентність дає несподіваний `source_counts.law`.
- **DocList reason без corpus_gap_status:** gaps усе одно відображаються через `doclist:` префікс; downstream must understand both.
- **U8 без assembly:** `handleU8Event` кидає, якщо немає `evidence_assembly` — порушення порядку черги.

## Взаємодія з іншими стадіями

**Від U4/U5/U6:** агреговані hits, traces, doclist_trace, retry requests у snapshot/context. **До U8:** єдиний вхід для `buildLegalReasoning`. **З clarification / ORCH:** `clarification_pending` у gaps впливає на U8 → `ASK_USER` або ORCH. **Чесність корпусу:** коди DocList + coverage_gap готують сценарії «відповісти чесно про відсутність індексації», описані в [[Lexery - Coverage Gap Honesty]].

## Історична еволюція

Раніше evidence часто лишався неявним між retrieval і writer; виділення **U7** зафіксувало окремий шар збірки з явним `support_level` і `coverage_gap_status`. Паралельно з’явились формальні doclist reason codes для відмінності «не знайшли в каталозі» vs «є в каталозі, але не в індексі».

## Test Coverage

| Тест | Фокус |
|---|---|
| `test_evidence_reasoning_units.ts` | `buildEvidenceAssembly` logic: mode detection, source counts, support level, coverage gap, unresolved gaps з DocList reason codes, citation refs extraction |

Тести покривають key edge cases: порожні hits, memory-only mode, mixed-mode correction, DocList reason code propagation (`ACT_FOUND_IN_CATALOG_NOT_INDEXED`, `ACT_NOT_FOUND_IN_CATALOG`, `AMBIGUOUS_ACT_MATCH`), і pending clarification marker.

## Конфігурація Evidence Triage

Evidence triage у U7 є **детермінованим** (без LLM), але деякі аспекти configurable:

- **Models і flags** для downstream evidence-based decisions configurable через [[Lexery - Brain Architecture|Brain config]]
- **`support_level` thresholds:** `strong` = law ≥ 3 hits + coverage_gap `none`; ці пороги hardcoded у `buildEvidenceAssembly` але можуть бути винесені в config
- **`required_citation_refs` cap:** до 6 унікальних citation paths — обмежує downstream prompt size

## Clarification Resume Flow

Коли [[Lexery - ORCH and Clarification|ORCH]] визначив `AMBIGUOUS_ACT_MATCH` у [[Lexery - U6 Recovery|U6]] і запитав clarification у користувача, відновлення після відповіді **входить через U7**:

1. Користувач відповідає на clarification
2. [[Lexery - ORCH and Clarification|ORCH]] оновлює RunContext з clarification response
3. Run re-enters U7 → `buildEvidenceAssembly` бачить updated `doclist_trace` з resolved act
4. `unresolved_gaps` тепер не містить `clarification_pending`
5. `support_level` перераховується з новими даними
6. Forward до [[Lexery - U8 Legal Reasoning|U8]] з stronger evidence assembly

Це ключовий механізм bounded agentivity: замість вгадування, система чесно запитує і потім перезбирає evidence pack.

## Known Drift

- Vault-тексти інколи кажуть, що U7 «блокує» термінально — у коді U7 лише **маркує** blockers у `unresolved_gaps`; політика write vs U6 vs clarification живе в **[[Lexery - U8 Legal Reasoning|U8]]** (`isWriteCompatibleCorpusGapBlocker`).
- Документація README для U7 коротка; повна картина — у `evidence/consumer.ts` і тестах `brain:test:u7-u8-units`.

## See Also

- [[Lexery - U6 Recovery]]
- [[Lexery - U8 Legal Reasoning]]
- [[Lexery - U9 Assemble]]
- [[Lexery - Coverage Gap Honesty]]
- [[Lexery - LLDBI Surface]]
- [[Lexery - Import Proposal Loop]]
- [[Lexery - Run Lifecycle]]
- [[Lexery - DocList Surface]]
- [[Lexery - Brain Architecture]]
- [[Lexery - ORCH and Clarification]]
- [[Lexery - Retrieval, LLDBI, DocList]]
- [[Lexery - Decision Registry]]
- [[Lexery - U5 Gate]]
- [[Lexery - Glossary]]
- [[Lexery - U3 Planning]]
- [[Lexery - U4 Retrieval]]
- [[Lexery - Retry and Recovery]]
- [[Lexery - U2 Query Profiling]]
- [[Lexery - Project Brain]]
