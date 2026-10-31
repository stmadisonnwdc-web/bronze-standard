import type { NextRequest } from 'next/server';
import { gateAllows } from '@/lib/guards';
import { EMAIL, sameOrigin, seeOther, text } from '@/lib/http';
import { newId, store } from '@/lib/store';

export const runtime = 'nodejs';

export interface Application {
  stageName: string;
  contact: string;
  eligibility: { adult: true; dcMetro: boolean; noExclusive: boolean };
  answers: { creating: string; platforms: string; rhythm: string; support: string; other: string };
  consent: true;
  status: 'received';
}

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return new Response('Forbidden', { status: 403 });
  // Applications open only once Gate 0 clears; the form is disabled until then, and so is this handler.
  if (!gateAllows('G0')) return seeOther(req, '/apply?closed=1');

  const form = await req.formData();

  // Under 18 ends the application and stores nothing.
  if (form.get('adult') !== 'yes') return seeOther(req, '/apply?ended=1');

  const stageName = text(form, 'stageName', 80);
  const contact = text(form, 'contact', 200);
  const consent = form.get('consent') === 'yes';
  if (!stageName || !EMAIL.test(contact) || !consent) return seeOther(req, '/apply?invalid=1');

  const id = newId('APP');
  const record: Application = {
    stageName,
    contact,
    eligibility: { adult: true, dcMetro: form.get('dcMetro') === 'yes', noExclusive: form.get('noExclusive') === 'yes' },
    answers: {
      creating: text(form, 'creating', 600),
      platforms: text(form, 'platforms', 600),
      rhythm: text(form, 'rhythm', 600),
      support: text(form, 'support', 1200),
      other: text(form, 'other', 1200),
    },
    consent: true,
    status: 'received',
  };

  try {
    await store.put('applications', id, record);
  } catch (err) {
    console.error('[apply] store failed', err);
    return seeOther(req, '/apply?error=1');
  }
  return seeOther(req, `/apply/confirm?ref=${encodeURIComponent(id)}`);
}
