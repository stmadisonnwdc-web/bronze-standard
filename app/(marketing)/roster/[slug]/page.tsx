import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isIndexable, reachableTalent } from '@/lib/guards';
import { Reveal } from '@/components/motion/Reveal';

type Params = { params: Promise<{ slug: string }> };

const tierLabel = { public: 'Public profile', unlisted: 'Unlisted profile', private: 'Private' } as const;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const t = reachableTalent((await params).slug);
  if (!t) return { title: 'Not found', robots: { index: false } };
  return {
    title: t.displayName,
    alternates: { canonical: `/roster/${t.slug}` },
    robots: isIndexable(t) ? undefined : { index: false, follow: false },
  };
}

export default async function TalentPage({ params }: Params) {
  const t = reachableTalent((await params).slug);
  if (!t) notFound();

  return (
    <>
      <section className="section">
        <div className="wrap two-col">
          <div>
            <p className="mono quiet"><Link href="/roster">Roster</Link> / {t.status}</p>
            <Reveal as="h1" lines={[t.displayName]} className="display-52" />
            <p style={{ marginTop: 24 }}>
              <span className="chip" data-status={t.tier === 'public' ? 'cleared' : 'open'}>{tierLabel[t.tier]}</span>
            </p>
          </div>
          <div>
            <p className="lead">{t.bio}</p>
            {t.placeholder ? <p className="mono quiet">Placeholder profile for layout review. Not a real person.</p> : null}
          </div>
        </div>
      </section>
      <section className="section" aria-label="Gallery">
        <div className="wrap gallery">
          {t.images.map((img, i) => (
            <figure key={`${img.src}-${i}`} className={img.ratio === '3:2' ? 'wide' : undefined}>
              <Image
                src={img.src}
                alt={img.alt}
                width={img.ratio === '3:2' ? 1200 : 800}
                height={img.ratio === '3:2' ? 800 : 1000}
                sizes="(min-width: 900px) 33vw, 50vw"
                loading={i < 3 ? 'eager' : 'lazy'}
                unoptimized={img.src.endsWith('.svg')}
              />
            </figure>
          ))}
        </div>
      </section>
    </>
  );
}
