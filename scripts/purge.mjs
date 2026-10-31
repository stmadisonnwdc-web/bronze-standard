// Applies the retention schedule (/legal/privacy). Run daily from a scheduler.
// Applications not accepted: 90 days. Takedown cases: 3 years. Used magic-link nonces: 1 day.
// Onboarded applications (2 years) and ledger entries (7 years) are reviewed manually.
// Record bodies stay encrypted; only file modification times are read.
import { promises as fs } from 'node:fs';
import path from 'node:path';

const DIR = process.env.DATA_DIR || '.data';
const DAY = 86400000;
const rules = [
  { collection: 'applications', maxAgeDays: 90 },
  { collection: 'takedowns', maxAgeDays: 365 * 3 },
  { collection: 'tokens', maxAgeDays: 1 },
];
const dryRun = process.argv.includes('--dry-run');
const now = Date.now();

for (const r of rules) {
  const dir = path.join(DIR, r.collection);
  let names = [];
  try { names = await fs.readdir(dir); } catch { continue; }
  let removed = 0;
  for (const n of names) {
    const f = path.join(dir, n);
    const { mtimeMs } = await fs.stat(f);
    if (now - mtimeMs > r.maxAgeDays * DAY) {
      if (!dryRun) await fs.rm(f, { force: true });
      removed++;
    }
  }
  console.log(`${r.collection}: ${removed} record(s) ${dryRun ? 'would be' : ''} removed (older than ${r.maxAgeDays} days)`);
}
