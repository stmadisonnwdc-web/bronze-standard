import type { Metadata } from 'next';
import Link from 'next/link';
import { searchIndex } from '@/content/index';

export const metadata: Metadata = { title: 'Index', robots: { index: false, follow: true } };

/** The no-JavaScript destination of the Search button: the full index as links. */
export default function SearchPage() {
  const groups = ['Pages', 'Sections', 'Procedures', 'Legal'] as const;
  return (
    <section className="section">
      <div className="wrap">
        <h1 className="display-52">Index</h1>
        <p className="lead" style={{ marginTop: 24 }}>Every page, section and procedure. With JavaScript, Ctrl+K or Command+K opens search from any page.</p>
        <div className="grid-3" style={{ marginTop: 48 }}>
          {groups.map((g) => (
            <nav key={g} aria-labelledby={`idx-${g}`}>
              <h2 id={`idx-${g}`} className="mono quiet" style={{ marginBottom: 16 }}>{g}</h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {searchIndex.filter((e) => e.group === g).map((e) => (
                  <li key={e.href}><Link href={e.href} className="text-link" style={{ minHeight: 32 }}>{e.title}</Link></li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>
    </section>
  );
}
