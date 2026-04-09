#!/usr/bin/env node
/**
 * Fetch recent Linear issues via GraphQL when LINEAR_API_KEY is set; update issues.json.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_DIR = join(__dirname, '..');
const STATE_FILE = join(SYSTEM_DIR, 'state', 'issues.json');
const LOGS_DIR = join(SYSTEM_DIR, 'logs');

const LINEAR_URL = 'https://api.linear.app/graphql';

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

const apiKey = process.env.LINEAR_API_KEY;

if (!apiKey) {
  console.warn('LINEAR_API_KEY not set — skipping Linear sync.');
  process.exit(0);
}

if (!existsSync(STATE_FILE)) {
  console.error(`ERROR: issues.json not found at ${STATE_FILE}`);
  process.exit(1);
}

if (!existsSync(LOGS_DIR)) mkdirSync(LOGS_DIR, { recursive: true });

const state = JSON.parse(readFileSync(STATE_FILE, 'utf8'));
const linear = state.linear || (state.linear = {});

const query = `
  query RecentIssues($first: Int!) {
    issues(first: $first, orderBy: updatedAt) {
      nodes {
        id
        identifier
        title
        updatedAt
        state { name }
        team { name }
        url
      }
    }
  }
`;

async function main() {
  const res = await fetch(LINEAR_URL, {
    method: 'POST',
    headers: {
      Authorization: apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables: { first: 50 } }),
  });

  const json = await res.json();
  if (json.errors?.length) {
    console.error('Linear GraphQL errors:', JSON.stringify(json.errors, null, 2));
    process.exit(1);
  }

  let nodes = json.data?.issues?.nodes || [];
  const teamFilter = linear.team?.trim();
  if (teamFilter) {
    nodes = nodes.filter((n) => (n.team?.name || '').trim() === teamFilter);
  }

  const lastCursor = linear.last_processed_issue_updated_at;
  const newOnes = lastCursor
    ? nodes.filter((n) => String(n.updatedAt) > String(lastCursor))
    : nodes;

  const maxUpdated =
    newOnes.length > 0
      ? newOnes.reduce((a, n) => (String(n.updatedAt) > String(a) ? n.updatedAt : a), newOnes[0].updatedAt)
      : lastCursor;

  linear.last_processed_issue_updated_at = maxUpdated ?? linear.last_processed_issue_updated_at;
  linear.last_sync = todayIsoDate();
  linear.processed_count = Number(linear.processed_count ?? 0) + newOnes.length;
  linear.recent_snapshot = newOnes.slice(0, 25).map((n) => ({
    id: n.id,
    identifier: n.identifier,
    title: n.title,
    state: n.state?.name,
    updatedAt: n.updatedAt,
    url: n.url,
  }));

  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
  console.log(
    `Linear sync: ${newOnes.length} issue(s) in delta window; state written to ${STATE_FILE}`,
  );
}

await main();
