import type { MetadataRoute } from 'next';
import { site } from '@/content/site';
import { legalDocs } from '@/content/legal';
import { talent } from '@/content/roster';
import { isIndexable, isSitePublic } from '@/lib/guards';

export default function sitemap(): MetadataRoute.Sitemap {
  if (!isSitePublic()) return [];
  const base = ['/', '/baseline', '/roster', '/method', '/trust', '/apply', '/takedown', '/changelog'];
  return [
    ...base.map((p) => ({ url: `${site.url}${p}`, lastModified: site.updated })),
    ...legalDocs.map((d) => ({ url: `${site.url}/legal/${d.slug}`, lastModified: d.updated })),
    ...talent.filter(isIndexable).map((t) => ({ url: `${site.url}/roster/${t.slug}`, lastModified: site.updated })),
  ];
}
