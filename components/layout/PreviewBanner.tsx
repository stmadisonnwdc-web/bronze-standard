import Link from 'next/link';
import { isSitePublic } from '@/lib/guards';

/** Shown until Gate 6 clears and SITE_PUBLIC=true. The site is noindex throughout preview. */
export function PreviewBanner() {
  if (isSitePublic()) return null;
  return (
    <div className="preview-banner" role="note">
      Preview for counsel review. This site is not public. <Link href="/trust#gates">Gate 6</Link> is open.
    </div>
  );
}
