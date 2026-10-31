import { ogImage, ogSize } from '@/lib/og';
import { site } from '@/content/site';

export const size = ogSize;
export const contentType = 'image/png';
export const alt = site.tagline;

export default function Image() {
  return ogImage('The record exists before the frame.', 'Washington, DC');
}
