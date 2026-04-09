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

# Lexery — Retry and Recovery

The Legal Agent uses several **retry** and **resume** mechanisms. Each has explicit **bounds** so cost and oscillation stay predictable. This note ties [[Lexery - U6 Recovery|U6]], [[Lexery - U4 Retrieval|U4]], [[Lexery - U10 Writer|U10]], [[Lexery - U11 Verify|U11]], and [[Lexery - ORCH and Clarification|ORCH]].

## Retrieval retry (U6 → U4)

When retrieval underperforms, **U6** can request a **U4 rerun** with **seeded query variants** so the pipeline does **not** pay duplicate **LLM query-rewrite** cost for the same conceptual attempt.

- **Benefit**: faster iteration on hard retrieval cases
- **Observed**: seeded U4 retry saved on the order of **~7s** on a labor-rights style case (harness / trace evidence; not a universal guarantee)

## Write retry (U11 → U10)

[[Lexery - U11 Verify|U11]] may return **`verdict = retry_write`**, triggering **U10** again after **`resetForWriteRetry`** clears **stale writer artifacts** so the model does not compound bad drafts.

**Cap**: **`U11_DIRECT_WRITE_RETRY_MAX`** — default **1** — limits ping-pong between writer and verifier.

## Bounded recovery contract

**`retrieval_retry_request`** is a **first-class** contract in **`contracts.ts`**, with **`pending` / `applied`** style states. Treating retry as **data** (not implicit flags) lets [[Lexery - ORCH and Clarification|ORCH]] reason about whether another [[Lexery - U4 Retrieval|U4]] pass is allowed.

## ORCH policy: `RUN_U4` under retry

ORCH policy **explicitly allows `RUN_U4`** when a retrieval retry is **pending**, and can **mask stale downstream readiness** so workers do not execute against invalidated intermediate state.

> [!warning] Stale readiness
> “Downstream ready” bits can lie after a retry decision until stages reset. ORCH masking is intentional — trust the **contract**, not cached flags alone.

## Clarification resume vs ORCH replay

When the user answers **clarification**, resume triggers a **deterministic U4 rerun** rather than replaying the entire ORCH chain from scratch. That keeps latency and behavior predictable (see [[Lexery - Run Lifecycle]]).

## Ambiguity deferral

**`shouldDeferRetrievalRetryUntilClarification()`** — when [[Lexery - DocList Surface|DocList]] reports **`AMBIGUOUS_ACT_MATCH`** and clarification is **not** yet answered, **U6 does not keep retrieval retry pending**. Retrying retrieval before disambiguation often wastes tokens and time.

**Observed**: ambiguity deferral removed a full **pre-clarification `RUN_U4`** in at least one traced case.

## Write retry cap (reprise)

Environment knob **`U11_DIRECT_WRITE_RETRY_MAX`** (default **1**) is the **hard** ceiling for direct write retries in the documented configuration.

## Mental checklist for incidents

1. Is the failure **retrieval**, **disambiguation**, **writing**, or **verification**?
2. If **DocList** says **ambiguous**, check clarification state **before** blaming [[Lexery - LLDBI Surface|LLDBI]].
3. If **verifier** loops, check **`retry_write`** count against **`U11_DIRECT_WRITE_RETRY_MAX`**.

## Related

- [[Lexery - U6 Recovery]]
- [[Lexery - U4 Retrieval]]
- [[Lexery - U10 Writer]]
- [[Lexery - U11 Verify]]
- [[Lexery - ORCH and Clarification]]
- [[Lexery - Run Lifecycle]]
- [[Lexery - Coverage Gap Honesty]]
- [[Lexery - DocList Surface]]
