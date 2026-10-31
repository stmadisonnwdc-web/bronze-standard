import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { legalDocs } from '@/content/legal';
import { formatDate } from '@/lib/format';

type Params = { params: Promise<{ doc: string }> };

export function generateStaticParams() {
  return legalDocs.map((d) => ({ doc: d.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { doc } = await params;
  const d = legalDocs.find((x) => x.slug === doc);
  return d ? { title: d.title, alternates: { canonical: `/legal/${d.slug}` } } : { title: 'Not found' };
}

export default async function LegalPage({ params }: Params) {
  const { doc } = await params;
  const d = legalDocs.find((x) => x.slug === doc);
  if (!d) notFound();
  return (
    <section className="section">
      <div className="wrap prose">
        <p className="mono quiet">Legal · Updated {formatDate(d.updated)}</p>
        <h1 className="display-52">{d.title}</h1>
        <p className="lead" style={{ marginTop: 24 }}>{d.intro}</p>
        {d.sections.map((s) => (
          <div key={s.heading}>
            <h2>{s.heading}</h2>
            {s.body.map((p) => <p key={p}>{p}</p>)}
          </div>
        ))}
        {d.table ? (
          <>
            <h2>Retention</h2>
            <div className="table-wrap">
              <table className="table">
                <thead><tr>{d.table.head.map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead>
                <tbody>{d.table.rows.map((r) => <tr key={r[0]}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>)}</tbody>
              </table>
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
