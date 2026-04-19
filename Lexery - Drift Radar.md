---
aliases:
  - Drift Radar
  - Drift
  - Active Contradictions
tags:
  - lexery
  - meta
created: 2026-04-09
updated: 2026-04-09
status: observed
layer: governance
---

> [!info] Compiled from
> - Automated wiki maintenance + repository sources
> - See [[Lexery - Source Map]] for trust model

# Lexery - Drift Radar

**Drift** means: documented intent, tooling, or org rhythm no longer matches observable reality. This page lists **active contradictions** so they are not silently normalized into "probably fine."

Companion pages: [[Lexery - Open Questions and Drift]] (narrative), [[Lexery - Unknowns Queue]] (investigation backlog), [[Lexery - Current State]] (snapshot).

## Severity legend

- **P0** — blocks correct operation, security, or revenue truth.
- **P1** — degrades predictability of delivery or observability.
- **P2** — process or naming debt that compounds if ignored.

## Active items

### 1. Branch divergence — **P1**

- `legal-agent-brain-dev` is **12 commits ahead** of `origin/legal-agent-brain-dev`, with significant **unstaged** local change.
- `origin/dev` carries **frontend / auth / plan** work not present on the brain-focused line.
- **Risk**: duplicated fixes, skewed code review assumptions, and "works on my machine" integration gaps.

**Navigate**: [[Lexery - Branch Divergence]], [[Lexery - Repo Constellation]], [[Lexery - GitHub History]].

### 2. Stabilization milestone overdue — **P1**

- **LEX-139** stabilization cycle was due **2026-03-08**; reported progress ~**25%**.
- Many sub-issues look **addressed in code** but remain **open in Linear** — classic execution–tracking drift.

**Navigate**: [[Lexery - Linear Roadmap]], [[Lexery - PR Chronology]].

### 3. Sprint cadence lost — **P2**

- No **active cycles** since **Feb 2026**; work continues ad hoc without time-boxing.
- **Risk**: priority inflation (everything "urgent") and weak forecasting for partner or customer comms.

**Navigate**: [[Lexery - Team and Operating Model]].

### 4. ORCH not in production — **P1**

- `ORCH_ENABLED=true` appears **dev-only** in current understanding.
- Needs **production-shadow** or canary traffic before trusting branch decisions under real load.

**Navigate**: [[Lexery - ORCH and Clarification]], [[Lexery - Decision Registry]], [[Lexery - Deployment and Infra]].

### 5. `codex/legal-rag-foundation` branch — **P2**

- Referenced in wiki lineage; **not found** in some local clones — may be deleted remotely or never fetched.
- **Action**: confirm on GitHub remote and either **archive the reference** or **document the replacement branch**.

**Navigate**: [[Lexery - Branch codex legal-rag-foundation]], [[Lexery - Legacy Branch Families]].

### 6. LLDBI `nreg` case sensitivity — **P2**

- Manual inspection confusion between **`ВР`** vs **`вр`** (and similar) breaks mental models even when code paths are strict.
- **Risk**: false "missing act" conclusions during ops and content QA.

**Navigate**: [[Lexery - LLDBI Surface]], [[Lexery - Glossary]].

### 7. Public trace incompleteness — **P1**

- Not all stages emit matched **`stage_started` / `stage_completed`** pairs.
- **Risk**: customer-facing run timelines and internal postmortems show **false gaps** or **false confidence**.

**Navigate**: [[Lexery - Public Trace]], [[Lexery - Contracts and Run Schema]].

### 8. Document Memory unassigned — **P1**

- **LEX-163** … **LEX-170** (eight issues): **high priority**, **no owner**.
- **Risk**: MM/Docs path stays fragile while product promises attach to "memory."

**Navigate**: [[Lexery - Memory and Documents]], [[Lexery - Linear Roadmap]].

### 9. Priority inflation — **P2**

- ~**61%** of Linear issues marked **Urgent/High** — when everything is urgent, triage signals collapse.

**Navigate**: [[Lexery - Team and Operating Model]], [[Lexery - Linear Roadmap]].

### 10. No release / deploy tagging — **P1**

- No visible **GitHub Releases**, no crisp **production branch** story, no **deploy versioning** in one place.
- **Risk**: incident response and customer support cannot answer "what shipped when."

**Navigate**: [[Lexery - Deployment and Infra]], [[Lexery - API and Control Plane]].

## How this page stays honest

1. Each item should eventually resolve into either a **closed Linear issue**, a **doc update**, or a move to [[Lexery - Unknowns Queue]] if it was a false alarm.
2. Weekly automation (see [[Lexery - Maintenance Runbook]]) should append **new** contradictions rather than duplicating narrative from [[Lexery - Open Questions and Drift]].

## Links

- [[Lexery - Open Questions and Drift]]
- [[Lexery - Branch Divergence]]
- [[Lexery - Linear Roadmap]]
- [[Lexery - Current State]]
- [[Lexery - ORCH and Clarification]]
- [[Lexery - Index]]

## See Also

- [[Lexery - Yehor Puhach]]
- [[Lexery - Olexandr]]
- [[Lexery - Brain Architecture]]
