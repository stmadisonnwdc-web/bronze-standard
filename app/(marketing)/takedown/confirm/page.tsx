import type { Metadata } from 'next';
import { ClearTakedownDraft } from '@/components/ui/TakedownDraft';

export const metadata: Metadata = { title: 'Takedown request received', robots: { index: false, follow: false } };

type Search = { searchParams: Promise<{ case?: string; due?: string }> };

export default async function TakedownConfirm({ searchParams }: Search) {
  const q = await searchParams;
  const caseId = q.case && /^TD-\d{8}-[0-9A-F]{6}$/.test(q.case) ? q.case : null;
  const due = q.due && !Number.isNaN(Date.parse(q.due)) ? new Date(q.due) : null;
  const dueText = due
    ? new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeStyle: 'short', timeZone: 'America/New_York' }).format(due) + ' Eastern'
    : null;

  return (
    <section className="section">
      <ClearTakedownDraft />
      <div className="wrap">
        <h1 className="display-52">Request received.</h1>
        {caseId ? <p className="mono" style={{ fontSize: 'var(--fs-22)', marginTop: 24 }}>Case {caseId}</p> : null}
        <p className="lead" style={{ marginTop: 24 }}>
          Removed from Bronze surfaces within 24 hours{dueText ? `, by ${dueText}` : ''}. Removal requests to other platforms filed within 24 hours.
        </p>
        <p className="quiet">Keep the case number. The records custodian has been notified and will write to you when the case closes.</p>
      </div>
    </section>
  );
}
