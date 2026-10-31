import type { NextRequest } from 'next/server';
import { currentSession, findAccount } from '@/lib/auth';
import { EMAIL, sameOrigin, seeOther, text } from '@/lib/http';
import { send } from '@/lib/mail';
import { newId, store } from '@/lib/store';

export const runtime = 'nodejs';

export interface TakedownCase {
  caseId: string;
  path: 'talent' | 'ncii';
  assetRef: string;
  requester: string;
  requesterVerified: boolean;
  reason: string;
  receivedAt: string;
  dueAt: string;
  completedAt?: string;
  thirdPartyRequests?: string[];
}

const SLA_MS = 24 * 60 * 60 * 1000;

/** Always available: takedown is never gated. Writes the case, notifies the custodian, returns the case ID and due time. */
export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return new Response('Forbidden', { status: 403 });
  const form = await req.formData();
  const path = form.get('path') === 'ncii' ? 'ncii' : 'talent';
  const requester = text(form, 'requester', 200);
  const assetRef = text(form, 'assetRef', 1000);
  const reason = text(form, 'reason', 4000);
  if (!EMAIL.test(requester) || !assetRef) return seeOther(req, '/takedown?invalid=1');

  const session = await currentSession();
  const requesterVerified = path === 'talent' ? Boolean(session) || Boolean(await findAccount(requester)) : false;

  const received = new Date();
  const record: TakedownCase = {
    caseId: newId('TD'),
    path,
    assetRef,
    requester,
    requesterVerified,
    reason,
    receivedAt: received.toISOString(),
    dueAt: new Date(received.getTime() + SLA_MS).toISOString(),
  };

  try {
    await store.put('takedowns', record.caseId, record);
  } catch (err) {
    console.error('[takedown] store failed', err);
    return seeOther(req, `/takedown?error=1&ref=${encodeURIComponent(`ERR-${received.getTime()}`)}`);
  }

  try {
    await send({
      to: process.env.CUSTODIAN_EMAIL || 'custodian@example.invalid',
      subject: `Takedown ${record.caseId} (${path === 'ncii' ? 'non-consensual imagery' : 'talent request'}) — due ${record.dueAt}`,
      text: `Case ${record.caseId}\nPath: ${path}\nVerified requester: ${requesterVerified ? 'yes' : 'no'}\nReceived: ${record.receivedAt}\nDue: ${record.dueAt}\nAsset: ${assetRef}\n\nOpen the case in the records system. Do not reply with asset contents by email.`,
    });
  } catch (err) {
    // The case is recorded; a failed notice must not lose it. The custodian sweeps open cases daily (SOP-11).
    console.error('[takedown] custodian notice failed', err);
  }

  return seeOther(req, `/takedown/confirm?case=${encodeURIComponent(record.caseId)}&due=${encodeURIComponent(record.dueAt)}`);
}
