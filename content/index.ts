import { sops } from './sops';

/** Search index for the command palette and /search. Every route and major section. */
export interface IndexEntry { title: string; href: string; group: 'Pages' | 'Sections' | 'Legal' | 'Procedures' }

export const searchIndex: IndexEntry[] = [
  { title: 'Home', href: '/', group: 'Pages' },
  { title: 'Baseline', href: '/baseline', group: 'Pages' },
  { title: 'Roster', href: '/roster', group: 'Pages' },
  { title: 'Method', href: '/method', group: 'Pages' },
  { title: 'Trust and gate status', href: '/trust', group: 'Pages' },
  { title: 'Apply', href: '/apply', group: 'Pages' },
  { title: 'Ledger sign-in', href: '/ledger', group: 'Pages' },
  { title: 'Takedown request', href: '/takedown', group: 'Pages' },
  { title: 'Changelog', href: '/changelog', group: 'Pages' },
  { title: 'Baseline — figures', href: '/baseline#figures', group: 'Sections' },
  { title: 'Baseline — methodology', href: '/baseline#methodology', group: 'Sections' },
  { title: 'Baseline — version log', href: '/baseline#versions', group: 'Sections' },
  { title: 'Baseline — questions', href: '/baseline#faq', group: 'Sections' },
  { title: 'Trust — promises', href: '/trust#promises', group: 'Sections' },
  { title: 'Trust — gates', href: '/trust#gates', group: 'Sections' },
  { title: '18+ Notice', href: '/legal/notice', group: 'Legal' },
  { title: 'Privacy and retention', href: '/legal/privacy', group: 'Legal' },
  { title: 'Terms', href: '/legal/terms', group: 'Legal' },
  { title: 'Accessibility', href: '/legal/accessibility', group: 'Legal' },
  ...sops.map((s) => ({ title: `${s.id} ${s.title}`, href: `/method#${s.id.toLowerCase()}`, group: 'Procedures' as const })),
];
