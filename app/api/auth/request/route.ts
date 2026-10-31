import type { NextRequest } from 'next/server';
import { findAccount, issueMagicToken } from '@/lib/auth';
import { EMAIL, sameOrigin, seeOther, text } from '@/lib/http';
import { send } from '@/lib/mail';
import { site } from '@/content/site';

export const runtime = 'nodejs';

/** Sends a single-use sign-in link if the address belongs to an account. The response is the same either way. */
export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return new Response('Forbidden', { status: 403 });
  const form = await req.formData();
  const email = text(form, 'email', 200).toLowerCase();
  if (EMAIL.test(email)) {
    const account = await findAccount(email);
    if (account) {
      const link = new URL(`/ledger/verify?token=${encodeURIComponent(issueMagicToken(email))}`, site.url).toString();
      try {
        await send({ to: email, subject: 'Your Bronze Standard sign-in link', text: `Sign in to your Ledger:\n\n${link}\n\nThe link works once and expires in 15 minutes. If you did not ask for it, ignore this message.` });
      } catch (err) {
        console.error('[auth] send failed', err);
      }
    }
  }
  return seeOther(req, '/ledger?sent=1');
}
