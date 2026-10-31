import type { Metadata } from 'next';
import Link from 'next/link';
import { currentSession } from '@/lib/auth';
import { store } from '@/lib/store';
import { EM_DASH, formatDate, formatValue } from '@/lib/format';

export const metadata: Metadata = { title: 'Ledger', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export interface LedgerEntry {
  slug: string;
  period: string; // YYYY-MM
  surface: string;
  netReceipts: number;
  commissionRate: number; // 0.20 or 0.12
  subscriberDelta: number | null;
  reviews: number | null;
}

type Search = { searchParams: Promise<{ sent?: string; invalid?: string; signedout?: string }> };

/**
 * Server-rendered. Without a valid session the page contains no talent data at all:
 * the query below runs only after the session is verified, and only for that talent's slug.
 */
export default async function LedgerPage({ searchParams }: Search) {
  const session = await currentSession();
  const q = await searchParams;

  if (!session) {
    return (
      <section className="section">
        <div className="wrap two-col">
          <div>
            <p className="mono quiet">Private</p>
            <h1 className="display-76">Ledger</h1>
            <p className="lead" style={{ marginTop: 24 }}>
              Each talent sees their own Net Receipts, the commission taken and what remains. Nobody sees anyone else’s.
            </p>
          </div>
          <div>
            {q.sent ? <div className="notice-box" role="status" style={{ marginBottom: 32 }}>If that address belongs to a Bronze Standard account, a sign-in link is on its way. It works once and expires in 15 minutes.</div> : null}
            {q.invalid ? <div className="notice-box error" role="alert" style={{ marginBottom: 32 }}>That link has expired or was already used. Ask for a new one.</div> : null}
            {q.signedout ? <div className="notice-box" role="status" style={{ marginBottom: 32 }}>You are signed out.</div> : null}
            <form method="post" action="/api/auth/request" className="form">
              <fieldset>
                <legend>Sign in</legend>
                <div className="field">
                  <label htmlFor="email">Email address registered with Bronze Standard</label>
                  <input id="email" name="email" type="email" required autoComplete="email" />
                </div>
                <div><button type="submit" className="btn">Email me a sign-in link</button></div>
              </fieldset>
            </form>
            <p className="quiet" style={{ marginTop: 24 }}>Sessions last 12 hours. Accounts are created by Bronze Standard during onboarding.</p>
          </div>
        </div>
      </section>
    );
  }

  const entries = (await store.list<LedgerEntry>('ledger'))
    .map((r) => r.data)
    .filter((e) => e.slug === session.slug)
    .sort((a, b) => b.period.localeCompare(a.period));

  const totals = entries.reduce(
    (t, e) => {
      const c = Math.round(e.netReceipts * e.commissionRate * 100) / 100;
      return { net: t.net + e.netReceipts, commission: t.commission + c };
    },
    { net: 0, commission: 0 },
  );

  return (
    <section className="section">
      <div className="wrap">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 24, flexWrap: 'wrap' }}>
          <div>
            <p className="mono quiet">Private · signed in</p>
            <h1 className="display-52">Your ledger</h1>
          </div>
          <form method="post" action="/api/auth/logout"><button type="submit" className="btn ghost">Sign out</button></form>
        </div>

        {entries.length === 0 ? (
          <p className="lead" style={{ marginTop: 48 }}>No entries yet. The first appear the week after your profile goes live.</p>
        ) : (
          <>
            <div className="metric-tiles" style={{ margin: '48px 0' }}>
              <div className="card"><span className="metric-value">{formatValue(totals.net, 'USD')}</span><p className="label quiet">Net Receipts, all periods</p></div>
              <div className="card"><span className="metric-value">{formatValue(totals.commission, 'USD')}</span><p className="label quiet">Commission invoiced</p></div>
              <div className="card"><span className="metric-value">{formatValue(totals.net - totals.commission, 'USD')}</span><p className="label quiet">Yours after commission</p></div>
            </div>
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th scope="col">Period</th><th scope="col">Surface</th><th scope="col">Net Receipts</th><th scope="col">Rate</th><th scope="col">Commission</th><th scope="col">Yours</th><th scope="col">Subscribers</th><th scope="col">Reviews</th></tr></thead>
                <tbody>
                  {entries.map((e, i) => {
                    const c = Math.round(e.netReceipts * e.commissionRate * 100) / 100;
                    return (
                      <tr key={`${e.period}-${e.surface}-${i}`} className="tnum">
                        <td className="mono">{e.period}</td>
                        <td>{e.surface}</td>
                        <td>{formatValue(e.netReceipts, 'USD')}</td>
                        <td>{formatValue(e.commissionRate * 100, '%')}</td>
                        <td>{formatValue(c, 'USD')}</td>
                        <td>{formatValue(e.netReceipts - c, 'USD')}</td>
                        <td>{e.subscriberDelta === null ? EM_DASH : (e.subscriberDelta > 0 ? '+' : '') + e.subscriberDelta}</td>
                        <td>{e.reviews ?? EM_DASH}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
        <p className="quiet" style={{ marginTop: 32 }}>
          Figures come from platform payout statements. Commission is invoiced monthly; Bronze never holds your earnings.
          Questions about an entry: reply to your monthly invoice. Updated weekly; last viewed {formatDate(new Date().toISOString().slice(0, 10))}.{' '}
          <Link className="text-link" href="/takedown">Takedown requests</Link>
        </p>
      </div>
    </section>
  );
}
