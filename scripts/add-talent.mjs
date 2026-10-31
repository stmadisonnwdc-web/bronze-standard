// Creates a Ledger account (email → talent slug) during onboarding.
// Usage: DATA_KEY=... SESSION_SECRET=... node scripts/add-talent.mjs <email> <slug>
// Uses the same encryption and account-id derivation as lib/store.ts and lib/auth.ts.
import { createCipheriv, createHmac, randomBytes } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const [email, slug] = process.argv.slice(2);
if (!email || !slug || !/^[a-z0-9-]{1,64}$/.test(slug)) {
  console.error('Usage: node scripts/add-talent.mjs <email> <slug>');
  process.exit(1);
}
const prod = process.env.NODE_ENV === 'production';
const key = process.env.DATA_KEY ? Buffer.from(process.env.DATA_KEY, 'base64') : prod ? null : Buffer.alloc(32, 7);
const secret = process.env.SESSION_SECRET ? Buffer.from(process.env.SESSION_SECRET, 'base64') : prod ? null : Buffer.from('development-only-secret-do-not-use-in-production');
if (!key || !secret) { console.error('DATA_KEY and SESSION_SECRET are required.'); process.exit(1); }

const id = createHmac('sha256', secret).update(email.trim().toLowerCase()).digest('hex').slice(0, 40);
const rec = { id, createdAt: new Date().toISOString(), data: { email: email.trim().toLowerCase(), slug, active: true } };
const iv = randomBytes(12);
const c = createCipheriv('aes-256-gcm', key, iv);
const body = Buffer.concat([c.update(JSON.stringify(rec), 'utf8'), c.final()]);
const dir = path.join(process.env.DATA_DIR || '.data', 'accounts');
await fs.mkdir(dir, { recursive: true, mode: 0o700 });
await fs.writeFile(path.join(dir, `${id}.enc`), Buffer.concat([iv, c.getAuthTag(), body]).toString('base64'), { mode: 0o600 });
console.log(`Account created for ${slug}.`);
