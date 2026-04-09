---
aliases:
  - ORCH and Clarification
tags:
  - lexery
  - brain
  - runtime
created: 2026-04-09
updated: 2026-04-09
status: observed
layer: brain
---

# Lexery - ORCH and Clarification

## Short Read

The recent Brain branch is not just “more stages”.
Its main conceptual leap is **bounded orchestration with explicit clarification handling**.

## ORCH

### Role

- top-level adaptive controller
- inserted only where the next step is not trivially deterministic

### Current documented surface

- runtime role
- action surface
- safety rules
- observability
- verification
- April 8 / April 9 notes

### Meaning

- `Observed`:
  ORCH is designed as a governor, not as a replacement for the U-stage system.
- `Inferred`:
  it is the project’s answer to “how do we add agentic behavior without legal chaos?”

## Clarification

### Role

- formal pause/resume path
- user-facing branch for ambiguity cases like ambiguous act match

### Current observed truths

- stale `ASK_USER` overwrite race was fixed
- clarification answers can resume execution
- ambiguity-only clarification paths can avoid unnecessarily replaying all retrieval
- resume path now distinguishes between:
  rerun retrieval
  reuse grounded retrieval

## Public Trace

### Observed

- runtime map and rollout docs both treat [[Lexery - Public Trace|public trace]] as a major additive feature
- it can be enabled independently from ORCH

### Meaning

- trace is not only debugging; it is part of how the team intends to safely roll out orchestration

## Rollout Posture

- `ORCH_ENABLED=false` by default
- public trace can be enabled separately
- recommended flow:
  shadow eval → trace first → low-risk canary → gradual widening

## Strategic Meaning

- `Observed`:
  ORCH is being rolled out carefully, not assumed safe by default.
- `Observed`:
  clarification is no longer decorative; it is part of real runtime control.
- `Inferred`:
  Lexery is explicitly trying to solve the “agentic, but trustworthy” problem in a legal domain.

## Recent Runtime Themes

- deterministic action skipping to reduce unnecessary model spend
- clarification race fixes
- reduced retrieval replay on answered ambiguity
- ORCH telemetry and decision snapshots
- public trace and lldbi-admin hints as additive state

## See Also

- [[Lexery - Brain Architecture]]
- [[Lexery - U1-U12 Runtime]]
- [[Lexery - Branch Divergence]]
- [[Lexery - Current State]]
- [[Lexery - Decision Registry]]
- [[Lexery - Run Lifecycle]]
- [[Lexery - Retry and Recovery]]
- [[Lexery - Public Trace]]
- [[Lexery - Andrii Serediuk]]
- [[Lexery - Provider Topology]]
