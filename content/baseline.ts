export interface BaselineMetric {
  key: string;
  label: string;
  value: number | null;
  unit: string;
  n: number;
  note: string;
  methodologyRef: string;
  updatedAt: string;
}

/** v0.1: methodology only. No cohort exists yet, so every value is null (renders as an em dash). */
export const baselineVersion = 'v0.1';

export const metrics: BaselineMetric[] = [
  { key: 'median-net', label: 'Median monthly Net Receipts per active talent', value: null, unit: 'USD', n: 0, note: 'First figures publish in v1.0, after the pilot cohort reaches Day 90.', methodologyRef: 'M2', updatedAt: '2026-10-30' },
  { key: 'retention-90', label: 'Talent still active at Day 90', value: null, unit: '%', n: 0, note: 'Exits stay in the denominator.', methodologyRef: 'M3', updatedAt: '2026-10-30' },
  { key: 'floor-invoked', label: 'Floor reviews resulting in release', value: null, unit: '%', n: 0, note: 'Releases are without penalty.', methodologyRef: 'M4', updatedAt: '2026-10-30' },
  { key: 'records-complete', label: '2257 files complete before first shoot', value: null, unit: '%', n: 0, note: 'Target 100%. Any shortfall is published with its cause.', methodologyRef: 'M5', updatedAt: '2026-10-30' },
  { key: 'takedown-24h', label: 'Takedowns completed on Bronze surfaces within 24 hours', value: null, unit: '%', n: 0, note: 'Counted from receipt of the request.', methodologyRef: 'M6', updatedAt: '2026-10-30' },
  { key: 'commission', label: 'Effective commission on Net Receipts', value: null, unit: '%', n: 0, note: 'Contract rate is 20%, or 12% after 18 months.', methodologyRef: 'M2', updatedAt: '2026-10-30' },
];

export const methodology = [
  { id: 'M1', text: 'The cohort is every talent who signed a Talent Agreement, including those who have since left. n is the number of talent in the figure.' },
  { id: 'M2', text: 'Net Receipts are amounts received by talent after platform fees, refunds and chargebacks, taken from platform payout statements. Medians, not means, because one large month should not describe the group.' },
  { id: 'M3', text: 'Retention counts talent active on Day 90, where Day 0 is the date their profile went live. Talent who left stay in the denominator; nobody is removed for doing badly.' },
  { id: 'M4', text: 'The Floor applies when a talent met their own posting target and month-three Net Receipts were below $300. The threshold is provisional and will be re-set from Cohort 1 data; any change is logged here.' },
  { id: 'M5', text: 'A 2257 file is complete when identity is verified, date of birth is recorded twice, the encrypted backup exists and the index is audited.' },
  { id: 'M6', text: 'Bronze surfaces are accounts, pages and files Bronze controls. For other platforms, Bronze files the removal request within 24 hours; completion there is outside Bronze control and reported separately.' },
  { id: 'M7', text: 'With n below 10, figures are directional. They describe what happened, not what will happen.' },
];

export const versionLog = [
  { version: 'v0.1', date: '2026-10-30', change: 'Methodology and version log published. No figures.', reason: 'Publish the rules before there are numbers to bend them around.' },
];

export const maintenanceRules = [
  'Figures update quarterly, within 30 days of quarter end.',
  'A change to the method is a new version, logged with its reason.',
  'Past versions are never edited. Corrections are new entries.',
  'A missing figure is shown as an em dash with a note, never as zero.',
];

export const faq = [
  { q: 'Why publish numbers that might look bad?', a: 'Because a record that only shows good quarters is advertising. A falling median, published with its reason, is the evidence that the rest can be trusted.' },
  { q: 'Why are there no figures yet?', a: 'The pilot cohort has not reached Day 90. Version 1.0 adds the first figures; until then, every value is an em dash.' },
  { q: 'What does "directional" mean?', a: 'With fewer than ten talent, a single person moves the median. The figures show direction, not a forecast.' },
  { q: 'Who checks the figures?', a: 'The founder prepares them from payout statements; counsel reviews the method under Gate 6 before this page is public. An independent review is planned once the cohort is larger.' },
];
