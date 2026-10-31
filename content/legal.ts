export interface LegalSection { heading: string; body: string[] }
export interface LegalDoc { slug: string; title: string; updated: string; intro: string; sections: LegalSection[]; table?: { head: string[]; rows: string[][] } }

const updated = '2026-10-30';

export const legalDocs: LegalDoc[] = [
  {
    slug: 'notice',
    title: '18+ Notice',
    updated,
    intro: 'This site concerns an adult content management business. It is intended for people aged 18 or older.',
    sections: [
      { heading: 'What this notice is', body: ['This is a notice and an acknowledgment. It is not age verification, and Bronze Standard does not claim to verify the age of visitors.', 'The site contains no sexually explicit images or text. Talent imagery is editorial.'] },
      { heading: 'How the acknowledgment is stored', body: ['Choosing “I am 18 or older” sets a first-party cookie named bs_ack for 180 days so the notice is not shown again. It contains no personal information.', 'Choosing “Leave” takes you to a neutral page and stores nothing.'] },
    ],
  },
  {
    slug: 'privacy',
    title: 'Privacy and retention',
    updated,
    intro: 'Bronze Standard collects the minimum needed to review an application, handle a takedown request and show talent their own ledger. It uses no third-party analytics, advertising or tracking.',
    sections: [
      { heading: 'What is collected', body: ['Applications: a stage name, one contact address, five answers and your consent. No identity documents, dates of birth, tax forms or bank details are collected here.', 'Takedown requests: a contact address, the asset reference, the reason and the time received.', 'Ledger: talent see their own records after signing in. Sign-in uses a single-use emailed link; the session cookie is HttpOnly and expires after 12 hours.'] },
      { heading: 'How it is protected', body: ['Records are encrypted at rest (AES-256-GCM) and readable only by the founder and the records custodian.', 'Identity and age records required by 18 U.S.C. §2257 are kept in a separate encrypted custody system, not on this website.'] },
      { heading: 'Your choices', body: ['You can ask for your application or takedown record to be deleted at any time, except where the law requires it to be kept. Write to [PLACEHOLDER] privacy contact.'] },
    ],
    table: {
      head: ['Record', 'Kept for', 'Why'],
      rows: [
        ['Application, not accepted', '90 days', 'To answer questions about the decision'],
        ['Application, onboarded', '2 years', 'Onboarding history'],
        ['Takedown case', '3 years', 'Audit of the 24-hour promise'],
        ['Ledger entries', '7 years', 'Tax and audit'],
        ['18+ acknowledgment cookie', '180 days', 'So the notice is not repeated'],
        ['Ledger session cookie', '12 hours', 'Sign-in'],
      ],
    },
  },
  {
    slug: 'terms',
    title: 'Terms of use',
    updated,
    intro: '[PLACEHOLDER] Terms of use, to be drafted by counsel under Gate 6. The points below describe how the site works today.',
    sections: [
      { heading: 'What this site is', body: ['An information site for Bronze Standard LLC, a District of Columbia limited liability company. It is not a booking service, a marketplace or a payment service, and it offers nothing for sale.'] },
      { heading: 'Content', body: ['Profile images and text belong to the talent who appear in them. Do not copy or republish them.'] },
      { heading: 'Governing law', body: ['[PLACEHOLDER] Governing law and dispute terms, as set by counsel.'] },
    ],
  },
  {
    slug: 'accessibility',
    title: 'Accessibility',
    updated,
    intro: 'This site is built to meet WCAG 2.2 Level AA. Conformance is checked with automated tests and a keyboard walkthrough before each release.',
    sections: [
      { heading: 'What to expect', body: ['Every page works without JavaScript. Forms submit as plain HTML.', 'Reduced-motion settings remove parallax, pinned scrolling, 3D motion, page transitions and animated counters.', 'Text meets a 4.5:1 contrast ratio; focus indicators and form borders meet 3:1.', 'The search panel opens with Ctrl+K or Command+K, or the Search button, and closes with Escape.'] },
      { heading: 'Known limitations', body: ['[PLACEHOLDER] Results of the latest audit, with dates.'] },
      { heading: 'Report a problem', body: ['Write to [PLACEHOLDER] accessibility contact. We reply within five working days.'] },
    ],
  },
];
