export type VisibilityTier = 'public' | 'unlisted' | 'private';
export type TalentStatus = 'pilot' | 'cohort' | 'alumni';

export interface TalentImage { src: string; alt: string; ratio: '4:5' | '3:2' }

export interface Talent {
  slug: string;
  /** Stage name chosen by the talent. Legal names never enter this system. */
  displayName: string;
  bio: string;
  tier: VisibilityTier;
  indexable: boolean;
  images: TalentImage[];
  joinedAt: string;
  status: TalentStatus;
  /** Placeholder profiles exist for layout review only; guards.ts hides them in production. */
  placeholder?: boolean;
}

const placeholderImages = (seed: number): TalentImage[] =>
  Array.from({ length: 12 }, (_, i) => {
    const n = ((seed + i) % 12) + 1;
    return {
      src: `/placeholder/${String(n).padStart(2, '0')}.svg`,
      alt: 'Placeholder composition. Editorial photograph to follow.',
      ratio: i % 5 === 4 ? '3:2' : '4:5',
    };
  });

/** No talent has been onboarded. These six entries are labelled placeholders. */
export const talent: Talent[] = Array.from({ length: 6 }, (_, i) => ({
  slug: `placeholder-${String(i + 1).padStart(2, '0')}`,
  displayName: `[PLACEHOLDER] Profile ${String(i + 1).padStart(2, '0')}`,
  bio: '[PLACEHOLDER] A short bio, written with the talent in house voice: who they are as a creator and what their work is about. Stage name only.',
  tier: 'public',
  indexable: false,
  images: placeholderImages(i * 2),
  joinedAt: '2026-10-30',
  status: 'pilot',
  placeholder: true,
}));
