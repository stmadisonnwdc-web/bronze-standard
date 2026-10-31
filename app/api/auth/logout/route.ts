import type { NextRequest } from 'next/server';
import { SESSION_COOKIE } from '@/lib/auth';
import { sameOrigin, seeOther } from '@/lib/http';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return new Response('Forbidden', { status: 403 });
  const res = seeOther(req, '/ledger?signedout=1');
  res.cookies.set(SESSION_COOKIE, '', { path: '/', maxAge: 0, httpOnly: true, sameSite: 'lax' });
  return res;
}
