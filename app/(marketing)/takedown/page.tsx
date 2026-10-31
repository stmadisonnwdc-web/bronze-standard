import type { Metadata } from 'next';
import { TakedownDraft } from '@/components/ui/TakedownDraft';

export const metadata: Metadata = {
  title: 'Takedown requests',
  description: 'Removal from Bronze surfaces within 24 hours. Anyone can report non-consensual imagery.',
  alternates: { canonical: '/takedown' },
};

type Search = { searchParams: Promise<{ invalid?: string; error?: string; ref?: string }> };

export default async function TakedownPage({ searchParams }: Search) {
  const q = await searchParams;
  const ref = q.ref && /^ERR-\d{10,16}$/.test(q.ref) ? q.ref : null;

  return (
    <section className="section">
      <div className="wrap two-col">
        <div>
          <h1 className="display-76">Takedown</h1>
          <p className="lead" style={{ marginTop: 24 }}>
            Removed from Bronze surfaces within 24 hours. Removal requests to other platforms filed within 24 hours.
          </p>
          <p className="quiet">There is no penalty for asking. You will get a case number straight away.</p>
        </div>
        <div>
          {q.invalid ? <div className="notice-box error" role="alert" style={{ marginBottom: 32 }}>Please add a valid email address and tell us which content to remove.</div> : null}
          {q.error ? (
            <div className="notice-box error" role="alert" style={{ marginBottom: 32 }}>
              <p>Your request could not be saved. Please submit it again; if you are using a browser with JavaScript, your answers are still in the form.</p>
              {ref ? <p className="mono" style={{ margin: 0 }}>Reference {ref}</p> : null}
            </div>
          ) : null}

          <form method="post" action="/api/takedown" className="form" id="takedown-form">
            <fieldset>
              <legend>Who is asking</legend>
              <div className="field" role="radiogroup" aria-labelledby="td-path">
                <span id="td-path" className="label">This request is about</span>
                <label className="choice"><input type="radio" name="path" value="talent" defaultChecked /> My own content, as Bronze Standard talent</label>
                <label className="choice"><input type="radio" name="path" value="ncii" /> Intimate imagery shared without consent (no account needed)</label>
              </div>
              <div className="field">
                <label htmlFor="requester">Your email address</label>
                <span className="hint">Talent: use the address registered with Bronze Standard so the request is verified.</span>
                <input id="requester" name="requester" type="email" required maxLength={200} autoComplete="email" />
              </div>
            </fieldset>
            <fieldset>
              <legend>What to remove</legend>
              <div className="field">
                <label htmlFor="assetRef">Link or description of the content</label>
                <input id="assetRef" name="assetRef" type="text" required maxLength={1000} />
              </div>
              <div className="field">
                <label htmlFor="reason">Anything else we should know (optional)</label>
                <span className="hint">You do not need to give a reason.</span>
                <textarea id="reason" name="reason" maxLength={4000} />
              </div>
              <div><button type="submit" className="btn">Send request</button></div>
            </fieldset>
          </form>
          <TakedownDraft formId="takedown-form" restore={Boolean(q.error)} />
        </div>
      </div>
    </section>
  );
}
