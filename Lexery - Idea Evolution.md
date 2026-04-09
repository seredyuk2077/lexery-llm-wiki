---
aliases:
  - Idea Evolution
tags:
  - lexery
  - history
created: 2026-04-09
updated: 2026-04-09
status: inferred
layer: history
---

# Lexery - Idea Evolution

## Core Thesis

Lexery починалась не як “brain-first infra company”. Спочатку це був **consumer-friendly AI legal assistant**, але з часом центр ваги змістився до зовсім іншої задачі:

- не просто відповідати,
- а відповідати **підконтрольно, доказово, масштабовано і багатоетапно** в юридичному домені.

## Phase A — Ukrainian Lawyer / Mike Ross

### Product identity

- Назва:
  `Український Юрист - AI Правовий Консультант`
- Persona:
  `Mike Ross`
- Promise:
  швидкі legal пояснення, чат, історія, договірний генератор.

### Technical shape

- React 18
- TypeScript
- Tailwind
- Shadcn/ui
- Supabase
- Edge Function chat handler
- OpenAI GPT-4

### Strategic reading

- `Observed`:
  тут продукт мислиться як accessible legal AI app.
- `Inferred`:
  legal domain expertise ще подана радше як prompt discipline + curated law list, а не як full retrieval/runtime system.

## Phase B — law-data seriousness

### Shift

- З’являється `rada.gov.ua` integration.
- З’являються legal database management tasks.
- З’являється Supreme Court RAG direction.
- З’являється великий legislation stack.

### Meaning

- `Inferred`:
  команда/автор вперлась у реальну доменну проблему:
  простий chat UX не дає достатньої якості для legal use-case без серйозної data plane.

## Phase C — Lexery Legal AI Agent as separate brain

### Key conceptual leap

У bridge repo Lexery вже описується як:

- окремий `Brain service`
- control-plane-aware microservice
- tenant-aware
- plan-aware
- evidence-first
- bounded by staged runtime

### New objects appear

- `Gateway`
- `RunRecord`
- `SearchPlan`
- `QueryProfile`
- `EvidencePack`
- `RetrievalTrace`
- `ContextPack`
- `Memory Manager`
- `DocListDB`
- `LLDBI`

### Meaning

- `Observed`:
  це вже не UI app with AI.
- `Observed`:
  це system design for a legal cognition engine.
- `Inferred`:
  саме тут Lexery стає окремою product philosophy, а не лише ребрендингом старого beta app.

## Phase D — architecture becomes execution

### Linear translation

- Великі architecture docs дробляться на `LEX-31` through `LEX-59`.
- З’являється disciplined decomposition:
  concept, components, pipelines, failures, memory, billing, Azure, final docs.

### Meaning

- `Observed`:
  architectural thinking стає explicit roadmap.
- `Inferred`:
  це момент, коли проєкт переходить із “дуже глибоко продуманого” в “можна реально будувати”.

## Phase E — monorepo split: product shell vs legal brain

### New current shape

- `apps/brain`
- `apps/api`
- `apps/portal`
- `apps/lldbi`
- doclist services

### New tension

- `apps/brain` рухається до bounded legal agentivity.
- `origin/dev` рухається до auth/workspace/plans/frontend integration.

### Meaning

- `Observed`:
  сучасний Lexery already consists of two rhythms:
  runtime/brain rhythm and product/control-plane rhythm.
- `Inferred`:
  головний future challenge не придумати ще одну архітектуру, а **звести ці дві реальності назад в один продукт**.

## What Stayed Constant Through All Phases

- Ukrainian legal domain as the center.
- Desire for trustworthy rather than purely creative output.
- Strong role of official or structured legal sources.
- Product ambition bigger than “one chat screen”.

## What Changed The Most

- from persona-first to architecture-first
- from one-shot prompt answers to staged runtime
- from public beta UX to private monorepo productization
- from general “legal AI” to evidence / retrieval / multi-tenant / plan-aware legal system

## Best One-Sentence Synthesis

Lexery еволюціонувала з **AI-юриста для користувача** в **юридичний operating stack**, де frontend, control plane, corpus infra і bounded legal brain мають зрештою скластися в один SaaS.

## See Also

- [[Lexery - Timeline]]
- [[Lexery - Legacy Beta App]]
- [[Lexery - Legacy Architecture Bridge]]
- [[Lexery - Business Model]]
