import type { Metadata } from 'next';
import { changelog } from '@/content/changelog';
import { formatDate } from '@/lib/format';

export const metadata: Metadata = { title: 'Changelog', alternates: { canonical: '/changelog' } };

export default function ChangelogPage() {
  return (
    <section className="section">
      <div className="wrap">
        <h1 className="display-52">Changelog</h1>
        <p className="lead" style={{ marginTop: 24 }}>Every change to this site, newest first. Baseline versions have their own log on the Baseline page.</p>
        <div className="table-wrap" style={{ marginTop: 48 }}>
          <table className="table">
            <thead><tr><th scope="col">Version</th><th scope="col">Date</th><th scope="col">Change</th><th scope="col">Reason</th></tr></thead>
            <tbody>
              {changelog.map((c) => (
                <tr key={c.version}><td className="mono">{c.version}</td><td className="mono">{formatDate(c.date)}</td><td>{c.change}</td><td className="quiet">{c.reason}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
