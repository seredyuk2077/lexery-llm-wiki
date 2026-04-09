#!/usr/bin/env node
/**
 * Ingest raw sources into the wiki.
 * Reads new files from raw/, marks them as processed, logs to Log.md.
 * For now: generates a summary and adds to Log. Full AI integration later.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const VAULT = join(__dirname, '..', '..');
const RAW_DIR = join(VAULT, 'raw');
const STATE_DIR = join(__dirname, '..', 'state');
const INGESTED_FILE = join(STATE_DIR, 'ingested.json');
const LOG_FILE = join(VAULT, 'Lexery - Log.md');

if (!existsSync(STATE_DIR)) mkdirSync(STATE_DIR, { recursive: true });

const ingested = existsSync(INGESTED_FILE) ? JSON.parse(readFileSync(INGESTED_FILE, 'utf8')) : { files: {} };

function walkDir(dir) {
  const results = [];
  if (!existsSync(dir)) return results;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walkDir(full));
    else if (entry.name.endsWith('.md') || entry.name.endsWith('.json') || entry.name.endsWith('.txt')) {
      results.push(full);
    }
  }
  return results;
}

const rawFiles = walkDir(RAW_DIR);
const newFiles = [];

for (const f of rawFiles) {
  const rel = relative(VAULT, f);
  const stat = statSync(f);
  const mtime = stat.mtime.toISOString();
  if (ingested.files[rel] && ingested.files[rel].mtime === mtime) continue;
  newFiles.push({ path: f, rel, mtime });
}

if (newFiles.length === 0) {
  console.log('No new raw sources to ingest.');
  process.exit(0);
}

console.log(`Found ${newFiles.length} new/modified raw sources.`);

const date = new Date().toISOString().slice(0, 10);
let logEntry = `\n## [${date}] ingest | ${newFiles.length} raw sources processed\n\n`;

for (const f of newFiles) {
  const category = f.rel.split('/')[1] || 'misc';
  const name = f.rel.split('/').pop();
  
  let summary = '';
  try {
    const content = readFileSync(f.path, 'utf8');
    const lines = content.split('\n').length;
    const chars = content.length;
    
    if (name.endsWith('.json')) {
      try {
        const data = JSON.parse(content);
        if (Array.isArray(data)) summary = `JSON array with ${data.length} items`;
        else summary = `JSON object with ${Object.keys(data).length} top-level keys`;
      } catch { summary = `JSON file (${chars} chars)`; }
    } else {
      const firstHeading = content.match(/^#\s+(.+)/m);
      summary = firstHeading ? firstHeading[1] : `${lines} lines, ${chars} chars`;
    }
  } catch (e) {
    summary = `Error reading: ${e.message}`;
  }
  
  logEntry += `- **${category}/${name}** — ${summary}\n`;
  
  ingested.files[f.rel] = { mtime: f.mtime, ingested_at: new Date().toISOString() };
}

logEntry += '\n';

// Prepend to Log
if (existsSync(LOG_FILE)) {
  const logContent = readFileSync(LOG_FILE, 'utf8');
  const fmMatch = logContent.match(/^---[\s\S]*?---\n/);
  if (fmMatch) {
    const fm = fmMatch[0];
    const rest = logContent.slice(fm.length);
    writeFileSync(LOG_FILE, fm + logEntry + rest);
  } else {
    writeFileSync(LOG_FILE, logEntry + logContent);
  }
}

writeFileSync(INGESTED_FILE, JSON.stringify(ingested, null, 2));
console.log(`Ingested ${newFiles.length} sources. Log updated.`);
