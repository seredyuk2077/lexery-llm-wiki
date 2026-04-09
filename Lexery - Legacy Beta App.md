---
aliases:
  - Legacy Beta App
tags:
  - lexery
  - history
created: 2026-04-09
updated: 2026-04-09
status: observed
layer: history
---

# Lexery - Legacy Beta App

## Identity

This is the earliest clear product identity found on the machine:

- Repo:
  `__PATH_UA_LLM_BETA__`
- Public GitHub repo:
  `seredyuk2077/Ukrainan-Lawyer-LLM-BETA`
- Product name:
  `Український Юрист - AI Правовий Консультант`

## Product Shape

### Advertised features

- AI consultant `Mike Ross`
- interactive chat
- knowledge base
- contract generator
- chat history
- security

### Stack

- React 18
- TypeScript
- Tailwind
- Shadcn/ui
- Framer Motion
- Zustand
- Supabase
- Edge Functions
- OpenAI GPT-4

## Architectural Simplicity

- frontend in `src/`
- auth/data in Supabase
- chat handling in a Supabase Edge Function
- chat_sessions and chat_messages tables

## Important Historical Insight

- `Observed`:
  this app already cared about legal specificity, source references, and user trust.
- `Observed`:
  it is still structurally much closer to a polished app prototype than to the later Lexery Brain system.

## Mike Ross Function

### Observed in code

- Supabase function `app_78e3d871a2_chat` handles chat.
- It sets a legal assistant system prompt:
  Ukrainian only, cite laws, include official links, stay within competence.

### Historical meaning

- The legal style rules that later become runtime contracts already existed here in primitive form.

## Historical Debt Marker

- `Observed`:
  the legacy Edge Function contains a hardcoded OpenAI API key in source.
- Meaning:
  this repo should be treated as historical evidence, not an operationally safe foundation.

## Why This Repo Still Matters

- It captures the first user-facing promise.
- It shows the early UX DNA of the project.
- It proves Lexery did not start as an infra-only system.

## Best Synthesis

This repo is the **consumer embryo** of Lexery:
friendly, direct, product-shaped, legally themed, but not yet architecturally hardened.

## See Also

- [[Lexery - Idea Evolution]]
- [[Lexery - Timeline]]
- [[Lexery - Legacy Architecture Bridge]]
- [[Lexery - Naming Evolution]]
- [[Lexery - Andrii Serediuk]]
- [[Lexery - DocList Surface]]
