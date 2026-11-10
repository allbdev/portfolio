#!/usr/bin/env node
/**
 * Builds app/data/commits.json — the data behind the hero's 3D commit skyline.
 *
 * GitHub's public calendar under-counts (most commits use an email GitHub does
 * not credit, and most repos are private), so this reads the real history from
 * local clones instead. Run it whenever you want the skyline refreshed:
 *
 *   pnpm commits            # scans ~/Dev
 *   pnpm commits ~/code     # scans another folder
 *
 * Only your own author emails are counted. Private/client repos are reported
 * as "client work" so no private project name ever reaches the site.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';

const ROOT = resolve(process.argv[2] ?? join(homedir(), 'Dev'));

const AUTHOR_EMAILS = [
  'alb.develloper@gmail.com',
  'vini.alb13@gmail.com',
  '144454350+allbdev@users.noreply.github.com',
  'vinicius.albuquerque@MacBook-Pro-de-Vinicius.local',
];

/** Folder name → label shown on the site. Anything else is "client work". */
const PUBLIC_REPOS = {
  'path-trader': 'Path Trader',
  vestra: 'Vestra',
  portfolio: 'portfolio',
  'job-hunt-kit-template': 'job-hunt-kit',
  seguros: 'Bem Coberto',
};
const PRIVATE_LABEL = 'client work';

const WEEKS = 52;
const DAY = 86_400_000;

const iso = (date) => date.toISOString().slice(0, 10);

// GitHub-style window: 52 full weeks plus the current partial one, Sunday first.
const today = new Date(`${iso(new Date())}T00:00:00Z`);
const start = new Date(today.getTime() - (WEEKS * 7 + today.getUTCDay()) * DAY);
const totalDays = Math.round((today.getTime() - start.getTime()) / DAY) + 1;

const labels = [];
const labelIndex = (label) => {
  let index = labels.indexOf(label);
  if (index === -1) index = labels.push(label) - 1;
  return index;
};

/** perDay[dayIndex] = Map(labelIndex → commits) */
const perDay = Array.from({ length: totalDays }, () => new Map());

const repos = readdirSync(ROOT, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && existsSync(join(ROOT, entry.name, '.git')))
  .map((entry) => entry.name);

for (const repo of repos) {
  let log = '';
  try {
    log = execFileSync(
      'git',
      ['-C', join(ROOT, repo), 'log', '--all', `--since=${iso(start)}`, '--format=%ae %ad', '--date=short'],
      { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 },
    );
  } catch {
    continue;
  }

  const label = labelIndex(PUBLIC_REPOS[repo] ?? PRIVATE_LABEL);
  for (const line of log.split('\n')) {
    const [email, date] = line.split(' ');
    if (!date || !AUTHOR_EMAILS.includes(email)) continue;
    const day = Math.round((new Date(`${date}T00:00:00Z`).getTime() - start.getTime()) / DAY);
    if (day < 0 || day >= totalDays) continue;
    perDay[day].set(label, (perDay[day].get(label) ?? 0) + 1);
  }
}

const counts = perDay.map((map) => [...map.values()].reduce((sum, n) => sum + n, 0));
// Repo that got the most commits that day, for the hover tooltip.
const topRepo = perDay.map((map) => {
  let best = -1;
  let bestCount = 0;
  for (const [label, n] of map) {
    if (n > bestCount) [best, bestCount] = [label, n];
  }
  return best;
});

const total = counts.reduce((sum, n) => sum + n, 0);
const byRepo = labels
  .map((label, index) => ({
    label,
    commits: perDay.reduce((sum, map) => sum + (map.get(index) ?? 0), 0),
  }))
  .sort((a, b) => b.commits - a.commits);

// Longest run of consecutive days with at least one commit.
let streak = 0;
let run = 0;
for (const n of counts) {
  run = n > 0 ? run + 1 : 0;
  streak = Math.max(streak, run);
}

const out = {
  generatedAt: iso(today),
  start: iso(start),
  total,
  activeDays: counts.filter((n) => n > 0).length,
  longestStreak: streak,
  busiestDay: { date: iso(new Date(start.getTime() + counts.indexOf(Math.max(...counts)) * DAY)), commits: Math.max(...counts) },
  labels,
  byRepo,
  counts,
  topRepo,
};

const dir = resolve(import.meta.dirname, '../app/data');
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, 'commits.json'), `${JSON.stringify(out)}\n`);

console.log(`commits.json: ${total} commits over ${out.activeDays} active days (${iso(start)} → ${iso(today)})`);
console.table(byRepo);
