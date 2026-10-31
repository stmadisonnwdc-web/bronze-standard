import Link from 'next/link';
import { gate, gateAllows } from '@/lib/guards';
import type { GateId } from '@/content/gates';
import { MagneticLink } from '@/components/motion/MagneticLink';

/** A CTA that is live only when its gate is cleared; otherwise disabled with a one-line reason. */
export function GatedCta({ gateId, href, label, magnetic = false }: { gateId: GateId; href: string; label: string; magnetic?: boolean }) {
  const g = gate(gateId);
  if (gateAllows(gateId)) {
    return magnetic ? <MagneticLink href={href}>{label}</MagneticLink> : <Link href={href} className="btn">{label}</Link>;
  }
  const reason = g.status === 'blocked' ? `${g.title} is blocked.` : g.explanation ?? `Opens when ${g.title.toLowerCase()} clears.`;
  return (
    <span className="gated-cta">
      <span className="btn" aria-disabled="true" role="link" aria-describedby={`cta-${gateId}`}>
        {label}
      </span>
      <span id={`cta-${gateId}`} className="reason">
        {reason} <Link href="/trust#gates" className="text-link">Gate status</Link>
      </span>
    </span>
  );
}
