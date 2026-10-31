import type { MetadataRoute } from 'next';
import { site } from '@/content/site';

/**
 * Nothing is disallowed: private pages carry noindex (meta + X-Robots-Tag), which a crawler
 * can only see if it is allowed to fetch them. Before Gate 6 the whole site is noindex.
 */
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: '*', allow: '/' }], sitemap: `${site.url}/sitemap.xml` };
}
