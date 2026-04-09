---
aliases:
  - U1 Gateway
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

# Lexery - U1 Gateway

## Runtime Role

U1 is the intake boundary of Brain:

- receives [[Lexery - Run Lifecycle|runs]]
- checks auth/dev-auth mode
- handles limits and dry-run behavior
- stores attachments and creates run records

## Current Code Surfaces

- `apps/brain/gateway/auth.ts`
- `apps/brain/gateway/handler.ts`
- `apps/brain/gateway/attachments.ts`
- `apps/brain/gateway/storage.ts`
- `apps/brain/gateway/queue*.ts`

## Documented Surface

- `POST /v1/runs`
- `GET /health`
- docs mention:
  code, documentation links, intake implementation

## Important Observed Truths

- attachments overflow to R2 under run-scoped prefixes
- dev auth / anonymous modes still exist in Brain
- dry-run is part of the expected contract
- run state expansion remains additive in snapshot rather than DB-column heavy

## Historical Lineage

- Legacy bridge repo had explicit `U1 Gateway/Intake + R2 bucket migration`
- Linear also treated U1 and its dry-run harness as first-class implementation tasks

## Key Risk

As product integration matures, U1 will need to stop being mostly dev-friendly intake and become a stricter bridge from `apps/api` [[Lexery - API and Control Plane|control plane]].

## See Also

- [[Lexery - API and Control Plane]]
- [[Lexery - U2 Query Profiling]]
- [[Lexery - Brain Architecture]]
- [[Lexery - Run Lifecycle]]
- [[Lexery - Public Trace]]
