import 'server-only';
import { talent, type Talent } from '@/content/roster';
import { gates, type Gate, type GateId } from '@/content/gates';

/** Placeholder profiles are never shown unless explicitly enabled (development and design review). */
export function showPlaceholders(): boolean {
  return process.env.SHOW_PLACEHOLDERS === 'true' && process.env.VERCEL_ENV !== 'production';
}

/** Talent visible on /roster: public tier only. */
export function listedTalent(): Talent[] {
  return talent.filter((t) => t.tier === 'public' && (!t.placeholder || showPlaceholders()));
}

/** Talent with a reachable profile page: public or unlisted. Private never renders. */
export function reachableTalent(slug: string): Talent | undefined {
  const t = talent.find((x) => x.slug === slug);
  if (!t || t.tier === 'private') return undefined;
  if (t.placeholder && !showPlaceholders()) return undefined;
  return t;
}

export function isIndexable(t: Talent): boolean {
  return isSitePublic() && t.tier === 'public' && t.indexable && !t.placeholder;
}

export function isSitePublic(): boolean {
  return process.env.SITE_PUBLIC === 'true';
}

export function gate(id: GateId): Gate {
  const g = gates.find((x) => x.id === id);
  if (!g) throw new Error(`Unknown gate ${id}`);
  return g;
}

/** A CTA tied to a gate is live only when that gate is cleared. */
export function gateAllows(id: GateId): boolean {
  return gate(id).status === 'cleared';
}
