#!/usr/bin/env node
/**
 * Build a turnkey ChatGPT Project export from the whole Obsidian vault.
 *
 * Output:
 *   LLM Wiki/_export/chatgpt-project/
 *     - manifest.json
 *     - EXPORT_SUMMARY.md
 *     - project-instructions.md
 *     - upload-checklist.md
 *     - vault/                  (full vault mirror, redacted text only)
 *     - knowledge/chunks/*.md   (chunked merged text knowledge files)
 */
import {
  mkdirSync,
  existsSync,
  rmSync,
  readdirSync,
  statSync,
  readFileSync,
  writeFileSync,
  copyFileSync,
} from 'fs';
import { join, dirname, relative, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const VAULT = join(__dirname, '..', '..');
const EXPORT_ROOT = join(VAULT, '_export', 'chatgpt-project');
const EXPORT_VAULT = join(EXPORT_ROOT, 'vault');
const EXPORT_KNOWLEDGE = join(EXPORT_ROOT, 'knowledge', 'chunks');
const MAX_CHUNK_CHARS = 1_200_000;

const TEXT_EXTENSIONS = new Set([
  '.md',
  '.markdown',
  '.txt',
  '.json',
  '.yaml',
  '.yml',
  '.csv',
  '.ts',
  '.tsx',
  '.js',
  '.mjs',
  '.cjs',
  '.css',
  '.canvas',
  '.xml',
  '.html',
]);

const EXCLUDE_PATH_PREFIXES = [
  '_export/chatgpt-project',
  '.git',
  '_system/logs',
];

const EXCLUDE_BASENAMES = new Set([
  '.DS_Store',
]);

function ensureDir(path) {
  if (!existsSync(path)) mkdirSync(path, { recursive: true });
}

function shouldExclude(relPath) {
  if (!relPath) return false;
  if (EXCLUDE_BASENAMES.has(relPath.split('/').pop() || '')) return true;
  return EXCLUDE_PATH_PREFIXES.some((prefix) => relPath === prefix || relPath.startsWith(prefix + '/'));
}

function isTextFile(relPath) {
  const ext = extname(relPath).toLowerCase();
  return TEXT_EXTENSIONS.has(ext);
}

function redactSecrets(content) {
  return content
    // OpenRouter keys
    .replace(/sk-or-v1-[A-Za-z0-9]+/g, 'sk-or-v1-REDACTED')
    // OpenAI-style keys
    .replace(/sk-[A-Za-z0-9_-]{20,}/g, 'sk-REDACTED')
    // Generic bearer values in docs/config snippets
    .replace(/(Bearer\s+)[A-Za-z0-9._-]{16,}/gi, '$1REDACTED')
    // XML plist key blocks
    .replace(/(<key>OPENROUTER_API_KEY<\/key>\s*<string>)([^<]*)(<\/string>)/g, '$1REDACTED$3')
    .replace(/(<key>OPENAI_API_KEY<\/key>\s*<string>)([^<]*)(<\/string>)/g, '$1REDACTED$3')
    .replace(/(<key>SUPABASE_SERVICE_ROLE_KEY<\/key>\s*<string>)([^<]*)(<\/string>)/g, '$1REDACTED$3');
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    const rel = relative(VAULT, full);
    if (shouldExclude(rel)) continue;
    if (entry.isDirectory()) {
      walk(full, out);
    } else {
      out.push(full);
    }
  }
  return out;
}

function writeTextFile(path, content) {
  ensureDir(dirname(path));
  writeFileSync(path, content);
}

function build() {
  if (existsSync(EXPORT_ROOT)) rmSync(EXPORT_ROOT, { recursive: true, force: true });
  ensureDir(EXPORT_ROOT);
  ensureDir(EXPORT_VAULT);
  ensureDir(EXPORT_KNOWLEDGE);

  const files = walk(VAULT).sort((a, b) => a.localeCompare(b));
  const manifest = [];
  const chunkFiles = [];
  let currentChunk = '';
  let chunkIndex = 1;
  let textFileCount = 0;
  let binaryFileCount = 0;

  for (const absPath of files) {
    const relPath = relative(VAULT, absPath);
    const stats = statSync(absPath);
    const text = isTextFile(relPath);
    const vaultOut = join(EXPORT_VAULT, relPath);

    if (text) {
      textFileCount += 1;
      const raw = readFileSync(absPath, 'utf8');
      const redacted = redactSecrets(raw);
      writeTextFile(vaultOut, redacted);

      const block =
        `\n\n---\nFILE: ${relPath}\nMTIME: ${stats.mtime.toISOString()}\nSIZE: ${stats.size}\n---\n\n` +
        redacted;
      if (currentChunk.length + block.length > MAX_CHUNK_CHARS && currentChunk.length > 0) {
        const chunkName = `wiki-chunk-${String(chunkIndex).padStart(4, '0')}.md`;
        writeTextFile(join(EXPORT_KNOWLEDGE, chunkName), currentChunk);
        chunkFiles.push(chunkName);
        chunkIndex += 1;
        currentChunk = '';
      }
      currentChunk += block;
    } else {
      binaryFileCount += 1;
      ensureDir(dirname(vaultOut));
      copyFileSync(absPath, vaultOut);
    }

    manifest.push({
      path: relPath,
      size: stats.size,
      mtime: stats.mtime.toISOString(),
      kind: text ? 'text' : 'binary',
    });
  }

  if (currentChunk.length > 0) {
    const chunkName = `wiki-chunk-${String(chunkIndex).padStart(4, '0')}.md`;
    writeTextFile(join(EXPORT_KNOWLEDGE, chunkName), currentChunk);
    chunkFiles.push(chunkName);
  }

  writeTextFile(join(EXPORT_ROOT, 'manifest.json'), JSON.stringify({
    generatedAt: new Date().toISOString(),
    sourceVault: VAULT,
    filesTotal: manifest.length,
    textFiles: textFileCount,
    binaryFiles: binaryFileCount,
    chunkFiles,
    notes: 'Text files in export are redacted for obvious API key patterns. Original vault is unchanged.',
    files: manifest,
  }, null, 2));

  writeTextFile(
    join(EXPORT_ROOT, 'project-instructions.md'),
    [
      '# Lexery Wiki — Project Instructions for ChatGPT',
      '',
      '## Role',
      'You are a read-only knowledge assistant over the Lexery Obsidian vault export.',
      '',
      '## Source Priority',
      '1. Files under `vault/` are canonical.',
      '2. `knowledge/chunks/` are helper merged files for retrieval speed.',
      '3. If mismatch exists, trust `vault/`.',
      '',
      '## Response Rules',
      '- Prefer factual answers grounded in files.',
      '- Cite file paths used.',
      '- If data is stale or ambiguous, say it explicitly.',
      '- Never invent values not present in source files.',
      '',
      '## Safety',
      '- Do not output secrets or token-like values.',
      '- Treat all operational credentials as redacted/non-shareable.',
      '',
      '## Scope',
      '- Cover architecture, process, glossary, team, logs, and raw snapshots from this export.',
      '- Do not claim real-time state unless a file explicitly contains fresh timestamped data.',
      '',
    ].join('\n'),
  );

  writeTextFile(
    join(EXPORT_ROOT, 'upload-checklist.md'),
    [
      '# Upload Checklist (ChatGPT Project)',
      '',
      '1. Create/open your ChatGPT Project.',
      '2. Upload all files from `knowledge/chunks/` first.',
      '3. Upload `project-instructions.md`.',
      '4. (Optional, more precise answers) upload selected canonical pages from `vault/Lexery - *.md`.',
      '5. Ask a smoke question: "What are U1..U12 stages in Lexery?"',
      '6. Ask for citation: "Answer with file paths used."',
      '',
      'If answer quality is weak, upload additional files from `vault/raw/` and key pages from `vault/Lexery - *.md`.',
      '',
    ].join('\n'),
  );

  writeTextFile(
    join(EXPORT_ROOT, 'EXPORT_SUMMARY.md'),
    [
      '# Lexery Wiki Export Summary',
      '',
      `Generated: ${new Date().toISOString()}`,
      `Source: ${VAULT}`,
      `Files total: ${manifest.length}`,
      `Text files: ${textFileCount}`,
      `Binary files: ${binaryFileCount}`,
      `Chunk files: ${chunkFiles.length}`,
      '',
      'Top-level outputs:',
      '- `manifest.json`',
      '- `project-instructions.md`',
      '- `upload-checklist.md`',
      '- `vault/`',
      '- `knowledge/chunks/`',
      '',
    ].join('\n'),
  );

  console.log(`[export-chatgpt-project] done`);
  console.log(`  files: ${manifest.length}`);
  console.log(`  text: ${textFileCount}`);
  console.log(`  binary: ${binaryFileCount}`);
  console.log(`  chunks: ${chunkFiles.length}`);
  console.log(`  output: ${EXPORT_ROOT}`);
}

build();
