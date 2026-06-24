import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://techwithshailu.in';
  const now = new Date();

  return [
    { url: base, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/jobs`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/ai-tools`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/resources`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/resources/frontend`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/resources/dsa`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/resources/backend`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/resources/system-design`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/resources/aiml`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
  ];
}
