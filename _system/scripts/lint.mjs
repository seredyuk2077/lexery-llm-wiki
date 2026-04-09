#!/usr/bin/env node
/**
 * Wiki lint — health check for the Lexery Second Brain.
 * Checks: orphan pages, broken wikilinks, thin pages, stale data, missing frontmatter.
 */
import { readFileSync, readdirSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const VAULT = join(__dirname, '..', '..');
const LOGS_DIR = join(__dirname, '..', 'logs');

if (!existsSync(LOGS_DIR)) mkdirSync(LOGS_DIR, { recursive: true });

function todayCompact() {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
}

// Collect all wiki pages
const allFiles = readdirSync(VAULT).filter(f => f.startsWith('Lexery - ') && f.endsWith('.md'));
const allTitles = new Set(allFiles.map(f => f.replace('.md', '')));

const issues = [];
const pageData = [];

for (const file of allFiles) {
  const content = readFileSync(join(VAULT, file), 'utf8');
  const title = file.replace('.md', '');
  const lines = content.split('\n');
  
  // Parse frontmatter
  let hasFrontmatter = false;
  let fmEnd = -1;
  let updated = null;
  let status = null;
  let layer = null;
  if (lines[0] === '---') {
    hasFrontmatter = true;
    for (let i = 1; i < lines.length; i++) {
      if (lines[i] === '---') { fmEnd = i; break; }
      const m = lines[i].match(/^(\w+):\s*(.+)/);
      if (m) {
        if (m[1] === 'updated') updated = m[2].trim();
        if (m[1] === 'status') status = m[2].trim();
        if (m[1] === 'layer') layer = m[2].trim();
      }
    }
  }
  
  if (!hasFrontmatter) {
    issues.push({ file, severity: 'error', issue: 'Missing frontmatter' });
  } else {
    if (!status) issues.push({ file, severity: 'warn', issue: 'Missing `status` in frontmatter' });
    if (!layer) issues.push({ file, severity: 'warn', issue: 'Missing `layer` in frontmatter' });
    if (!updated) issues.push({ file, severity: 'warn', issue: 'Missing `updated` in frontmatter' });
  }
  
  // Count content lines (excluding frontmatter, headings, blank lines, See Also section)
  let contentLines = 0;
  let inSeeAlso = false;
  for (let i = fmEnd + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (/^##\s+See Also/i.test(line)) { inSeeAlso = true; continue; }
    if (inSeeAlso) continue;
    if (!line) continue;
    if (/^#{1,6}\s/.test(line)) continue;
    contentLines++;
  }
  
  if (contentLines < 20) {
    issues.push({ file, severity: 'warn', issue: `Thin page: only ${contentLines} content lines` });
  }
  
  // Find all outgoing wikilinks
  const linkPattern = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g;
  const outgoing = new Set();
  let match;
  while ((match = linkPattern.exec(content)) !== null) {
    let target = match[1].trim().replace(/\\$/, '');
    if (target.startsWith('_') || target.startsWith('#') || target.includes('/') || target.endsWith('.png') || target.endsWith('.canvas')) continue;
    if (/^[a-z]+$/.test(target) && target.length < 15) continue;
    outgoing.add(target);
  }
  
  // Check for broken links
  for (const target of outgoing) {
    if (!allTitles.has(target)) {
      issues.push({ file, severity: 'error', issue: `Broken wikilink: [[${target}]]` });
    }
  }
  
  pageData.push({ title, file, contentLines, outgoing, updated });
}

// Check for orphan pages (no inbound links except from Index and Project Brain)
const inboundCount = new Map();
for (const t of allTitles) inboundCount.set(t, 0);
for (const p of pageData) {
  for (const target of p.outgoing) {
    if (allTitles.has(target)) {
      inboundCount.set(target, (inboundCount.get(target) || 0) + 1);
    }
  }
}
for (const [title, count] of inboundCount) {
  if (count === 0 && title !== 'Lexery - Index' && title !== 'Lexery - Project Brain' && title !== 'Lexery - Log') {
    issues.push({ file: title + '.md', severity: 'warn', issue: `Orphan page: 0 inbound wikilinks` });
  }
}

// Check stale pages (updated > 30 days ago)
const now = new Date();
for (const p of pageData) {
  if (p.updated) {
    const d = new Date(p.updated);
    const days = Math.floor((now - d) / 86400000);
    if (days > 30) {
      issues.push({ file: p.file, severity: 'info', issue: `Stale: last updated ${days} days ago` });
    }
  }
}

// Sort by severity
const severityOrder = { error: 0, warn: 1, info: 2 };
issues.sort((a, b) => (severityOrder[a.severity] || 9) - (severityOrder[b.severity] || 9));

// Write report
const compact = todayCompact();
const outPath = join(LOGS_DIR, `lint-report-${compact}.md`);
const date = new Date().toISOString().slice(0, 10);

let md = `# Wiki Lint Report — ${date}\n\n`;
md += `| Metric | Value |\n|--------|-------|\n`;
md += `| Pages | ${allFiles.length} |\n`;
md += `| Issues | ${issues.length} |\n`;
md += `| Errors | ${issues.filter(i => i.severity === 'error').length} |\n`;
md += `| Warnings | ${issues.filter(i => i.severity === 'warn').length} |\n`;
md += `| Info | ${issues.filter(i => i.severity === 'info').length} |\n\n`;

if (issues.length === 0) {
  md += '_No issues found. Wiki is healthy!_\n';
} else {
  md += `## Issues\n\n`;
  for (const i of issues) {
    const icon = i.severity === 'error' ? '🔴' : i.severity === 'warn' ? '🟡' : '🔵';
    md += `- ${icon} **${i.file.replace('.md','')}** — ${i.issue}\n`;
  }
}

writeFileSync(outPath, md);
console.log(`Lint report: ${outPath}`);
console.log(`  ${issues.filter(i=>i.severity==='error').length} errors, ${issues.filter(i=>i.severity==='warn').length} warnings, ${issues.filter(i=>i.severity==='info').length} info`);
