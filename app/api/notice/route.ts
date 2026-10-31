import type { NextRequest } from 'next/server';
import { ACK_COOKIE } from '@/components/layout/AgeNotice';
import { sameOrigin, seeOther } from '@/lib/http';

export const runtime = 'nodejs';

/** Records the 18+ acknowledgment in a first-party cookie and returns the visitor to the page they were on. */
export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return new Response('Forbidden', { status: 403 });
  let back = '/';
  const ref = req.headers.get('referer');
  if (ref) {
    try {
      const u = new URL(ref);
      if (u.host === req.headers.get('host')) back = u.pathname + u.search + u.hash;
    } catch {
      /* fall back to home */
    }
  }
  const res = seeOther(req, back);
  res.cookies.set(ACK_COOKIE, '1', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 24 * 180 });
  return res;
}
