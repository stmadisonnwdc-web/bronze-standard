import type { Metadata } from 'next';
import { sops } from '@/content/sops';
import { EM_DASH } from '@/lib/format';
import { Reveal } from '@/components/motion/Reveal';

export const metadata: Metadata = {
  title: 'Method',
  description: 'The thirteen procedures that run Bronze Standard, each with its trigger, owner, time and failure mode.',
  alternates: { canonical: '/method' },
};

export default function MethodPage() {
  return (
    <>
      <section className="section">
        <div className="wrap">
          <p className="eyebrow mono"><span className="idx">13</span> Procedures</p>
          <Reveal as="h1" lines={['The method,', 'written down.']} className="display-76" />
          <p className="lead" style={{ marginTop: 32 }}>
            Every recurring task has a procedure: what starts it, who owns it, how long it takes and how it fails. Times
            show an em dash until they are measured in the pilot.
          </p>
        </div>
      </section>
      <section className="section" aria-label="Procedures">
        <div className="wrap">
          {sops.map((s) => (
            <details key={s.id} id={s.id.toLowerCase()} className="sop">
              <summary>
                <span className="mono accent">{s.id}</span>
                <span className="t">{s.title}</span>
                <span className="plus" aria-hidden="true">+</span>
              </summary>
              <div className="body">
                <dl className="mono">
                  <div><dt>Trigger</dt><dd>{s.trigger}</dd></div>
                  <div><dt>Owner</dt><dd>{s.owner}</dd></div>
                  <div><dt>Time</dt><dd className="tnum">{s.timeMinutes === null ? EM_DASH : `${s.timeMinutes} min`}</dd></div>
                  <div><dt>Failure mode</dt><dd>{s.failureMode}</dd></div>
                </dl>
                <ol>
                  {s.steps.map((step) => <li key={step} style={{ marginBottom: 8 }}>{step}</li>)}
                </ol>
              </div>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
