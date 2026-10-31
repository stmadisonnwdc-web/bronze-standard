export type GateStatus = 'open' | 'cleared' | 'blocked';
export type GateId = 'G0' | 'G1' | 'G2' | 'G3' | 'G4' | 'G5' | 'G6' | 'G7' | 'G8';

export interface Gate {
  id: GateId;
  title: string;
  requirement: string;
  owner: string;
  blocks: string;
  status: GateStatus;
  checked: string;
  explanation?: string;
}

/** Gate status snapshot (Business Plan v2.1, Part I.E). Update `status` and `checked` as evidence is filed. */
export const gates: Gate[] = [
  { id: 'G0', title: 'Agreement and classification', requirement: 'Counsel sign-off on the Talent Agreement, contractor classification, arbitration, non-solicitation and Baseline disclosures.', owner: 'Counsel', blocks: 'Applications and onboarding', status: 'open', checked: '2026-10-30', explanation: 'Applications open once counsel signs off on the Talent Agreement.' },
  { id: 'G1', title: 'Lawful engagements', requirement: 'Written opinion on each engagement category and the deposit flow.', owner: 'Counsel', blocks: 'Engagement intake', status: 'open', checked: '2026-10-30' },
  { id: 'G2', title: 'Records custody', requirement: 'Custodian appointed in writing; encrypted records live; index audited; producer status confirmed.', owner: 'Founder; counsel', blocks: 'Any shoot', status: 'open', checked: '2026-10-30' },
  { id: 'G3', title: 'Payments and tax', requirement: 'Processor approved; no personal accounts; tax set-up confirmed by a CPA.', owner: 'Founder; CPA', blocks: 'Any money moving', status: 'open', checked: '2026-10-30' },
  { id: 'G4', title: 'Data protection', requirement: 'Access-controlled storage, breach response and retention schedule.', owner: 'Founder', blocks: 'Onboarding', status: 'open', checked: '2026-10-30' },
  { id: 'G5', title: 'Insurance', requirement: 'Coverage quoted, then bound before the first shoot. No coverage is claimed until bound.', owner: 'Founder; broker', blocks: 'First shoot', status: 'open', checked: '2026-10-30' },
  { id: 'G6', title: 'Public page', requirement: 'Baseline methodology and version log approved; website review complete.', owner: 'Counsel', blocks: 'Public launch of this site', status: 'open', checked: '2026-10-30' },
  { id: 'G7', title: 'Partner documents', requirement: 'Partner letter and term sheet reviewed; securities analysis delivered.', owner: 'Counsel', blocks: 'Partner contact', status: 'open', checked: '2026-10-30' },
  { id: 'G8', title: 'Training', requirement: 'Founder and any assistant trained on the SOPs, takedown, 2257 and templates.', owner: 'Founder', blocks: 'Operations', status: 'open', checked: '2026-10-30' },
];

export const promises = [
  { title: 'Records custody', body: 'Every performer has a 2257 file before any shoot: identity verified, date of birth recorded twice, encrypted backup, access log. Bronze keeps the original for the period the law requires. Talent receive a copy.' },
  { title: 'Takedown', body: 'On request, content is removed from Bronze surfaces within 24 hours, without penalty. For other platforms, Bronze files the removal request within 24 hours. Anyone can report non-consensual imagery, with or without an account.' },
  { title: 'Ledger', body: 'Each talent has a private view of their Net Receipts, the commission and what remains, updated weekly. Bronze invoices commission and never holds talent earnings.' },
  { title: 'Offboarding', body: 'Talent may leave at any time. Raw assets and a copy of their records are returned. There is no exit fee.' },
];
