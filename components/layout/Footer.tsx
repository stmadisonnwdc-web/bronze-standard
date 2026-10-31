import Link from 'next/link';
import { legalNav, primaryNav, site } from '@/content/site';
import { formatDate } from '@/lib/format';
import { ThemeToggle } from './ThemeToggle';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <nav aria-labelledby="f-nav">
          <h2 id="f-nav">Navigation</h2>
          <ul>
            <li><Link href="/">Home</Link></li>
            {primaryNav.map((i) => (
              <li key={i.href}><Link href={i.href}>{i.label}</Link></li>
            ))}
            <li><Link href="/apply">Apply</Link></li>
            <li><Link href="/ledger">Ledger sign-in</Link></li>
          </ul>
        </nav>
        <nav aria-labelledby="f-legal">
          <h2 id="f-legal">Legal</h2>
          <ul>
            {legalNav.map((i) => (
              <li key={i.href}><Link href={i.href}>{i.label}</Link></li>
            ))}
          </ul>
        </nav>
        <div>
          <h2>Version</h2>
          <p className="mono quiet">
            {site.legalName} · {site.city}
            <br />
            Site {site.version} · Updated {formatDate(site.updated)}
          </p>
          <p className="mono quiet">
            <Link href="/changelog">Changelog</Link>
          </p>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
