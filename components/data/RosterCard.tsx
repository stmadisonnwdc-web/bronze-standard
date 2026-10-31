import Image from 'next/image';
import Link from 'next/link';
import type { Talent } from '@/content/roster';
import { pad2 } from '@/lib/format';
import { TiltCard } from '@/components/motion/TiltCard';

export function RosterCard({ talent, index, total }: { talent: Talent; index: number; total: number }) {
  const cover = talent.images[0];
  return (
    <Link href={`/roster/${talent.slug}`} className="roster-card">
      <TiltCard className="frame">
        {cover ? <Image src={cover.src} alt={cover.alt} width={800} height={1000} sizes="(min-width: 768px) 28vw, 50vw" unoptimized={cover.src.endsWith('.svg')} /> : null}
      </TiltCard>
      <div className="meta">
        <span className="name">{talent.displayName}</span>
        <span className="mono quiet">{pad2(index + 1)} / {pad2(total)}</span>
      </div>
    </Link>
  );
}
