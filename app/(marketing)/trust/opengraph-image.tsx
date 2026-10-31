import { ogImage, ogSize } from '@/lib/og';

export const size = ogSize;
export const contentType = 'image/png';
export const alt = 'Trust: promises and gate status.';

export default function Image() {
  return ogImage('Promises first. Then the work.', 'Trust');
}
