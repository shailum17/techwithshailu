import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fakeDb as db } from './helpers/fakeSupabase';

const adminFrom = vi.hoisted(() => vi.fn());
vi.mock('@/lib/supabase', async () => {
  const { fakeDb } = await import('./helpers/fakeSupabase');
  return { supabase: fakeDb.client, supabaseAdmin: { from: adminFrom } };
});

import { getRoadmapCategories, getRoadmapCategory } from '@/lib/roadmaps';

const row = (slug: string, content: unknown) => ({
  id: slug, title: slug.toUpperCase(), slug, description: 'd', content, tags: [], order: 1,
});

beforeEach(() => { db.reset(); adminFrom.mockReset(); });

describe('lib/roadmaps (#21)', () => {
  it('reads with the anon client, never the service role', async () => {
    db.queue({ data: [row('dsa', {})], error: null }, { data: row('dsa', {}), error: null });
    await getRoadmapCategories();
    await getRoadmapCategory('dsa');
    expect(adminFrom).not.toHaveBeenCalled();
    expect(db.of('from')).toHaveLength(2);
  });

  it('skips one malformed row instead of hiding every roadmap', async () => {
    db.queue({ data: [row('frontend', '{not json'), row('dsa', '{"_meta":{"subtitle":"Algo"}}')], error: null });
    const cats = await getRoadmapCategories();
    expect(cats.map(c => c.id)).toEqual(['dsa']);
    expect(cats[0].subtitle).toBe('Algo');
  });

  it('keeps only http(s) resource links', async () => {
    db.queue({ data: row('web', {
      n1: { title: 'Basics', yt: [{ label: 'ok', url: 'https://youtu.be/x' }, { label: 'bad', url: 'javascript:alert(1)' }],
            web: [{ label: 'rel', url: '/relative' }, { label: 'mdn', url: 'https://developer.mozilla.org' }] },
    }), error: null });
    const cat = await getRoadmapCategory('web');
    expect(cat?.nodeResources?.n1.yt.map(l => l.label)).toEqual(['ok']);
    expect(cat?.nodeResources?.n1.web.map(l => l.label)).toEqual(['mdn']);
  });
});
