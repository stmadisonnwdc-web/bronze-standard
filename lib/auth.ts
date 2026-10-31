import 'server-only';
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { store } from './store';

/**
 * Ledger authentication: emailed magic link → signed, HttpOnly session cookie.
 * Accounts (email → talent slug) are created by the founder with `npm run add-talent`.
 * Magic tokens are single-use (nonce recorded) and expire in 15 minutes; sessions in 12 hours.
 */
export const SESSION_COOKIE = 'bs_session';
const TOKEN_TTL_MS = 15 * 60 * 1000;
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

export interface Account { email: string; slug: string; active: boolean }
export interface Session { slug: string; exp: number }

function secret(): Buffer {
  const s = process.env.SESSION_SECRET;
  if (!s) {
    if (process.env.NODE_ENV === 'production') throw new Error('SESSION_SECRET is required in production.');
    return Buffer.from('development-only-secret-do-not-use-in-production');
  }
  return Buffer.from(s, 'base64');
}

function b64url(buf: Buffer | string) {
  return Buffer.from(buf).toString('base64url');
}

function sign(payload: object): string {
  const body = b64url(JSON.stringify(payload));
  const mac = createHmac('sha256', secret()).update(body).digest('base64url');
  return `${body}.${mac}`;
}

function verify<T>(token: string | undefined): T | null {
  if (!token) return null;
  const [body, mac] = token.split('.');
  if (!body || !mac) return null;
  const expected = createHmac('sha256', secret()).update(body).digest('base64url');
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    return JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as T;
  } catch {
    return null;
  }
}

export function accountId(email: string): string {
  return createHmac('sha256', secret()).update(email.trim().toLowerCase()).digest('hex').slice(0, 40);
}

export async function findAccount(email: string): Promise<Account | null> {
  const rec = await store.get<Account>('accounts', accountId(email));
  return rec && rec.data.active ? rec.data : null;
}

export function issueMagicToken(email: string): string {
  const nonce = randomBytes(12).toString('hex');
  return sign({ e: email.trim().toLowerCase(), n: nonce, x: Date.now() + TOKEN_TTL_MS });
}

/** Returns the account for a valid, unused, unexpired token, and burns the nonce. */
export async function redeemMagicToken(token: string): Promise<Account | null> {
  const p = verify<{ e: string; n: string; x: number }>(token);
  if (!p || p.x < Date.now()) return null;
  if (await store.get('tokens', p.n)) return null; // already used
  await store.put('tokens', p.n, { usedAt: new Date().toISOString() });
  return findAccount(p.e);
}

export function sessionCookieValue(slug: string): string {
  return sign({ slug, exp: Date.now() + SESSION_TTL_MS } satisfies Session);
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: SESSION_TTL_MS / 1000,
};

/** Server-side only. Returns null for a missing, forged or expired session. */
export async function currentSession(): Promise<Session | null> {
  const jar = await cookies();
  const s = verify<Session>(jar.get(SESSION_COOKIE)?.value);
  if (!s || s.exp < Date.now()) return null;
  return s;
}
