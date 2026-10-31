import type { Metadata } from 'next';
import Link from 'next/link';
import { gate, gateAllows } from '@/lib/guards';
import { GateChip } from '@/components/ui/GateChip';

export const metadata: Metadata = {
  title: 'Apply',
  description: 'Five questions for creators in the DC metro. Bronze Standard stores the minimum.',
  alternates: { canonical: '/apply' },
};

type Search = { searchParams: Promise<Record<string, string | string[] | undefined>> };

const steps = ['Eligibility', 'Five questions', 'Contact and consent', 'Confirmation'];

export default async function ApplyPage({ searchParams }: Search) {
  const q = await searchParams;
  const open = gateAllows('G0');
  const g0 = gate('G0');

  if (q.ended) {
    return (
      <section className="section">
        <div className="wrap">
          <h1 className="display-52">Thank you.</h1>
          <p className="lead" style={{ marginTop: 24 }}>Bronze Standard works only with people aged 18 or older. Nothing you entered has been stored.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="wrap two-col">
        <div>
          <h1 className="display-76">Apply</h1>
          <p className="lead" style={{ marginTop: 24 }}>
            Five questions, a stage name and one contact address. No identity documents are collected here; those come
            later, in person, if we work together.
          </p>
          <p className="quiet">
            Stored encrypted, read only by the founder, and deleted after 90 days if we do not go ahead.{' '}
            <Link className="text-link" href="/legal/privacy">Privacy and retention</Link>
          </p>
        </div>

        <div>
          <ol className="step-list mono" aria-label="Application steps">
            {steps.map((s, i) => <li key={s} aria-current={i === 0 ? 'step' : undefined}>{String(i + 1).padStart(2, '0')} {s}</li>)}
          </ol>

          {!open ? (
            <div className="notice-box" role="status" style={{ marginBottom: 32 }}>
              <p style={{ marginBottom: 8 }}><GateChip status={g0.status} checked={g0.checked} /></p>
              <p style={{ margin: 0 }}>{g0.explanation} The form is shown so you can see what will be asked.</p>
            </div>
          ) : null}
          {q.invalid ? <div className="notice-box error" role="alert" style={{ marginBottom: 32 }}>Please add a stage name, a valid email address and your consent.</div> : null}
          {q.error ? <div className="notice-box error" role="alert" style={{ marginBottom: 32 }}>The application could not be saved. Please try again in a few minutes.</div> : null}
          {q.closed ? <div className="notice-box error" role="alert" style={{ marginBottom: 32 }}>Applications are not open yet.</div> : null}

          <form method="post" action="/api/apply" className="form">
            <fieldset disabled={!open}>
              <legend>01 Eligibility</legend>
              <div className="field" role="radiogroup" aria-labelledby="q-adult">
                <span id="q-adult" className="label">Are you 18 or older?</span>
                <label className="choice"><input type="radio" name="adult" value="yes" required /> Yes</label>
                <label className="choice"><input type="radio" name="adult" value="no" /> No</label>
              </div>
              <div className="field" role="radiogroup" aria-labelledby="q-dc">
                <span id="q-dc" className="label">Are you based in DC, Maryland or Virginia, within commuting distance of DC?</span>
                <label className="choice"><input type="radio" name="dcMetro" value="yes" /> Yes</label>
                <label className="choice"><input type="radio" name="dcMetro" value="no" /> No</label>
              </div>
              <div className="field" role="radiogroup" aria-labelledby="q-ex">
                <span id="q-ex" className="label">Are you free of any exclusive agreement with another agency?</span>
                <label className="choice"><input type="radio" name="noExclusive" value="yes" /> Yes</label>
                <label className="choice"><input type="radio" name="noExclusive" value="no" /> No</label>
              </div>
            </fieldset>

            <fieldset disabled={!open}>
              <legend>02 Five questions</legend>
              <div className="field"><label htmlFor="creating">1. What do you create now, if anything?</label><textarea id="creating" name="creating" maxLength={600} /></div>
              <div className="field"><label htmlFor="platforms">2. Which platforms do you use or plan to use?</label><input id="platforms" name="platforms" type="text" maxLength={600} /></div>
              <div className="field"><label htmlFor="rhythm">3. What posting rhythm would you set for yourself?</label><span className="hint">You set it. Bronze does not.</span><input id="rhythm" name="rhythm" type="text" maxLength={600} /></div>
              <div className="field"><label htmlFor="support">4. What would you want management to take off your hands?</label><textarea id="support" name="support" maxLength={1200} /></div>
              <div className="field"><label htmlFor="other">5. Anything we should know before a call?</label><textarea id="other" name="other" maxLength={1200} /></div>
            </fieldset>

            <fieldset disabled={!open}>
              <legend>03 Contact and consent</legend>
              <div className="field"><label htmlFor="stageName">Stage name</label><span className="hint">The name you work under. We do not ask for your legal name here.</span><input id="stageName" name="stageName" type="text" maxLength={80} required autoComplete="nickname" /></div>
              <div className="field"><label htmlFor="contact">Email address</label><input id="contact" name="contact" type="email" maxLength={200} required autoComplete="email" /></div>
              <label className="choice"><input type="checkbox" name="consent" value="yes" required /> I agree that Bronze Standard may store these answers for up to 90 days to review my application.</label>
              <div><button type="submit" className="btn">Send application</button></div>
            </fieldset>
          </form>
        </div>
      </div>
    </section>
  );
}
