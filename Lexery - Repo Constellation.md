---
aliases:
  - Repo Constellation
tags:
  - lexery
  - meta
created: 2026-04-09
updated: 2026-04-09
status: observed
layer: meta
---

# Lexery - Repo Constellation

## Why This Page Exists

Lexery не живе в одному репозиторії. Щоб зрозуміти проект, треба бачити **сузір’я репо і локальних копій**, бо саме між ними захована еволюція ідеї.

## Repository Graph

### 1. `lexeryAI/Lexery`

- Local path:
  `your local Lexery monorepo root`
- Visibility:
  private
- GitHub created:
  `2026-03-13`
- Default branch:
  `dev`
- Observed role:
  current main monorepo.
- Major surfaces:
  `apps/brain`, `apps/api`, `apps/portal`, `apps/lldbi`, `apps/doclist-*`

### 2. `seredyuk2077/Ukrainan-Lawyer-LLM-BETA`

- Local path:
  `your local Ukrainan-Lawyer-LLM-BETA clone (historical)`
- Visibility:
  public
- GitHub created:
  `2025-09-26`
- Default branch:
  `main`
- Local status:
  clean except `.DS_Store`
- Approx size:
  `130` files, `102` commits in full history.
- Observed role:
  public beta / original product shell.

### 3. `New project/Ukrainan-Lawyer-LLM-BETA`

- Local path:
  `your local bridge clone (historical)`
- Branch:
  `feature/lexery-legal-agent-architecture`
- Local status:
  behind remote by `2`, plus untracked design/runtime artifacts.
- Approx size:
  `659` files, `79` commits in full history.
- Observed role:
  bridge repo where architecture, legislation infra, new frontend, and `scripts/lexery-legal-agent` coexist.

### 4. `seredyuk2077/Ukrainan-Lawyer-LLM`

- No local clone found on this machine.
- GitHub metadata only:
  private repo, created `2025-09-26`, updated same day.
- Observed role:
  likely very early precursor or naming stub.

## How To Read The Constellation

- `Current monorepo` answers:
  what is currently being built.
- `Public beta repo` answers:
  how the product initially presented itself.
- `Bridge repo` answers:
  how the system idea transformed into Brain/LLDBI/DocList architecture.

## Current Monorepo Surfaces

### Product / control plane

- `apps/api`
- `apps/portal`

### Legal brain

- `apps/brain`

### Corpus / admin / infra

- `apps/lldbi`
- `apps/doclist-resolver-api`
- `apps/doclist-full-import`
- `apps/doclist-updater-db`

## Legacy Bridge Repo Surfaces

- `scripts/lexery-legal-agent`
- `scripts/legislation`
- `docs/plan_archinecture_Agnet`
- `docs/architecture`
- `new-frontend`
- `supabase/migrations`
- `runs/evidence`

## Main Inference

- `Observed`:
  Lexery’s deepest product history is not fully represented inside the current monorepo alone.
- `Inferred`:
  the bridge repo is the highest-value historical companion to the current repo.
- `Inferred`:
  if someone only reads the current monorepo, they miss a large part of why the system is shaped the way it is.

## See Also

- [[Lexery - Source Map]]
- [[Lexery - Legacy Beta App]]
- [[Lexery - Legacy Architecture Bridge]]
- [[Lexery - Branch Divergence]]
