---
aliases:
  - Frontend and Brand Evolution
tags:
  - lexery
  - history
created: 2026-04-09
updated: 2026-04-09
status: inferred
layer: history
---

# Lexery - Frontend and Brand Evolution

## Why This Page Exists

Frontend evolution in Lexery is not just polish. It records a real conceptual shift:

- from `Ukrainian Lawyer / Mike Ross`
- to `LEXERY AI workspace`

## Stage 1 — Consumer legal assistant UI

### Observed in old beta repo

- interactive legal chat
- chat history
- contract generation
- simple React app shape

### Identity

- brand centered on helpful legal assistant persona
- less on workspace/system metaphor

## Stage 2 — branded `new-frontend`

### Observed in bridge repo

- separate app folder:
  `new-frontend`
- branded logo assets:
  `LEXERY` logos in `Data/` and `public/lexery/`
- dedicated theme tokens:
  `--primary`, `--accent`, `--bg-workspace`, etc.
- workspace shell:
  sidebar, topbar, history, settings, docs, cases

### Strong product signals

- Loading screen copy:
  `Ініціалізація LEXERY AI workspace`
- highlight cards:
  `Аналіз НПА`, `Судова практика`, `Документи`
- footer:
  `© 2025 LEXERY AI · Legal Workspace`
- logo fallback text:
  `LEXERY AI` + `Legal Intelligence Workspace`

### Meaning

- `Observed`:
  by this stage Lexery is no longer framed as a one-screen assistant.
- `Observed`:
  it is framed as a professional legal workspace.

## Naming Curiosity — `LexoraLogo`

### Observed

- `new-frontend` contains both `LexeryLogo.tsx` and `LexoraLogo.tsx`.
- `LexoraLogo` still renders `LEXERY AI` assets/text.

### Inferred

- likely evidence of an intermediate naming experiment or rename-in-progress.

## Stage 3 — current portal

### Observed in current monorepo

- `apps/portal` is the real current frontend shell.
- includes workspace layout, chat, attachments, settings, sidebar, overlays, server chat routes.
- `origin/dev` adds auth flows, profile info, plan badges, plan-aware UI.

### Canonical brand assets (current)

- **Wordmark:** `apps/portal/public/lexery-logo.svg`
- **App / favicon-style mark:** `apps/portal/public/lexery-icon.svg`
- **Obsidian wiki mirror (embeds):** `_assets/brand/lexery-logo.svg`, `_assets/brand/lexery-icon.svg`

Historical raster exports (`logo-brand.png`, `logo-white.png`, etc.) are **not** the live identity and have been removed from `_assets/brand/`; keep only the SVG pair above and re-copy from `apps/portal/public/` when the product team updates the mark.

## Frontend Refactor vs Feature Track

### Observed in Linear context packet

As of `2026-03-15`, frontend was moving in two tracks:

- architecture/refactor track led by Yehor
- feature/UI track led by [[Lexery - Olexandr|Olexandr]]

### Meaning

- `Observed`:
  frontend evolution is not only about adding screens.
- `Observed`:
  there was a deliberate push to make `main` the trustworthy pattern source for future AI-assisted coding.
- `Inferred`:
  frontend architecture was treated as an operational control problem, not just aesthetic cleanup.

## Best Synthesis

Frontend/brand evolution mirrors the product’s conceptual evolution:

- helper persona
- legal tool
- legal workspace
- multi-user plan-aware product shell

## See Also

- [[Lexery - Product Surface]]
- [[Lexery - Business Model]]
- [[Lexery - Legacy Beta App]]
- [[Lexery - Legacy Branch Families]]
