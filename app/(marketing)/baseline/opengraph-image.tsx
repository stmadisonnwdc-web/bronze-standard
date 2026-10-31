import { ogImage, ogSize } from '@/lib/og';

export const size = ogSize;
export const contentType = 'image/png';
export const alt = 'The Baseline: public cohort figures with sample size and method on every line.';

export default function Image() {
  return ogImage('We publish the numbers, including the bad quarters.', 'Baseline');
}
