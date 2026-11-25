import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { listSitemapBlogs, listSitemapJobs } from '@/lib/data/public';
import { getRoadmapCategories } from '@/lib/roadmaps';
import { categories as resumeCategories } from '@/app/resources/resume-hub/data';

// Rebuild the sitemap at most once an hour so new jobs/posts show up
export const revalidate = 3600;

type Entry = MetadataRoute.Sitemap[number];
type Freq = Entry['changeFrequency'];

/** Used when the roadmaps table can't be read, so those URLs aren't lost. */
const FALLBACK_ROADMAPS = ['frontend', 'dsa', 'backend', 'system-design', 'aiml', 'devops'];

const STATIC_PAGES: [path: string, freq: Freq, priority: number][] = [
  ['/',                           'daily',   1.0],
  ['/jobs',                       'daily',   0.9],
  ['/ai-tools',                   'weekly',  0.8],
  ['/blog',                       'daily',   0.8],
  ['/resources',                  'weekly',  0.8],
  ['/resources/roadmaps',         'weekly',  0.7],
  ['/resources/resume-hub',       'monthly', 0.6],
  ['/resources/cheat-sheets',     'monthly', 0.6],
  ['/resources/developer-tools',  'monthly', 0.6],
  ['/resources/free-courses',     'monthly', 0.6],
  ['/resources/interview-prep',   'monthly', 0.6],
  ['/resources/project-ideas',    'monthly', 0.6],
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const url = (path: string) => `${SITE_URL}${path === '/' ? '' : path}`;
  const date = (iso?: string) => (iso && !Number.isNaN(Date.parse(iso)) ? new Date(iso) : now);

  // Each source fails independently; static pages are always included.
  const [jobs, blogs, roadmapSlugs] = await Promise.all([
    listSitemapJobs().catch(() => []),
    listSitemapBlogs().catch(() => []),
    getRoadmapCategories()
      .then(cats => (cats.length ? cats.map(c => c.id) : FALLBACK_ROADMAPS))
      .catch(() => FALLBACK_ROADMAPS),
  ]);

  return [
    ...STATIC_PAGES.map(([path, changeFrequency, priority]) => ({
      url: url(path), lastModified: now, changeFrequency, priority,
    })),
    ...roadmapSlugs.map(slug => ({
      url: url(`/resources/roadmaps/${encodeURIComponent(slug)}`),
      lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7,
    })),
    ...resumeCategories.map(c => ({
      url: url(`/resources/resume-hub/${encodeURIComponent(c.id)}`),
      lastModified: now, changeFrequency: 'monthly' as const, priority: 0.5,
    })),
    ...blogs.map(b => ({
      url: url(b.path), lastModified: date(b.lastModified), changeFrequency: 'monthly' as const, priority: 0.7,
    })),
    ...jobs.map(j => ({
      url: url(j.path), lastModified: date(j.lastModified), changeFrequency: 'weekly' as const, priority: 0.6,
    })),
  ];
}
