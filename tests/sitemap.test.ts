import { describe, it, expect, vi, beforeEach } from 'vitest';

const jobs  = vi.fn();
const blogs = vi.fn();
const cats  = vi.fn();
vi.mock('@/lib/data/public', () => ({ listSitemapJobs: () => jobs(), listSitemapBlogs: () => blogs() }));
vi.mock('@/lib/roadmaps', () => ({ getRoadmapCategories: () => cats() }));
vi.mock('@/lib/site', () => ({ SITE_URL: 'https://techwithshailu.in' }));

import sitemap from '@/app/sitemap';

beforeEach(() => { jobs.mockReset(); blogs.mockReset(); cats.mockReset(); });

describe('sitemap', () => {
  it('includes static pages, roadmaps, resume-hub categories, blog posts and live jobs', async () => {
    jobs.mockResolvedValue([{ path: '/jobs/abc', lastModified: '2026-11-20T00:00:00Z' }]);
    blogs.mockResolvedValue([{ path: '/blog/how-to-crack-dsa', lastModified: '2026-11-01T00:00:00Z' }]);
    cats.mockResolvedValue([{ id: 'frontend' }, { id: 'dsa' }]);

    const urls = (await sitemap()).map(e => e.url);
    expect(urls).toContain('https://techwithshailu.in');
    expect(urls).toContain('https://techwithshailu.in/resources/cheat-sheets');
    expect(urls).toContain('https://techwithshailu.in/resources/roadmaps/frontend');
    expect(urls).toContain('https://techwithshailu.in/resources/resume-hub/builders');
    expect(urls).toContain('https://techwithshailu.in/blog/how-to-crack-dsa');
    expect(urls).toContain('https://techwithshailu.in/jobs/abc');
    // no legacy /resources/<slug> URLs that only redirect
    expect(urls.some(u => /\/resources\/(frontend|dsa)$/.test(u))).toBe(false);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it('uses each row\'s own lastModified', async () => {
    jobs.mockResolvedValue([{ path: '/jobs/abc', lastModified: '2026-11-20T00:00:00Z' }]);
    blogs.mockResolvedValue([]);
    cats.mockResolvedValue([]);
    const job = (await sitemap()).find(e => e.url.endsWith('/jobs/abc'));
    expect(job?.lastModified).toEqual(new Date('2026-11-20T00:00:00Z'));
  });

  it('still returns static pages and fallback roadmaps when the database is down', async () => {
    jobs.mockRejectedValue(new Error('db down'));
    blogs.mockRejectedValue(new Error('db down'));
    cats.mockRejectedValue(new Error('db down'));
    const urls = (await sitemap()).map(e => e.url);
    expect(urls).toContain('https://techwithshailu.in/jobs');
    expect(urls).toContain('https://techwithshailu.in/resources/roadmaps/system-design');
    expect(urls.some(u => u.includes('/jobs/'))).toBe(false);
  });
});
