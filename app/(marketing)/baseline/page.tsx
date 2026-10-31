import type { Metadata } from 'next';
import { baselineVersion, faq, maintenanceRules, metrics, versionLog } from '@/content/baseline';
import { MetricsTable } from '@/components/data/Metrics';
import { Methodology } from '@/components/data/Methodology';
import { Reveal } from '@/components/motion/Reveal';
import { JsonLd } from '@/components/layout/JsonLd';
import { formatDate } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Baseline',
  description: 'Public cohort figures with sample size and method on every line. Version 0.1: methodology only.',
  alternates: { canonical: '/baseline' },
};

export default function BaselinePage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
        }}
      />
      <section className="section" aria-labelledby="b-title">
        <div className="wrap">
          <p className="eyebrow mono"><span className="idx">{baselineVersion}</span> Baseline</p>
          <Reveal as="h1" id="b-title" lines={['The Baseline']} className="display-76" />
          <p className="lead" style={{ marginTop: 32 }}>
            A public record of how the cohort is doing. Every figure carries its sample size and the rule that produced it.
            Version 0.1 publishes the method before there are figures; values appear as an em dash until the pilot cohort
            reaches Day 90.
          </p>
        </div>
      </section>

      <section className="section" aria-labelledby="figures" id="figures-section">
        <div className="wrap">
          <h2 id="figures" className="display-36" style={{ marginBottom: 32 }}>Figures</h2>
          <MetricsTable metrics={metrics} />
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Methodology />
        </div>
      </section>

      <section className="section" aria-labelledby="versions">
        <div className="wrap two-col">
          <div>
            <h2 id="versions" className="display-36">Version log</h2>
          </div>
          <div>
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th scope="col">Version</th><th scope="col">Date</th><th scope="col">Change</th><th scope="col">Reason</th></tr></thead>
                <tbody>
                  {versionLog.map((v) => (
                    <tr key={v.version}><td className="mono">{v.version}</td><td className="mono">{formatDate(v.date)}</td><td>{v.change}</td><td className="quiet">{v.reason}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <h3 className="display-36" style={{ fontSize: 'var(--fs-22)', margin: '48px 0 16px' }}>Maintenance rules</h3>
            <ul>
              {maintenanceRules.map((r) => <li key={r} style={{ marginBottom: 8 }}>{r}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="faq">
        <div className="wrap two-col">
          <h2 id="faq" className="display-36">Questions</h2>
          <div>
            {faq.map((f) => (
              <details key={f.q} className="sop">
                <summary style={{ gridTemplateColumns: '1fr 24px' }}>
                  <span className="t">{f.q}</span>
                  <span className="plus" aria-hidden="true">+</span>
                </summary>
                <div className="body" style={{ paddingLeft: 0 }}><p>{f.a}</p></div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
