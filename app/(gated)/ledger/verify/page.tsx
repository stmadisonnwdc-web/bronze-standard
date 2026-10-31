import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Sign in', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

type Search = { searchParams: Promise<{ token?: string }> };

/** The emailed link lands here; signing in is a deliberate POST, so link scanners cannot use the token. */
export default async function VerifyPage({ searchParams }: Search) {
  const { token } = await searchParams;
  return (
    <section className="section">
      <div className="wrap">
        <h1 className="display-52">Sign in to your ledger</h1>
        {token ? (
          <form method="post" action="/api/auth/verify" style={{ marginTop: 32 }}>
            <input type="hidden" name="token" value={token} />
            <button type="submit" className="btn">Continue</button>
          </form>
        ) : (
          <p className="lead" style={{ marginTop: 24 }}>This link is incomplete. Ask for a new one from the Ledger page.</p>
        )}
      </div>
    </section>
  );
}
