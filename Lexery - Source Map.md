---
aliases:
  - Source Map
tags:
  - lexery
  - meta
created: 2026-04-09
updated: 2026-04-09
status: observed
layer: meta
---

# Lexery - Source Map

## Purpose

Ця сторінка фіксує, **звідки саме** зібрано Lexery wiki, і якою була ієрархія довіри між джерелами. Вона потрібна, щоб вся wiki лишалась compiled artifact, а не перетворювалась на “враження з чату”.

## Source Hierarchy

- `Tier 1: live code and runtime-facing artifacts`
  `__PATH_LEXERY_MONOREPO__/apps/*`, `package.json`, `prisma/schema.prisma`, `wrangler.toml`, `Dockerfile`, workflow files, tests, current git status.
- `Tier 2: repo-local docs close to code`
  `apps/brain/docs/**`, `docs/**`, `apps/portal/README.md`, `apps/lldbi/README.md`, `docs/adr/**`, rollout/runtime/testing docs.
- `Tier 3: git and branch evidence`
  local `git log`, `git rev-list`, `git status`, remote refs, PR history, contributor history.
- `Tier 4: GitHub state`
  `lexeryAI/Lexery`, `seredyuk2077/Ukrainan-Lawyer-LLM-BETA`, repo metadata, PRs, contributors, branches.
- `Tier 5: Linear planning layer`
  `LEX-*` issues, projects `Agent Architecture`, `Lexery Legal Agent Dev`, `Backend`, `Frontend`.
- `Tier 6: local checkpoint / prior synthesis`
  `__PATH_LEXERY_MONOREPO__/codex/SESSION_019d457b-3011-7a53-95ac-f6cb2afd3eb3_CHECKPOINT.md`

## Repositories Included

### Current private monorepo

- Path: `__PATH_LEXERY_MONOREPO__`
- GitHub: `lexeryAI/Lexery`
- Observed role:
  current product monorepo with `apps/brain`, `apps/api`, `apps/portal`, `apps/lldbi`, DocList services.
- Key truth pages:
  `[[Lexery - Current State]]`, `[[Lexery - Product Surface]]`, `[[Lexery - Brain Architecture]]`

### Legacy public beta repo

- Path: `__PATH_UA_LLM_BETA__`
- GitHub: `seredyuk2077/Ukrainan-Lawyer-LLM-BETA`
- Observed role:
  earliest public product incarnation, centered on chat UX, Supabase, GPT-4, Mike Ross persona.
- Key truth pages:
  `[[Lexery - Legacy Beta App]]`, `[[Lexery - Idea Evolution]]`

### Legacy bridge repo

- Path: `__PATH_UA_LLM_BETA_BRIDGE__`
- Git branch:
  `feature/lexery-legal-agent-architecture`
- Observed role:
  “missing middle” між consumer beta app і сучасним Lexery Brain; тут одночасно співіснують `scripts/lexery-legal-agent`, legislation infra, new frontend experiments, великі architecture docs і Linear-aligned execution notes.
- Key truth pages:
  `[[Lexery - Legacy Architecture Bridge]]`, `[[Lexery - Retrieval, LLDBI, DocList]]`, `[[Lexery - Linear Roadmap]]`

### Earlier private placeholder repo

- GitHub only:
  `seredyuk2077/Ukrainan-Lawyer-LLM`
- Observed role:
  дуже ранній приватний репозиторій, створений `2025-09-26`, без локального clone у цій машині.
- Confidence:
  low-detail metadata only.

## Key Document Clusters

### Current Lexery docs

- `apps/brain/docs/architecture/app/context/CURRENT_PIPELINE_STATE.md`
- `apps/brain/docs/architecture/app/orchestrator/README.md`
- `docs/lexery-current-runtime-map.md`
- `docs/lexery-agentivity-upgrade.md`
- `docs/lexery-target-orchestrator-architecture.md`
- `docs/lexery-testing-guide.md`
- `docs/lexery-doclist-corpus-gap-recovery.md`

### Legacy architecture docs

- `docs/plan_archinecture_Agnet/plan.md`
- `docs/plan_archinecture_Agnet/answer.md`
- `docs/plan_archinecture_Agnet/PLAN_vs_LINEAR_GAPS.md`
- `docs/architecture/LEXERY_LEGAL_AI_AGENT_ARCHITECTURE.md`
- `docs/architecture/MEGA_DIAGRAM_FULL.md`

### Legacy legislation / retrieval docs

- `scripts/legislation/README.md`
- `scripts/legislation/COMPLETION.md`
- `docs/supreme_court_rag.md`
- `docs/supreme_court_benchmark.md`
- `docs/legislation-rag/**`

## Trust Markers Used Across The Wiki

- `Observed`:
  directly confirmed by code, git, GitHub, Linear, or a concrete repo document.
- `Inferred`:
  synthesis from two or more observed facts.
- `Planned`:
  exists in architecture docs / roadmap / issue descriptions, but not fully confirmed in current live code.
- `Drift`:
  two or more artifacts disagree.

## Known Limits

- Current wiki is strongest on:
  `apps/brain`, legacy architecture bridge, GitHub/Linear evolution, product/control-plane direction.
- Current wiki is weaker on:
  actual production infra secrets, live cloud deployment state, real revenue/customers, anything not persisted in repo/GitHub/Linear.
- A few docs are explicitly stale:
  root `README.md` in current monorepo, some `apps/portal` docs, some Azure assumptions.

## See Also

- [[Lexery - Repo Constellation]]
- [[Lexery - Timeline]]
- [[Lexery - Open Questions and Drift]]
