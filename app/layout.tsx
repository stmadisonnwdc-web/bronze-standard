import type { Metadata, Viewport } from 'next';
import { Fraunces, Geist, Geist_Mono, Instrument_Serif } from 'next/font/google';
import { cookies } from 'next/headers';
import './globals.css';
import { site } from '@/content/site';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AgeNotice, ACK_COOKIE } from '@/components/layout/AgeNotice';
import { SmoothScroll } from '@/components/layout/SmoothScroll';
import { PreviewBanner } from '@/components/layout/PreviewBanner';
import { JsonLd } from '@/components/layout/JsonLd';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { isSitePublic } from '@/lib/guards';

// next/font downloads these at build time and serves them from this origin (self-hosted, Latin subset).
// All four are SIL Open Font License.
const fraunces = Fraunces({ subsets: ['latin'], axes: ['opsz'], variable: '--font-fraunces', display: 'swap', preload: true });
const instrument = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-instrument', display: 'swap', preload: false });
// Headline and body faces are preloaded (deferring the body face measured CLS 0.10 on mobile);
// the mono face is small type only and swaps in without a preload.
const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans', display: 'swap', preload: true });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono', display: 'swap', preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.city}`, template: `%s — ${site.name}` },
  description: site.description,
  alternates: { canonical: '/' },
  openGraph: { siteName: site.name, type: 'website', locale: 'en_US' },
  robots: isSitePublic() ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F6F3EE' },
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0B' },
  ],
};

// Runs before paint: marks JS present (enables reveal styles) and applies a stored theme choice.
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');try{var t=localStorage.getItem('bs-theme');if(t==='light'||t==='dark')d.setAttribute('data-theme',t);}catch(e){}})();`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const acknowledged = (await cookies()).get(ACK_COOKIE)?.value === '1';
  const fonts = [fraunces.variable, instrument.variable, geistSans.variable, geistMono.variable].join(' ');

  return (
    <html lang="en" className={fonts} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@graph': [
              { '@type': 'Organization', name: site.legalName, url: site.url, description: site.description, address: { '@type': 'PostalAddress', addressLocality: 'Washington', addressRegion: 'DC', addressCountry: 'US' } },
              { '@type': 'WebSite', name: site.name, url: site.url },
            ],
          }}
        />
      </head>
      <body>
        <a href="#main" className="skip">Skip to content</a>
        {/* While the 18+ notice is open, the page beneath is inert: not focusable, not clickable. */}
        <div inert={!acknowledged}>
          <Header />
          <PreviewBanner />
          <main id="main" tabIndex={-1}>{children}</main>
          <Footer />
        </div>
        <div className="scroll-rail" aria-hidden="true"><span /></div>
        <AgeNotice />
        <CommandPalette />
        <SmoothScroll />
      </body>
    </html>
  );
}
