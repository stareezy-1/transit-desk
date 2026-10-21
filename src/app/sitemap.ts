import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/shared/seo';
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/guide`, changeFrequency: 'monthly', priority: 0.8 },
  ];
}
