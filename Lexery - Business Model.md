---
aliases:
  - Business Model
tags:
  - lexery
  - product
created: 2026-04-09
updated: 2026-04-09
status: inferred
layer: product
---

# Lexery - Business Model

## Short Read

Lexery виглядає як **subscription SaaS для юридичної роботи**, але бізнес-модель у коді ще не повністю зібрана в один стабільний contract. Найсильніше це видно в drift між backend schema, frontend plan UX і відсутністю реального billing provider.

## Target User

### Observed

- Legacy architecture docs прямо називають цільовою аудиторією:
  професійні юристи, консультанти, правники.
- Legacy beta repo також орієнтований на українські legal questions and document generation.
- Поточний Brain shape дуже сильний для professional workflow:
  citations, retrieval, workspace, documents, memory, legal evidence.

### Inferred

- Primary ICP:
  individual lawyers and small legal teams.
- Secondary ICP:
  legal-heavy knowledge workers, compliance/legal ops, professional advisors.

## Revenue Logic Signals

### Observed in current monorepo

- `apps/api/prisma/schema.prisma` має `Subscription` model.
- Ключові поля:
  `planCode`, `status`, `agentEnabled`, `docsEnabled`.
- `AuthUser` interface already carries:
  `planCode`, `agentEnabled`, `docsEnabled`.
- `apps/api/src/auth/auth.service.ts` creates default tenant + workspace + subscription at onboarding.

### Observed in frontend mainline

- `origin/dev:apps/portal/src/lib/beta-plan.ts` already has product-facing plan taxonomy:
  `free`, `starter`, `mentor`, `pro`.
- UI semantics include different badge appearances and profile signaling.
- PR #10 on GitHub explicitly implemented subscription plans in frontend shell.

## Plan Taxonomy Drift

### Observed drift

- Backend schema comment still implies:
  `free`, `pro`, `enterprise`
- Frontend plan UI in `origin/dev` uses:
  `free`, `starter`, `mentor`, `pro`

### Meaning

- `Observed`:
  plan taxonomy is not unified yet.
- `Inferred`:
  monetization design evolved faster in frontend/product than in database contract.

## Feature Gating Model

### Strongly observed

- Feature gating is not only about seats or branding.
- Lexery thinks in **capability flags**:
  `agentEnabled`, `docsEnabled`
- Legacy architecture docs also talk in terms of:
  budgets, max cost per run, web/deep allowances, hard limits, routing policy.

### Inferred

- Ultimate paid differentiation likely includes:
  document intelligence, deeper retrieval, higher budget, more advanced workspace or history memory, possibly premium sources like case law.

## Missing Billing Layer

### Observed

- No Stripe integration found.
- No Paddle integration found.
- No LiqPay / Fondy / WayForPay integration found.
- No evident production billing ledger implementation across current monorepo product surface.

### Meaning

- `Observed`:
  plan UI and subscription schema exist before actual payments plumbing.
- `Inferred`:
  Lexery is still pre- or early-monetization in code terms.

## Product Strategy Reading

- `free`:
  onboarding/entry plan.
- `starter`:
  likely first real paid upgrade.
- `mentor`:
  interestingly non-standard name; suggests domain-shaped packaging rather than generic SaaS tiers.
- `pro`:
  more serious professional use.

## Best Synthesis

Lexery’s business model is already visible as:

- workspace-centric
- subscription-based
- feature-gated
- budget-aware
- oriented toward serious legal users

But it is **not yet fully normalized** across database, frontend, and billing plumbing.

## Key Evidence

- `apps/api/prisma/schema.prisma`
- `apps/api/src/auth/interfaces/auth-user.interface.ts`
- `apps/api/src/auth/auth.service.ts`
- `origin/dev:apps/portal/src/lib/beta-plan.ts`
- GitHub PR #10

## See Also

- [[Lexery - Product Surface]]
- [[Lexery - Current State]]
- [[Lexery - Open Questions and Drift]]
- [[Lexery - Olexandr]]
- [[Lexery - PR Chronology]]
- [[Lexery - Drift Radar]]
- [[Lexery - Unknowns Queue]]
- [[Lexery - Decision Registry]]
