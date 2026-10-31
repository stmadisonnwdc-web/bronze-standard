import type { Metadata } from 'next';
import { gates, promises } from '@/content/gates';
import { site } from '@/content/site';
import { GateChip } from '@/components/ui/GateChip';
import { TiltCard } from '@/components/motion/TiltCard';
import { Reveal } from '@/components/motion/Reveal';

export const metadata: Metadata = {
  title: 'Trust',
  description: 'Records custody, takedown, ledger and offboarding promises, and the status of every gate.',
  alternates: { canonical: '/trust' },
};

export default function TrustPage() {
  const cleared = gates.filter((g) => g.status === 'cleared').length;
  return (
    <>
      <section className="section">
        <div className="wrap">
          <p className="eyebrow mono"><span className="idx">{cleared}/{gates.length}</span> Gates cleared</p>
          <Reveal as="h1" lines={['Promises first.', 'Then the work.']} className="display-76" />
          <p className="lead" style={{ marginTop: 32 }}>
            What Bronze Standard commits to, in plain language, and the legal and operational gates that must clear before
            each part of the agency opens.
          </p>
        </div>
      </section>

      <section className="section" aria-labelledby="promises" id="promises-section">
        <div className="wrap">
          <h2 id="promises" className="display-36" style={{ marginBottom: 32 }}>Promises</h2>
          <div className="grid-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
            {promises.map((p) => (
              <TiltCard key={p.title}>
                <h3>{p.title}</h3>
                <p className="quiet">{p.body}</p>
              </TiltCard>
            ))}
          </div>
          <p className="mono quiet" style={{ marginTop: 32 }}>Records custodian: {site.custodianStatement}</p>
        </div>
      </section>

      <section className="section" aria-labelledby="gates">
        <div className="wrap">
          <h2 id="gates" className="display-36" style={{ marginBottom: 32 }}>Gates</h2>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr><th scope="col">Gate</th><th scope="col">Requirement</th><th scope="col">Owner</th><th scope="col">Blocks</th><th scope="col">Status</th></tr>
              </thead>
              <tbody>
                {gates.map((g) => (
                  <tr key={g.id}>
                    <td className="mono">{g.id}<br /><span style={{ textTransform: 'none', fontFamily: 'var(--font-sans)' }}>{g.title}</span></td>
                    <td>{g.requirement}</td>
                    <td className="quiet">{g.owner}</td>
                    <td className="quiet">{g.blocks}</td>
                    <td><GateChip status={g.status} checked={g.checked} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="quiet" style={{ marginTop: 24 }}>
            Insurance is not claimed until it is bound. No coverage is in place as of the date shown.
          </p>
        </div>
      </section>
    </>
  );
}
