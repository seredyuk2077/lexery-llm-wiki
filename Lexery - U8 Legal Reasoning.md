---
aliases:
  - U8 Legal Reasoning
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

# Lexery - U8 Legal Reasoning

## Роль у Pipeline

U8 перетворює **`evidence_assembly`** (з U7) на обмежений пакет **`legal_reasoning`**: це не вільна генерація відповіді, а **політика готовності** до U9/U10. Вона виставляє `ready_for_write`, `answer_mode`, збирає `unresolved_blockers`, і головне — **`recommended_next_action`**: типово **`RUN_U9`**, або **`RUN_U6`** для слабких доказів / coverage-gap recovery, або **`ASK_USER_CLARIFICATION`** при незнятій двозначності DocList. **Відповідь користувача на clarification** (`clarification.status === 'answered'`) знімає блокер **`doclist:AMBIGUOUS_ACT_MATCH`** з переліку gaps для рішення. Після U8 черга йде в **U9**, **U6**, **ASK_USER**, або при увімкненому ORCH — у **ORCH** з можливим inline fast-path (як у U5).

## Code Surfaces

- `apps/brain/reasoning/consumer.ts` — `buildLegalReasoning`, `resolveReasoningNextStep`, `handleU8Event`
- `apps/brain/lib/pipeline/contracts.ts` — `LegalReasoningResult`, `EvidenceAssemblyResult`, `RunContext`
- `apps/brain/orchestrator/runtime.ts` — `maybeRunInlineDeterministicOrchestrator` (після U8)
- `apps/brain/lib/config.ts` — `orchEnabled` та інше

Документація: `apps/brain/docs/architecture/app/u8/README.md`.

## Runtime Behavior

**Input:** RunContext з обов’язковим `evidence_assembly`; також `doclist_trace`, `clarification`, `query_profile`, `retrieval_retry_request`.

**`buildLegalReasoning` (скорочено):**

- Базові blockers з `evidence.unresolved_gaps`, з **фільтром:** якщо clarification answered — викидається gap `doclist:AMBIGUOUS_ACT_MATCH`.
- Якщо `support_level === 'weak'` — додається `weak_evidence`.
- Обчислюються прапорці: `ambiguousDoclistStillBlocking` (AMBIGUOUS_ACT_MATCH і clarification не answered), `hasGroundedLegalGapCue` (direct citation або law_title/act_abbrev/article_ref), `hasExplicitCorpusGapSignal` (coverage_gap:* або doclist ACT_* codes), `hasWriteCompatibleCorpusGapBlockers` (усі blockers ∈ множина «corpus-gap compatible» включно з **`doclist:ACT_FOUND_IN_CATALOG_NOT_INDEXED`**, **`doclist:ACT_NOT_FOUND_IN_CATALOG`**).
- **`canWriteCoverageGapAnswer`:** explicit corpus-gap signal + grounded legal cue + compatible blockers + не memory-only контекст + немає pending clarification.
- **`canWriteAfterBoundedRecovery`:** notes retry містять **`DIRECT_RETRY_LIMIT_REACHED`**, є law hits, blockers лише weak_evidence / coverage_gap:weak_evidence, не memory mode, не ambiguous doclist pending.
- **`ready_for_write`:** немає blockers, або coverage-gap write path, або post-recovery exhaustion path, або обмежений memory-only direct write.
- **`recommended_next_action`:** якщо не ready — clarification/ambiguous → **`ASK_USER_CLARIFICATION`**; інакше gaps з coverage → **`RUN_U6`**; інакше weak → **`RUN_U6`**; інакше **`RUN_U9`**.

**`resolveReasoningNextStep`:** при `orchEnabled` і невідповідності «просто U9» → `ORCH`; інакше мапінг на `ASK_USER` / `U6` / `U9`.

## Failure Modes

- **Пропущений U7:** throw `U8 requires evidence_assembly`.
- **Застряглі clarification:** pending clarification + ambiguous doclist → стійкий `ASK_USER` path (очікується UX).
- **Надмірний U6 loop:** частково пом’якшено policy для `DIRECT_RETRY_LIMIT_REACHED` + наявні law hits (квітень 2026) — моніторити через notes `BOUNDED_RECOVERY_EXHAUSTED_PROCEED_TO_WRITE`.
- **ORCH inline не відпрацював:** fallback до звичайного enqueue ORCH.

## Взаємодія з іншими стадіями

**Від U7:** `evidence_assembly` — єдиний вхід. **До U9/U10:** `ready_for_write` + `recommended_next_action === RUN_U9` (або ORCH вирішує еквівалент). **До U6:** слабкі докази або coverage-gap без права чесного write. **До ASK_USER / Clarification:** `AMBIGUOUS_ACT_MATCH` поки користувач не відповів. **З DocList / Gate:** reason codes та retry notes формують blockers і write-compatible класи.

## Історична еволюція

Раніше reasoning часто зливався з writer prompt; виділення U8 зробило політику **інспектованою** (`u8_reasoning` у snapshot). Додали розділення: recoverable weak evidence vs ambiguity pause vs **чесні corpus-gap** відповіді для ACT_* кодів; потім — обмеження безкінечного U6 після вичерпання direct retry budget.

## Known Drift

- Верхньорівневі описи інколи кажуть «U8 генерує legal argument» — у коді це **routing / readiness**, не фінальний текст (той у U9/U10).
- README посилається на конкретні json proof у `tools/_reports/` — шляхи в репо можуть змінюватись; джерело правди — `reasoning/consumer.ts` + unit tests.

## See Also

- [[Lexery - U7 Evidence Assembly]]
- [[Lexery - U9 Assemble]]
- [[Lexery - U10 Writer]]
- [[Lexery - ORCH and Clarification]]
- [[Lexery - Coverage Gap Honesty]]
- [[Lexery - Run Lifecycle]]
- [[Lexery - Decision Registry]]
- [[Lexery - Brain Architecture]]
- [[Lexery - U5 Gate]]
- [[Lexery - U6 Recovery]]
- [[Lexery - DocList Surface]]
- [[Lexery - Import Proposal Loop]]
- [[Lexery - Glossary]]
- [[Lexery - Provider Topology]]
- [[Lexery - Contracts and Run Schema]]
- [[Lexery - U3 Planning]]
- [[Lexery - U2 Query Profiling]]
- [[Lexery - Retry and Recovery]]
- [[Lexery - Project Brain]]
- [[Lexery - U4 Retrieval]]
- [[Lexery - U11 Verify]]
