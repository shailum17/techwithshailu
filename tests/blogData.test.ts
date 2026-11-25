import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fakeDb as db } from './helpers/fakeSupabase';

vi.mock('@/lib/supabase', async () => {
  const { fakeDb } = await import('./helpers/fakeSupabase');
  return { supabase: fakeDb.client, supabaseAdmin: fakeDb.client };
});

import { getPublishedPost, getSidebarPosts, RELATED_LIMIT, RECENT_POOL } from '@/lib/data/blog';

const post = (slug: string, category = 'Jobs') => ({ id: slug, slug, title: slug, category, content: '', published_at: '2026-01-01' });

beforeEach(() => db.reset());

describe('blog post page data (#20)', () => {
  it('loads the one post by slug, published only', async () => {
    db.queue({ data: post('hello'), error: null });
    expect(await getPublishedPost('hello')).toMatchObject({ slug: 'hello' });
    const eqs = db.of('eq').map(c => c.args);
    expect(eqs).toContainEqual(['slug', 'hello']);
    expect(eqs).toContainEqual(['published', true]);
    expect(db.of('limit')).toHaveLength(0);
    expect(db.of('maybeSingle')).toHaveLength(1);
  });

  it('sidebar queries are bounded and exclude the current post', async () => {
    db.queue(
      { data: [post('r1'), post('r2')], error: null },                           // related
      { data: [post('r1'), post('n1', 'AI'), post('r2'), post('n2', 'AI')], error: null }, // newest others
    );
    const s = await getSidebarPosts('hello', 'Jobs');
    expect(db.of('limit').map(c => c.args[0])).toEqual([RELATED_LIMIT, RECENT_POOL]);
    expect(db.of('neq').map(c => c.args)).toEqual([['slug', 'hello'], ['slug', 'hello']]);
    expect(s.related.map(p => p.slug)).toEqual(['r1', 'r2']);
    expect(s.recent.map(p => p.slug)).toEqual(['n1', 'n2']);           // related ones removed
    expect(s.otherPosts.map(p => p.slug)).toEqual(['r1', 'n1', 'r2', 'n2']);
  });

  it('sidebar degrades to empty lists on errors', async () => {
    db.queue({ data: null, error: { message: 'down' } }, { data: null, error: { message: 'down' } });
    expect(await getSidebarPosts('x', 'Jobs')).toEqual({ related: [], recent: [], otherPosts: [] });
  });
});
