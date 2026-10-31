import type { Metadata } from 'next';
import { listedTalent, showPlaceholders } from '@/lib/guards';
import { HorizontalRoster } from '@/components/motion/HorizontalRoster';
import { RosterCard } from '@/components/data/RosterCard';

export const metadata: Metadata = {
  title: 'Roster',
  description: 'Talent who have chosen the public tier. Stage names only.',
  alternates: { canonical: '/roster' },
};

export default function RosterPage() {
  const roster = listedTalent();
  const heading = (
    <div>
      <h1 className="display-76">Roster</h1>
      <p className="lead" style={{ marginTop: 24 }}>
        Only talent who choose the public tier appear here, under the stage name they chose. No locations, schedules,
        rates or contact details are shown.
      </p>
    </div>
  );

  return (
    <section className="section">
      <div className="wrap">
        {showPlaceholders() && roster.length ? (
          <p className="chip placeholder-flag" data-status="open">Placeholder profiles · development only</p>
        ) : null}
        {roster.length ? (
          <HorizontalRoster count={roster.length} heading={heading}>
            {roster.map((t, i) => <RosterCard key={t.slug} talent={t} index={i} total={roster.length} />)}
          </HorizontalRoster>
        ) : (
          <>
            {heading}
            <p style={{ marginTop: 48 }}>The first cohort is in onboarding. Profiles appear when talent choose the public tier.</p>
          </>
        )}
      </div>
    </section>
  );
}
