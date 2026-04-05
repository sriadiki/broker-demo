import { MetadataRoute } from 'next';
import { getAllSlugs } from '@/lib/cities';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://broker-demo.fly.dev';
  const citySlugs = getAllSlugs();

  const static_pages = [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1.0 },
    { url: `${base}/quote`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${base}/onboarding`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${base}/carriers`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${base}/insurance`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
  ];

  const city_pages = citySlugs.map(slug => ({
    url: `${base}/insurance/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.85,
  }));

  return [...static_pages, ...city_pages];
}
