---
aliases:
  - Unknowns Queue
  - Unknowns
  - Open Questions Queue
tags:
  - lexery
  - meta
created: 2026-04-09
updated: 2026-04-09
status: inferred
layer: governance
---

# Lexery - Unknowns Queue

**Known unknowns**: questions that block confident planning until someone pulls ground truth (dashboards, runbooks, stakeholders). Status here is **`inferred`** from repo + wiki ingest — not audited financial or customer data.

Pair with [[Lexery - Drift Radar]] (contradictions we can already see) and [[Lexery - Open Questions and Drift]] (long-form discussion).

## Queue (investigation backlog)

### 1. Production deploy process

- **Question**: What is the **authoritative** production deploy path (who triggers, from which branch, with which checks)?
- **Why it matters**: ORCH rollouts, hotfixes, and trace fixes all need the same answer.
- **Clues in wiki**: CI visible for **portal** and **LLDBI brain-admin**; full Brain deploy story is unclear.

**After answer, update**: [[Lexery - Deployment and Infra]], [[Lexery - API and Control Plane]].

### 2. Customer / user base size

- **Question**: How many **active** users, seats, or orgs — and over what window?
- **Why it matters**: Roadmap weighting (MM vs retrieval vs portal) and support staffing.

**After answer, update**: [[Lexery - Business Model]], [[Lexery - Current State]].

### 3. Monthly AI spend (aggregate)

- **Question**: What is **actual** monthly LLM + embedding + reranker cost across environments?
- **Why it matters**: Unit economics and whether "cheap path" work is ROI-positive.
- **Clues**: Token usage appears in some reports; no single **aggregate** ledger in-repo.

**After answer, update**: [[Lexery - Cost Ledger]], [[Lexery - Provider Topology]] (if split by vendor).

### 4. Staging environment

- **Question**: Is there a **staging** Brain + Portal + LLDBI slice distinct from prod?
- **Why it matters**: Safe ORCH shadowing and verifier changes before customer traffic.

**After answer, update**: [[Lexery - Deployment and Infra]].

### 5. Import proposal → actual import

- **Question**: When an **import_proposal** is approved, what systems run, who approves, and where is **idempotency** enforced end-to-end?
- **Why it matters**: Prevents "proposal theater" without corpus movement.

**After answer, update**: [[Lexery - Import Proposal Loop]], [[Lexery - LLDBI Surface]].

### 6. `seredyuk2077/Ukrainan-Lawyer-LLM` vs public beta

- **Question**: Is the **private** repo the same lineage as **public beta**, a fork, or abandoned parallel tree?
- **Why it matters**: IP boundaries, licensing, and what can be open-sourced later.

**After answer, update**: [[Lexery - Repo Constellation]], [[Lexery - Legacy Beta App]].

### 7. Paying customers / revenue

- **Question**: Are there **paying** customers today? If yes, pricing motion and churn?
- **Why it matters**: Separates "beta traction" from "business validation."

**After answer, update**: [[Lexery - Business Model]], [[Lexery - Team and Operating Model]].

### 8. Supreme Court case-law RAG integration status

- **Question**: What is **live** in prod vs branch-only for case-law RAG?
- **Why it matters**: Product promises vs retrieval reality.

**After answer, update**: [[Lexery - Branch Supreme Court Case Law RAG]], [[Lexery - Corpus Evolution]].

### 9. Memory pipeline production readiness

- **Question**: Is **LEX-160** class recall issue **resolved in prod** or only in dev experiments?
- **Why it matters**: MM is user-visible; failures look like "the AI forgot."

**After answer, update**: [[Lexery - Memory and Documents]], [[Lexery - Linear Roadmap]].

### 10. Team communication stack

- **Question**: Beyond **Linear**, what are **Slack / Telegram / email** norms and escalation paths?
- **Why it matters**: Incident response and external partner coordination.

**After answer, update**: [[Lexery - Team and Operating Model]].

## Working the queue

| Step | Action |
|------|--------|
| **Triage** | Tag each unknown with **owner** and **evidence type** (dashboard URL, runbook path, stakeholder). |
| **Resolve** | Move finding into a **canonical wiki page**; strikethrough or archive the row here. |
| **Re-open** | If infra changes, link from [[Lexery - Log]] so history is traceable. |

## Links

- [[Lexery - Open Questions and Drift]]
- [[Lexery - Drift Radar]]
- [[Lexery - Business Model]]
- [[Lexery - Deployment and Infra]]
- [[Lexery - Memory and Documents]]
- [[Lexery - Source Registry]] — add any new authoritative systems when discovered.

## See Also

- [[Lexery - Decision Registry]]
- [[Lexery - Source Map]]
- [[Lexery - Automation Architecture]]
- [[Lexery - Glossary]]
