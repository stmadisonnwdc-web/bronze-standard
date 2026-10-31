import { ogImage, ogSize } from '@/lib/og';

export const size = ogSize;
export const contentType = 'image/png';
export const alt = 'Method: thirteen written procedures.';

export default function Image() {
  return ogImage('The method, written down.', 'Method');
}
