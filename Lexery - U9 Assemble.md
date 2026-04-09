---
aliases:
  - U9 Assemble
tags:
  - lexery
  - brain
  - runtime
created: 2026-04-09
updated: 2026-04-09
status: observed
layer: brain
---

# Lexery - U9 Assemble

## Runtime Role

U9 assembles the bounded prompt context for the legal writer.

## Current Code Surfaces

- `apps/brain/assemble/*`

## Documented Surface

U9 docs explicitly cover:

- inputs and outputs
- evidence channels
- canonical snippet loading
- budget and truncation
- provenance
- durable persistence
- observability
- config
- verification
- April 9 runtime notes

## Why It Matters

U9 is the place where Lexery compresses:

- law
- [[Lexery - Memory and Documents|memory]]
- docs
- history

into something the writer can use without losing provenance.

## Current Runtime Themes

- tail-latency reduction in meta-triage
- skipping unnecessary MM Docs probes on obvious law-only turns

## Best Reading

- `Observed`:
  U9 is one of the main cost/quality choke points.
- `Inferred`:
  if context engineering is Lexery’s hidden craft, U9 is where that craft becomes concrete.

## See Also

- [[Lexery - U8 Legal Reasoning]]
- [[Lexery - U10 Writer]]
- [[Lexery - Memory and Documents]]
- [[Lexery - Provider Topology]]
- [[Lexery - Run Lifecycle]]
