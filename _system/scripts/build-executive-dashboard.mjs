#!/usr/bin/env node
/**
 * Executive ops dashboard from machine artifacts.
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_DIR = join(__dirname, '..');
const VAULT_DIR = join(SYSTEM_DIR, '..');

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function safeJson(path, fallback = null) {
  if (!existsSync(path)) return fallback;
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return fallback;
  }
}

function safeRead(path, fallback = '') {
  if (!existsSync(path)) return fallback;
  try {
    return readFileSync(path, 'utf8');
  } catch {
    return fallback;
  }
}

const date = todayIso();
const truth = safeJson(join(SYSTEM_DIR, 'state', 'truth-audit.json'), {});
const contradiction = safeJson(join(SYSTEM_DIR, 'state', 'contradiction-audit.json'), {});
const maintState = safeJson(join(SYSTEM_DIR, 'state', 'maintenance-state.json'), {});
const dashPath = join(VAULT_DIR, 'Lexery - Executive Ops Dashboard.md');
const autoSnapshot = safeRead(join(VAULT_DIR, 'Lexery - Auto Snapshot.md'));
const compact = date.replace(/-/g, '');
const maint = safeRead(join(SYSTEM_DIR, 'logs', `maintenance-${compact}.md`));

const prCountMatch = autoSnapshot.match(/all-prs\.json`:\s*\*\*([\d,]+)\*\*/i);
const commitCountMatch = autoSnapshot.match(/commits-recent\.txt`:\s*\*\*([\d,]+)\*\*/i);
const prCount = prCountMatch ? Number(prCountMatch[1].replace(/,/g, '')) : null;
const commitCount = commitCountMatch ? Number(commitCountMatch[1].replace(/,/g, '')) : null;

const trustScore = truth?.trustScore ?? 'n/a';
const fresh = truth?.summary?.freshnessIssues ?? 'n/a';
const consistency = truth?.summary?.consistencyIssues ?? 'n/a';
const provenance = truth?.summary?.provenanceIssues ?? 'n/a';
const suspicious = truth?.summary?.suspiciousClaims ?? 'n/a';
const contradictions = contradiction?.findingsCount ?? 'n/a';
const runMode = maintState?.last_mode || 'n/a';

const isHealthy =
  typeof trustScore === 'number' &&
  trustScore >= 90 &&
  Number(fresh) === 0 &&
  Number(consistency) === 0;

const healthLine = isHealthy
  ? '> [!success] System health — **GREEN**'
  : '> [!warning] System health — **ATTENTION REQUIRED**';

const out = `---
aliases:
  - Executive Ops Dashboard
tags:
  - lexery
  - meta
  - operations
created: ${date}
updated: ${date}
status: observed
layer: meta
---

> [!lexery-hero] Executive pulse
> ![[_assets/brand/lexery-wordmark-dark-bg.svg|240]]
>
> **Trust** ${trustScore}/100 · **Health** ${isHealthy ? 'GREEN' : 'ATTENTION'} · **Last run** ${runMode} · Автозбірка з truth / contradiction / maintenance state.

${healthLine}

> [!abstract] Trust & integrity
> - **Trust score:** ${trustScore}/100
> - **Freshness issues:** ${fresh}
> - **Consistency issues:** ${consistency}
> - **Provenance issues:** ${provenance}
> - **Suspicious claims:** ${suspicious}
> - **Contradiction candidates:** ${contradictions}
> - **Last run mode:** ${runMode}

> [!tip] Throughput (останній local raw)
> - **PRs tracked:** ${prCount ?? 'n/a'}
> - **Commits (window):** ${commitCount ?? 'n/a'}

> [!note] Runbook checks
> - Maintenance log today: **${maint ? 'present' : 'missing'}**
> - Truth audit state: **${truth && Object.keys(truth).length ? 'present' : 'missing'}**
> - Детальніше: [[Lexery - Data Integrity Dashboard]]

# Lexery - Executive Ops Dashboard

## What to do next

1. Якщо **consistency > 0** — вирівняй метрики (Auto Snapshot ↔ PR Chronology).
2. Якщо **freshness > 0** — онови high-impact сторінки (Current State, Index, Project Brain).
3. Якщо **suspicious** або **contradictions > 0** — truth-triage перед розширенням контенту.

## Quick links

| Зона | Посилання |
|------|-----------|
| Integrity | [[Lexery - Data Integrity Dashboard]] |
| Snapshot | [[Lexery - Auto Snapshot]] |
| Продукт | [[Lexery - Current State]] |
| Журнал | [[Lexery - Log]] |
| Граф | [[Lexery - Neural Link Hub]] |
| Ops rollup | [[Lexery - Ops Rollup]] |
| Сирі аудити | \`_system/logs/contradiction-audit-*.md\` |
`;

writeFileSync(dashPath, out);
console.log(`Executive dashboard written to ${dashPath}`);
