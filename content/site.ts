/** Brand inputs (Variant A v2.1), filled from Business Plan v2.1. */
export const site = {
  name: 'Bronze Standard',
  legalName: 'Bronze Standard LLC',
  city: 'Washington, DC',
  tagline: 'Compliance, custody and exit rights, in writing before the first frame.',
  description:
    'Bronze Standard is a DC-metro adult content management agency. Talent keep a copy of their records, their raw assets and the right to take content down.',
  primaryCta: { label: 'Apply', href: '/apply' },
  version: '0.1.0',
  updated: '2026-10-30',
  custodianStatement: '[PLACEHOLDER] Records custodian name and address, published once appointed under Gate 2.',
  contactEmail: '[PLACEHOLDER] contact address',
  url: process.env.SITE_URL || 'http://localhost:3000',
} as const;

export const primaryNav = [
  { href: '/baseline', label: 'Baseline' },
  { href: '/roster', label: 'Roster' },
  { href: '/method', label: 'Method' },
  { href: '/trust', label: 'Trust' },
] as const;

export const legalNav = [
  { href: '/legal/notice', label: '18+ Notice' },
  { href: '/legal/privacy', label: 'Privacy and retention' },
  { href: '/legal/terms', label: 'Terms' },
  { href: '/legal/accessibility', label: 'Accessibility' },
  { href: '/takedown', label: 'Takedown requests' },
] as const;
