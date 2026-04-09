---
aliases:
  - Branch Divergence
tags:
  - lexery
  - product
created: 2026-04-09
updated: 2026-04-09
status: inferred
layer: product
---

# Lexery - Branch Divergence

## Why This Matters

Одна з найважливіших truths про сучасний Lexery:
проект існує **одночасно в двох активних гілках розвитку**.

## Exact Observed Snapshot

### Local branch vs remote brain branch

- Local branch:
  `legal-agent-brain-dev`
- Relative to `origin/legal-agent-brain-dev`:
  `0` remote-only commits, `10` local-only commits

### Local branch vs remote default branch

- Relative to `origin/dev`:
  `21` remote-only commits, `26` local-only commits

## What Lives On `origin/dev`

- shared contracts package
- auth refactor
- auth screens
- richer profile/user metadata shape
- subscription plan UI
- workspace/sidebar/product-shell refinements
- open auth registration infra PR

## What Lives On `legal-agent-brain-dev`

- bounded legal orchestrator
- clarification pause/resume hardening
- deterministic ORCH cost cuts
- DocList recovery
- brain-admin proposal queue wiring
- retry reuse and tail-latency tuning

## Best Interpretation

- `Observed`:
  `origin/dev` is the product integration branch.
- `Observed`:
  `legal-agent-brain-dev` is the runtime/brain innovation branch.
- `Inferred`:
  these are not trivial parallel features; they are partially different product realities.

## Consequences

### Positive

- The team can move fast on product shell and brain quality independently.

### Negative

- Root README can drift badly.
- Contracts can diverge.
- Plan codes and feature assumptions can split.
- Integration debt compounds silently.

## Documentary Drift Caused By This Split

- Root `README.md` still says `apps/portal` is a placeholder.
- Current code proves `apps/portal` is already real.
- Some portal docs lag behind actual auth/chat/product progress.
- Azure docs describe a deployment target that current live code only partially proves.

## Strategic Reading

Lexery’s current challenge is **not lack of architecture**.
It is reconciling:

- a fast-moving legal brain branch
- a fast-moving product shell branch
- and the contracts that must sit between them

## See Also

- [[Lexery - Current State]]
- [[Lexery - Product Surface]]
- [[Lexery - Brain Architecture]]
- [[Lexery - Open Questions and Drift]]
