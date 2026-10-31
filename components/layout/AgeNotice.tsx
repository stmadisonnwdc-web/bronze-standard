import { cookies } from 'next/headers';
import Link from 'next/link';

export const ACK_COOKIE = 'bs_ack';

/**
 * 18+ Notice and Acknowledgment. Server-rendered and identical for every visitor and user
 * agent: the page content is in the HTML beneath it. A plain form POST sets the cookie, so
 * it works without JavaScript. It is a notice, not age verification.
 */
export async function AgeNotice() {
  const jar = await cookies();
  if (jar.get(ACK_COOKIE)?.value === '1') return null;

  return (
    <div className="age-notice" role="dialog" aria-modal="true" aria-labelledby="age-title" aria-describedby="age-desc">
      <div className="panel">
        <p className="mono quiet">Notice</p>
        <h2 id="age-title">For adults.</h2>
        <div id="age-desc">
          <p>
            This site concerns an adult content management business and is intended for people aged 18 or older. It contains
            no explicit images or text.
          </p>
          <p className="quiet">This is a notice, not age verification. Bronze Standard does not verify the age of visitors.</p>
        </div>
        <form method="post" action="/api/notice" className="actions">
          <button type="submit" name="ack" value="1" className="btn" autoFocus>
            I am 18 or older
          </button>
          <a href="https://www.google.com/" className="btn ghost" rel="noreferrer">
            Leave
          </a>
        </form>
        <p className="mono quiet" style={{ marginTop: 24 }}>
          <Link href="/legal/notice">About this notice</Link>
        </p>
      </div>
    </div>
  );
}
