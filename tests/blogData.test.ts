import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fakeDb as db } from './helpers/fakeSupabase';

vi.mock('@/lib/supabase', async () => {
  const { fakeDb } = await import('./helpers/fakeSupabase');
  return { supabase: fakeDb.client, supabaseAdmin: fakeDb.client };
});

import { getPublishedPost, getSidebarPosts, listPublishedSummaries, RELATED_LIMIT, RECENT_POOL } from '@/lib/data/blog';

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

  it('sidebar and list rows carry first_image_url, never the post HTML (#25)', async () => {
    db.queue({ data: [], error: null }, { data: [], error: null });
    await getSidebarPosts('hello', 'Jobs');
    const cols = db.of('select').map(c => String(c.args[0]));
    expect(cols.every(c => c.includes('first_image_url') && !c.split(',').includes('content'))).toBe(true);
  });
});

describe('blog list summaries (#25)', () => {
  it('selects summary columns only, newest first', async () => {
    db.queue({ data: [{ slug: 'a', first_image_url: 'https://img/a.png' }], error: null });
    const rows = await listPublishedSummaries();
    expect(rows[0]).toMatchObject({ slug: 'a', first_image_url: 'https://img/a.png' });
    expect(String(db.of('select')[0].args[0]).split(',')).not.toContain('content');
    expect(db.of('order')[0].args).toEqual(['published_at', { ascending: false, nullsFirst: false }]);
  });

  it('before the migration: falls back to content, extracts the image, and drops the HTML', async () => {
    db.queue(
      { data: null, error: { code: '42703', message: 'column blogs.first_image_url does not exist' } },
      { data: [{ slug: 'a', content: '<p>x</p><IMG SRC="https://img/first.png"><img src="https://img/2.png">' },
               { slug: 'b', content: '<p>no image</p>' }], error: null },
    );
    const rows = await listPublishedSummaries();
    expect(rows).toEqual([
      { slug: 'a', first_image_url: 'https://img/first.png' },
      { slug: 'b', first_image_url: null },
    ]);
  });

  it('other errors return an empty list without the fallback query', async () => {
    db.queue({ data: null, error: { code: '57014', message: 'timeout' } });
    expect(await listPublishedSummaries()).toEqual([]);
    expect(db.of('select')).toHaveLength(1);
  });
});
