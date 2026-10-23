#!/usr/bin/env node
/**
 * The reference gate: fails when a tracked file names something this public repository must not, such as an internal
 * product name, an internal host or a private package scope. It is the public half of the gate the code was extracted
 * under.
 *
 * Two kinds of term:
 *   - WORDS are listed only as hashes (the first 16 hex of the SHA-256 of the lower-cased word, or of two words joined
 *     by a space), so this file does not publish the words it keeps out. Every word and pair of words in a tracked file
 *     is hashed and looked up.
 *   - PATTERNS are plain regular expressions, for shapes that say nothing on their own.
 *
 * A hit fails unless an entry in reference-allowlist.json covers it (`{ "path": "…", "term": "<id>", "reason": "…" }`;
 * every entry must give a reason, and an entry that covers nothing fails too, so the list cannot go stale).
 *
 *   node scripts/reference-gate.mjs    # exit 1 with every hit listed as file:line and term
 */
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const SELF = fileURLToPath(import.meta.url);
const ROOT = join(dirname(SELF), '..');

/** Hashed words: id → hash. */
export const DENIED_WORDS = {
  'internal-name-1': '7d9a4bdcf82d365f',
  'internal-name-2': '9d7ab7eb4fa42d59',
  'internal-name-3': 'f54807dccb47fbc8',
  'internal-name-4': 'e98dcad8dd8ada2b',
  'internal-phrase-1': '3fc7f317a816e60a',
  'internal-phrase-2': '01bbac405821b4e3',
};

/** Plain patterns: `flags` defaults to case-insensitive. */
export const DENIED_PATTERNS = [
  { id: 'ticket-ref', pattern: '\\b(?:SAW|SKYN)-[0-9A-Z]+\\b', flags: '', fix: 'drop internal ticket references' },
  { id: 'internal-product', pattern: '\\bSAW\\b', flags: '', fix: 'say By Dawn' },
  { id: 'private-scope', pattern: '@lendercom/saw-|@saw/', fix: 'use the public @bydawn/ scope' },
  { id: 'internal-repo', pattern: 'lendercom/saw-', fix: 'name the public repository, or nothing' },
  { id: 'internal-email', pattern: '@lender\\.com', fix: 'use an example.com address' },
  { id: 'internal-host', pattern: '\\.azurewebsites\\.net|\\.internal\\b', fix: 'use a placeholder host such as app.example.com' },
];

function hash(s) {
  return createHash('sha256').update(s).digest('hex').slice(0, 16);
}

const BY_HASH = new Map(Object.entries(DENIED_WORDS).map(([id, h]) => [h, id]));
const MATCHERS = DENIED_PATTERNS.map((p) => ({ ...p, re: new RegExp(p.pattern, p.flags ?? 'i') }));

/** The term ids one line hits. */
export function lineHits(line) {
  const ids = new Set();
  const words = line.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  for (let i = 0; i < words.length; i++) {
    const one = BY_HASH.get(hash(words[i]));
    if (one) ids.add(one);
    if (i + 1 < words.length) {
      const two = BY_HASH.get(hash(`${words[i]} ${words[i + 1]}`));
      if (two) ids.add(two);
    }
  }
  for (const m of MATCHERS) if (m.re.test(line)) ids.add(m.id);
  return [...ids];
}

export function allowlistProblems(allowlist) {
  if (!Array.isArray(allowlist)) return ['the allow-list must be a JSON array of { path, term?, reason }'];
  const known = new Set([...Object.keys(DENIED_WORDS), ...DENIED_PATTERNS.map((p) => p.id)]);
  const problems = [];
  allowlist.forEach((e, i) => {
    if (typeof e?.path !== 'string' || !e.path) problems.push(`allow-list entry ${i} has no path`);
    if (typeof e?.reason !== 'string' || !e.reason.trim()) problems.push(`allow-list entry ${i} has no reason`);
    if (e?.term !== undefined && !known.has(e.term)) problems.push(`allow-list entry ${i} names an unknown term "${e.term}"`);
  });
  return problems;
}

/** Scan `files` (path → text). Returns the uncovered hits and the allow-list problems. */
export function scan(files, allowlist = []) {
  const problems = allowlistProblems(allowlist);
  const used = new Set();
  const hits = [];
  for (const [path, text] of Object.entries(files)) {
    text.split('\n').forEach((line, i) => {
      for (const term of lineHits(line)) {
        const cover = allowlist.findIndex((e) => (e.path === path || (e.path.endsWith('/') && path.startsWith(e.path))) && (!e.term || e.term === term));
        if (cover >= 0) used.add(cover);
        else hits.push({ path, line: i + 1, term });
      }
    });
  }
  allowlist.forEach((e, i) => {
    if (!used.has(i)) problems.push(`allow-list entry ${i} (${e.path}) covers nothing; remove it`);
  });
  return { hits, problems };
}

function trackedFiles(root) {
  const out = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' });
  const files = {};
  for (const rel of out.split('\0').filter(Boolean)) {
    const abs = join(root, rel);
    if (abs === SELF || !existsSync(abs)) continue;
    const buf = readFileSync(abs);
    if (buf.includes(0)) continue; // binary
    files[rel] = buf.toString('utf8');
  }
  return files;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const allowPath = join(dirname(SELF), 'reference-allowlist.json');
  const allowlist = existsSync(allowPath) ? JSON.parse(readFileSync(allowPath, 'utf8')) : [];
  const { hits, problems } = scan(trackedFiles(ROOT), allowlist);
  const fixes = Object.fromEntries(DENIED_PATTERNS.map((p) => [p.id, p.fix]));
  for (const p of problems) console.error(`reference-gate: ${p}`);
  for (const h of hits) console.error(`${h.path}:${h.line}: ${h.term}${fixes[h.term] ? ` (${fixes[h.term]})` : ' (remove the internal name)'}`);
  if (hits.length || problems.length) {
    console.error(`reference-gate: ${hits.length} hit(s), ${problems.length} problem(s) in ${relative(process.cwd(), allowPath) || allowPath}`);
    process.exit(1);
  }
  console.log(`reference-gate: clean (${Object.keys(DENIED_WORDS).length} words, ${DENIED_PATTERNS.length} patterns)`);
}
