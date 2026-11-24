import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL;
  const now = new Date();

  return [
    { url: base, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/jobs`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/ai-tools`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/resources`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/resources/roadmaps/frontend`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/resources/roadmaps/dsa`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/resources/roadmaps/backend`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/resources/roadmaps/system-design`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/resources/roadmaps/aiml`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
  ];
}
