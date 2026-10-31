export interface SopEntry {
  id: string;
  title: string;
  trigger: string;
  owner: string;
  timeMinutes: number | null;
  failureMode: string;
  steps: string[];
}

/** The 13 standard operating procedures. Times are null (em dash) until measured in the pilot. */
export const sops: SopEntry[] = [
  { id: 'SOP-01', title: 'Screening call', trigger: 'Application accepted for review', owner: 'Founder', timeMinutes: 20, failureMode: 'More than three calls in a week', steps: ['Confirm the applicant is 18 or older and holds government photo ID.', 'Confirm no conflicting exclusive agreement.', 'Explain commission, the Floor and exit terms.', 'Record the outcome the same day.'] },
  { id: 'SOP-02', title: 'Onboarding packet', trigger: 'Applicant accepted', owner: 'Founder', timeMinutes: null, failureMode: 'A partial packet is accepted', steps: ['Send all six documents together.', 'Accept the packet only when all six are returned.', 'Log the return date.'] },
  { id: 'SOP-03', title: '2257 file', trigger: 'Complete packet returned', owner: 'Custodian', timeMinutes: null, failureMode: 'Any shoot without a complete file', steps: ['Verify identity against government photo ID.', 'Record date of birth twice, independently.', 'Write the encrypted backup and update the index.', 'Record the access in the log.', 'Finish within 24 hours of packet return.'] },
  { id: 'SOP-04', title: 'Editorial shoot', trigger: 'File complete and insurance bound', owner: 'Founder', timeMinutes: null, failureMode: 'Shoot scheduled before the file is complete', steps: ['Confirm the file and every co-performer file.', 'Shoot one day per quarter.', 'Grade and deliver 12 selects within 72 hours.'] },
  { id: 'SOP-05', title: 'Profile build', trigger: 'Selects delivered', owner: 'Founder', timeMinutes: null, failureMode: 'Profile live later than 5 days after the shoot', steps: ['Write the bio in house voice, with the talent.', 'Place 12 images, cross-links and QR code.', 'Confirm the talent’s visibility tier.', 'Record the live date as Day 0.'] },
  { id: 'SOP-06', title: 'Messaging sweep', trigger: 'Scheduled daily', owner: 'Founder or assistant', timeMinutes: null, failureMode: 'A message unanswered after 12 hours', steps: ['Answer from approved templates only.', 'Escalate anything outside the templates to the talent.', 'Log time spent; an assistant is added past 140 minutes a week for two weeks.'] },
  { id: 'SOP-07', title: 'Engagement intake', trigger: 'Enquiry received (after Gate 1)', owner: 'Founder', timeMinutes: null, failureMode: 'Intake outside an approved category', steps: ['Check the enquiry against the approved categories.', 'Decline anything else in writing.', 'Quote only from the talent’s published band.'] },
  { id: 'SOP-08', title: 'Deposit', trigger: 'Engagement accepted (after Gates 1 and 3)', owner: 'Founder', timeMinutes: null, failureMode: 'Funds through a personal account', steps: ['Take a 25% deposit through the approved processor.', 'Segregate deposits from operating funds.', 'Record the deposit in the Ledger.'] },
  { id: 'SOP-09', title: 'Confirmation and follow-up', trigger: 'Deposit received', owner: 'Founder', timeMinutes: null, failureMode: 'Engagement without written confirmation', steps: ['Confirm scope, date and terms in writing.', 'Follow up within two days after the engagement.'] },
  { id: 'SOP-10', title: 'Ledger update', trigger: 'Weekly', owner: 'Founder', timeMinutes: null, failureMode: 'Ledger more than 7 days out of date', steps: ['Enter Net Receipts from payout statements.', 'Calculate commission at the contract rate.', 'Publish to the talent’s private view.', 'Invoice commission monthly.'] },
  { id: 'SOP-11', title: 'Takedown', trigger: 'Request received', owner: 'Custodian', timeMinutes: null, failureMode: 'Removal from a Bronze surface later than 24 hours', steps: ['Acknowledge with the case ID.', 'Remove from Bronze surfaces within 24 hours.', 'File requests with other platforms within 24 hours.', 'Close the case with timestamps.'] },
  { id: 'SOP-12', title: 'Floor review', trigger: 'Day 85', owner: 'Founder', timeMinutes: null, failureMode: 'Written decision later than Day 90', steps: ['Check whether the talent met their own posting target.', 'Check month-three Net Receipts against the $300 Floor.', 'Decide: extend 30 days, or release without penalty.', 'Deliver the decision in writing by Day 90.'] },
  { id: 'SOP-13', title: 'Offboarding', trigger: 'Talent leaves or is released', owner: 'Founder; custodian', timeMinutes: null, failureMode: 'Assets or record copy not returned', steps: ['Return raw assets.', 'Provide a copy of the 2257 file; retain the original as required.', 'Remove the profile from Bronze surfaces.', 'Keep the exit in the Baseline denominator.'] },
];
