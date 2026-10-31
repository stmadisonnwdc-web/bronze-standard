import type { NextRequest } from 'next/server';
import { redeemMagicToken, SESSION_COOKIE, sessionCookieOptions, sessionCookieValue } from '@/lib/auth';
import { sameOrigin, seeOther, text } from '@/lib/http';

export const runtime = 'nodejs';

/**
 * Redeems a magic link. It is a POST from /ledger/verify (not a GET on the emailed URL)
 * so that mail scanners that prefetch links cannot burn the single-use token.
 */
export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return new Response('Forbidden', { status: 403 });
  const form = await req.formData();
  const account = await redeemMagicToken(text(form, 'token', 2000));
  if (!account) return seeOther(req, '/ledger?invalid=1');
  const res = seeOther(req, '/ledger');
  res.cookies.set(SESSION_COOKIE, sessionCookieValue(account.slug), sessionCookieOptions);
  return res;
}
