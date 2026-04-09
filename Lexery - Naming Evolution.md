---
aliases:
  - Naming Evolution
  - Naming
  - Brand History
tags:
  - lexery
  - history
created: 2026-04-09
updated: 2026-04-09
status: inferred
layer: history
---

# Naming evolution

Full **product and brand arc** from the earliest public beta through today’s **Lexery** identity. This note complements [[Lexery - Idea Evolution]] (what we built) and [[Lexery - Timeline]] (when), but focuses strictly on **names** as they appeared in repos, READMEs, and React components.

## Stages (chronological)

### Mike Ross

- **Earliest product identity**, named after the *Suits* character.
- Visible in the **public beta** repo README and early positioning.
- Technical and product context: [[Lexery - Legacy Beta App]].

### Український Юрист / Ukrainian Lawyer

- **Public-facing product name** during much of the beta period (repo title / marketing language).
- Bilingual label reflects **UA market** focus; same codebase family as Mike Ross era, rebranded for clarity and locale.

### Lexora

- **Intermediate identity** before Lexery stabilized.
- **Evidence:** `LexoraLogo.tsx` under the bridge repo’s `new-frontend/src/components/branding/` (see [[Lexery - Legacy Architecture Bridge]]).
- Sits between beta naming and the final Lexery component set.

### Lexery

- **Current canonical identity** for the product and engineering org.
- **Evidence:** `LexeryLogo.tsx` in the same branding folder; `Sidebar.tsx` and `LoadingScreen.tsx` import **`LexeryLogo`** — runtime UI is unambiguously Lexery-branded.

### Lexery AI

- **Workspace / product line phrasing** visible in the bridge repo’s **new-frontend layout** (headers, shell copy, or meta — check git history for exact strings).
- Use when distinguishing **the AI product** from the company name “Lexery” in prose.

## Approximate timeline

| Period | Dominant name |
| --- | --- |
| ~early 2025 | Mike Ross |
| ~mid 2025 | Ukrainian Lawyer (public) |
| ~late 2025 | Lexora (components / bridge) |
| ~2026 | Lexery / Lexery AI (current) |

Cross-check dates against [[Lexery - Timeline]] and [[Lexery - GitHub History]]; this table is **observed-order**, not audited to the day.

## How we know (evidence types)

1. **Git history** — renames, README edits, and import path changes.
2. **File names** — `LexoraLogo.tsx` vs `LexeryLogo.tsx` side by side in branding.
3. **Component imports** — which logo component the shell actually loads.
4. **README and package metadata** — repo titles and descriptions during beta.

## Relations to other layers

- **Bridge repo** — carries both Lexora and Lexery artifacts; see [[Lexery - Legacy Architecture Bridge]].
- **Frontend narrative** — UI consolidation and design iterations: [[Lexery - Frontend and Brand Evolution]].
- **People** — who drove the bridge and pipeline: [[Lexery - Andrii Serediuk]].

## Related notes

- [[Lexery - Idea Evolution]]
- [[Lexery - Legacy Beta App]]
- [[Lexery - Legacy Architecture Bridge]]
- [[Lexery - Frontend and Brand Evolution]]
- [[Lexery - Timeline]]
- [[Lexery - Andrii Serediuk]]
- [[Lexery - Corpus Evolution]] — naming of *data* products (LLDBI, legislation) vs *consumer* brand

## Українською (коротко)

**Дуга назв:** Mike Ross → **Український Юрист** → Lexora → **Lexery / Lexery AI**. Докази — README, назви компонентів (`LexoraLogo` / `LexeryLogo`), імпорти в `Sidebar` / `LoadingScreen`, історія git у [[Lexery - Legacy Architecture Bridge|bridge-репо]].
