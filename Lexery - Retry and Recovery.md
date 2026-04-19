---
aliases:
  - Retry and Recovery
  - Recovery
  - Retry Contracts
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
> - Automated wiki maintenance + repository sources
> - See [[Lexery - Source Map]] for trust model

# Lexery — Retry and Recovery

The Legal Agent uses several **retry** and **resume** mechanisms. Each has explicit **bounds** so cost and oscillation stay predictable. This note ties [[Lexery - U6 Recovery|U6]], [[Lexery - U4 Retrieval|U4]], [[Lexery - U10 Writer|U10]], [[Lexery - U11 Verify|U11]], and [[Lexery - ORCH and Clarification|ORCH]].

## Retrieval retry (U6 → U4)

When retrieval underperforms, **U6** can request a **U4 rerun** with **seeded query variants** so the pipeline does **not** pay duplicate **LLM query-rewrite** cost for the same conceptual attempt.

- **Benefit**: faster iteration on hard retrieval cases
- **Observed**: seeded U4 retry saved on the order of **~7s** on a labor-rights style case (harness / trace evidence; not a universal guarantee)

## Bounded Recovery Rerun

[[Lexery - U6 Recovery|U6]] виставляє `retrieval_retry_request.pending` як first-class contract field. Це не implicit boolean flag, а структурований об'єкт з metadata: причина retry, seeded queries, attempt counter. [[Lexery - ORCH and Clarification|ORCH]] читає цей контракт і приймає рішення — дозволити ще один цикл чи ні.

Процес bounded recovery:

1. **U6** аналізує retrieval results і виставляє `retrieval_retry_request.pending`
2. **Executive state** маскує stale downstream artifacts — [[Lexery - U7 Evidence Assembly|U7]], [[Lexery - U8 Legal Reasoning|U8]], [[Lexery - U10 Writer|U10]] outputs вважаються invalidated до завершення retry
3. **ORCH** повинен повернути pipeline до **`RUN_U4`** перед повторенням evidence cycle — прямий skip до U7 без свіжого retrieval заборонений
4. Після успішного U4 rerun, pipeline продовжує нормальний flow з оновленими retrieval results

> [!warning] Stale readiness
> "Downstream ready" bits can lie after a retry decision until stages reset. ORCH masking is intentional — trust the **contract**, not cached flags alone.

## Deterministic Canary

Для оптимізації витрат [[Lexery - ORCH and Clarification|ORCH]] використовує **deterministic canary** — евристику, яка дозволяє уникнути дорогого `gpt-5.2` call на очевидних гілках прийняття рішень. Якщо query profile від [[Lexery - U2 Query Profiling|U2]] вказує на straightforward case (наприклад, single act, clear article reference, no ambiguity), ORCH може прийняти рішення на базі cheaper model або навіть rule-based logic, зберігаючи premium model capacity для справді складних юридичних питань.

Це напряму впливає на [[Lexery - Cost Ledger|cost]] — deterministic canary зменшує mid-run ORCH calls приблизно вдвічі для типових запитів.

## Write retry (U11 → U10)

[[Lexery - U11 Verify|U11]] may return **`verdict = retry_write`**, triggering **U10** again after **`resetForWriteRetry`** clears **stale writer artifacts** so the model does not compound bad drafts.

**Cap**: **`U11_DIRECT_WRITE_RETRY_MAX`** — default **1** — limits ping-pong between writer and verifier.

## U11 → U12 Direct Path

Коли [[Lexery - U11 Verify|U11]] повертає `verify_result.verdict = complete`, pipeline переходить напряму до [[Lexery - U12 Deliver|U12 Deliver]] без додаткових retry loops. Це happy path — відповідь пройшла verification з першої спроби, citation quality достатня, coverage gap або відсутній, або чесно задекларований.

## Clarification Resume from U7

Коли [[Lexery - ORCH and Clarification|ORCH]] отримує відповідь на clarification від користувача, і попередній стан був **`AMBIGUOUS_ACT_MATCH`** від [[Lexery - DocList Surface|DocList]], resume triggers deterministic rerun починаючи з [[Lexery - U7 Evidence Assembly|U7 Evidence Assembly]]. Це зберігає валідні retrieval results з [[Lexery - U4 Retrieval|U4]] (disambiguated act тепер відомий), а pipeline перезбирає evidence assembly з уточненим act binding.

Перевага: уникнення повного U4 rerun, що зберігає ~5-10s latency і відповідний [[Lexery - Cost Ledger|LLM cost]].

## Law-Only U9 Path

Для запитів, де [[Lexery - U2 Query Profiling|U2 Query Profiling]] класифікує питання як **law-only** (без потреби в multi-modal documents), [[Lexery - U9 Assemble|U9 Assemble]] пропускає MM Docs probe і працює виключно з legislation chunks. Це **не** retry mechanism, а **optimization path** — redundant MM Docs lookup уникається на етапі planning, а не post-hoc.

## Bounded recovery contract

**`retrieval_retry_request`** is a **first-class** contract in **`contracts.ts`**, with **`pending` / `applied`** style states. Treating retry as **data** (not implicit flags) lets [[Lexery - ORCH and Clarification|ORCH]] reason about whether another [[Lexery - U4 Retrieval|U4]] pass is allowed.

## ORCH policy: `RUN_U4` under retry

ORCH policy **explicitly allows `RUN_U4`** when a retrieval retry is **pending**, and can **mask stale downstream readiness** so workers do not execute against invalidated intermediate state.

## Ambiguity deferral

**`shouldDeferRetrievalRetryUntilClarification()`** — when [[Lexery - DocList Surface|DocList]] reports **`AMBIGUOUS_ACT_MATCH`** and clarification is **not** yet answered, **U6 does not keep retrieval retry pending**. Retrying retrieval before disambiguation often wastes tokens and time.

**Observed**: ambiguity deferral removed a full **pre-clarification `RUN_U4`** in at least one traced case.

## Write retry cap (reprise)

Environment knob **`U11_DIRECT_WRITE_RETRY_MAX`** (default **1**) is the **hard** ceiling for direct write retries in the documented configuration.

## Mental checklist for incidents

1. Is the failure **retrieval**, **disambiguation**, **writing**, or **verification**?
2. If **DocList** says **ambiguous**, check clarification state **before** blaming [[Lexery - LLDBI Surface|LLDBI]].
3. If **verifier** loops, check **`retry_write`** count against **`U11_DIRECT_WRITE_RETRY_MAX`**.
4. If [[Lexery - ORCH and Clarification|ORCH]] keeps returning to `RUN_U4`, verify `retrieval_retry_request` state — чи не stuck pending?
5. If run завершився без retry але з поганою якістю, перевірте чи deterministic canary не пропустив складний case.

## Related

- [[Lexery - U6 Recovery]]
- [[Lexery - U4 Retrieval]]
- [[Lexery - U10 Writer]]
- [[Lexery - U11 Verify]]
- [[Lexery - ORCH and Clarification]]
- [[Lexery - Run Lifecycle]]
- [[Lexery - Coverage Gap Honesty]]
- [[Lexery - DocList Surface]]
- [[Lexery - Cost Ledger]]

## See Also

- [[Lexery - Pipeline Health Dashboard]]
- [[Lexery - Brain Architecture]]
- [[Lexery - U3 Planning]]
- [[Lexery - U7 Evidence Assembly]]
- [[Lexery - U8 Legal Reasoning]]
- [[Lexery - Provider Topology]]
- [[Lexery - U1-U12 Runtime]]
