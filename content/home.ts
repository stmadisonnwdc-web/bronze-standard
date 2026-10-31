export const home = {
  hero: {
    eyebrow: 'Washington, DC',
    lines: ['The record exists', 'before the frame.'],
    lead: 'Bronze Standard manages a small cohort of independent adult content creators. Custody, ledger and exit rights are written down first. The work follows.',
    secondary: { label: 'Read the method', href: '/method' },
  },
  baseline: {
    index: '02',
    title: ['We publish the numbers,', 'including the bad quarters.'],
    body: 'The Baseline is a public record of how the cohort is doing: median receipts, retention and exits. It carries its sample size and its method on every line. When the median falls, it says so.',
    link: { label: 'Open the Baseline', href: '/baseline' },
  },
  roster: {
    index: '03',
    title: 'Roster',
    body: 'Profiles appear only when talent choose the public tier. Stage names only. No locations, schedules or contact details.',
  },
  method: {
    index: '04',
    title: 'Method',
    items: [
      { title: 'Records first', body: 'A 2257 file is created within 24 hours of a complete onboarding packet. No file, no shoot.' },
      { title: 'A ledger you can read', body: 'Each talent has a private view of their receipts, the commission taken and what remains. Commission is 20% of Net Receipts, 12% after 18 months.' },
      { title: 'An exit without penalty', body: 'Talent can leave at any time. Raw assets and a copy of their records go with them.' },
    ],
  },
  trust: {
    index: '05',
    title: 'Before anything opens, a gate clears.',
    body: 'Nine gates stand between this page and a working agency. Each is shown with its status and the date it was checked.',
    link: { label: 'See gate status', href: '/trust' },
  },
  apply: {
    index: '06',
    title: 'Applications',
    body: 'Bronze Standard works with a small cohort in the DC metro. The application takes five questions and stores the minimum.',
  },
} as const;
