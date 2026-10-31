'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { primaryNav, site } from '@/content/site';
import { useUI } from '@/lib/state';

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef<HTMLAnchorElement>(null);
  const openPalette = useUI((s) => s.openPalette);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 120);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="site-header" data-scrolled={scrolled}>
      <div className="wrap">
        <Link href="/" className="wordmark" aria-label={`${site.name}, home`}>
          {site.name}
        </Link>
        <nav aria-label="Primary">
          <ul className="nav-index">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={pathname.startsWith(item.href) ? 'page' : undefined}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="header-actions">
          {/* Without JavaScript this is a link to the full index; with it, it opens the palette. */}
          <a
            ref={searchRef}
            href="/search"
            className="search-btn"
            aria-haspopup="dialog"
            onClick={(e) => {
              e.preventDefault();
              openPalette(searchRef.current);
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <circle cx="6" cy="6" r="4.5" fill="none" stroke="currentColor" />
              <path d="M9.5 9.5 13 13" stroke="currentColor" />
            </svg>
            <span>Search</span>
            <kbd aria-hidden="true">⌘K</kbd>
          </a>
          <Link href={site.primaryCta.href} className="btn">
            {site.primaryCta.label}
          </Link>
        </div>
      </div>
    </header>
  );
}
