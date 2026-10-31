import Link from 'next/link';
import { home } from '@/content/home';
import { metrics } from '@/content/baseline';
import { gates } from '@/content/gates';
import { listedTalent } from '@/lib/guards';
import { Reveal } from '@/components/motion/Reveal';
import { MagneticLink } from '@/components/motion/MagneticLink';
import { TiltCard } from '@/components/motion/TiltCard';
import { HorizontalRoster } from '@/components/motion/HorizontalRoster';
import { HeroStage } from '@/components/three/HeroStage';
import { MetricTiles } from '@/components/data/Metrics';
import { GateChip } from '@/components/ui/GateChip';
import { GatedCta } from '@/components/ui/GatedCta';
import { RosterCard } from '@/components/data/RosterCard';

export default function HomePage() {
  const roster = listedTalent();
  const cleared = gates.filter((g) => g.status === 'cleared').length;

  return (
    <>
      <section id="hero" className="hero" aria-labelledby="hero-title">
        <div className="hero-poster" aria-hidden="true">
          {/* Art-directed poster: a plain <picture>, since next/image cannot switch sources by breakpoint. */}
          <picture>
            <source media="(max-width: 767px) and (prefers-color-scheme: dark)" srcSet="/poster-mobile-dark.avif" type="image/avif" />
            <source media="(max-width: 767px)" srcSet="/poster-mobile.avif" type="image/avif" />
            <source media="(prefers-color-scheme: dark)" srcSet="/poster-dark.avif" type="image/avif" />
            <source srcSet="/poster.avif" type="image/avif" />
            <img src="/poster.jpg" alt="" width={1600} height={1000} fetchPriority="high" decoding="async" />
          </picture>
        </div>
        <HeroStage sectionId="hero" />
        <div className="wrap">
          <div className="hero-copy">
            <p className="mono quiet">{home.hero.eyebrow}</p>
            <Reveal as="h1" id="hero-title" lines={home.hero.lines} className="display-112" />
            <p className="lead">{home.hero.lead}</p>
            <div className="hero-actions">
              <GatedCta gateId="G0" href="/apply" label="Apply" magnetic />
              <MagneticLink href={home.hero.secondary.href} className="btn ghost">
                {home.hero.secondary.label}
              </MagneticLink>
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="s02">
        <div className="wrap">
          <p className="eyebrow mono"><span className="idx">{home.baseline.index}</span> Baseline</p>
          <div className="two-col">
            <div>
              <Reveal id="s02" lines={home.baseline.title} className="display-52" />
              <p className="lead" style={{ marginTop: 32 }}>{home.baseline.body}</p>
              <p><Link className="text-link" href={home.baseline.link.href}>{home.baseline.link.label}</Link></p>
            </div>
            <MetricTiles metrics={metrics.slice(0, 3)} />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="s03">
        <div className="wrap">
          <p className="eyebrow mono"><span className="idx">{home.roster.index}</span> {home.roster.title}</p>
          {roster.length ? (
            <HorizontalRoster
              count={roster.length}
              heading={
                <div>
                  <h2 id="s03" className="display-52">{home.roster.title}</h2>
                  <p className="quiet" style={{ marginTop: 16 }}>{home.roster.body}</p>
                </div>
              }
            >
              {roster.map((t, i) => <RosterCard key={t.slug} talent={t} index={i} total={roster.length} />)}
            </HorizontalRoster>
          ) : (
            <div>
              <h2 id="s03" className="display-52">{home.roster.title}</h2>
              <p className="lead" style={{ marginTop: 24 }}>The first cohort is in onboarding. Profiles appear when talent choose the public tier.</p>
            </div>
          )}
        </div>
      </section>

      <section className="section" aria-labelledby="s04">
        <div className="wrap">
          <p className="eyebrow mono"><span className="idx">{home.method.index}</span> {home.method.title}</p>
          <h2 id="s04" className="visually-hidden">{home.method.title}</h2>
          <div className="grid-3">
            {home.method.items.map((m) => (
              <TiltCard key={m.title}>
                <h3>{m.title}</h3>
                <p className="quiet">{m.body}</p>
              </TiltCard>
            ))}
          </div>
          <p style={{ marginTop: 32 }}><Link className="text-link" href="/method">All 13 procedures</Link></p>
        </div>
      </section>

      <section className="section" aria-labelledby="s05">
        <div className="wrap two-col">
          <div>
            <p className="eyebrow mono"><span className="idx">{home.trust.index}</span> Trust</p>
            <Reveal id="s05" lines={[home.trust.title]} className="display-52" />
          </div>
          <div>
            <p className="lead">{home.trust.body}</p>
            <p className="mono" style={{ margin: '24px 0' }}>{cleared} of {gates.length} gates cleared</p>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {gates.map((g) => (
                <li key={g.id}><span className="mono quiet">{g.id}</span> <GateChip status={g.status} /></li>
              ))}
            </ul>
            <p style={{ marginTop: 24 }}><Link className="text-link" href={home.trust.link.href}>{home.trust.link.label}</Link></p>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="s06">
        <div className="wrap two-col">
          <div>
            <p className="eyebrow mono"><span className="idx">{home.apply.index}</span> Apply</p>
            <h2 id="s06" className="display-52">{home.apply.title}</h2>
          </div>
          <div>
            <p className="lead">{home.apply.body}</p>
            <div style={{ marginTop: 32 }}>
              <GatedCta gateId="G0" href="/apply" label="Start an application" magnetic />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
