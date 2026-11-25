import { describe, it, expect, beforeEach, vi } from 'vitest';

type Call = [string, ...unknown[]];
let calls: Call[] = [];
let result: { data: unknown; error: unknown } = { data: [], error: null };

function builder() {
  const b: Record<string, unknown> = {};
  for (const m of ['select', 'eq', 'ilike', 'textSearch', 'order', 'limit']) {
    b[m] = (...args: unknown[]) => { calls.push([m, ...args]); return b; };
  }
  b.maybeSingle = () => { calls.push(['maybeSingle']); return Promise.resolve(result); };
  b.then = (res: (v: unknown) => unknown, rej: (e: unknown) => unknown) => Promise.resolve(result).then(res, rej);
  return b;
}

vi.mock('@/lib/supabase', () => ({
  supabase: { from: (t: string) => { calls.push(['from', t]); return builder(); } },
}));

import { listLiveJobs, getLiveJob, listTools, featuredOrLatest } from '@/lib/data/public';

beforeEach(() => { calls = []; result = { data: [], error: null }; });

describe('listLiveJobs', () => {
  it('always restricts to live jobs and applies filters', async () => {
    await listLiveJobs({ type: 'Internship', location: 'Pune', batchYear: 2026, featured: true, q: 'react', sort: 'deadline', limit: 6 });
    expect(calls).toContainEqual(['from', 'jobs']);
    expect(calls).toContainEqual(['eq', 'status', 'live']);
    expect(calls).toContainEqual(['eq', 'type', 'Internship']);
    expect(calls).toContainEqual(['ilike', 'location', '%Pune%']);
    expect(calls).toContainEqual(['eq', 'batch_year', 2026]);
    expect(calls).toContainEqual(['eq', 'is_featured', true]);
    expect(calls).toContainEqual(['textSearch', 'fts', 'react', { type: 'websearch' }]);
    expect(calls).toContainEqual(['order', 'deadline', { ascending: true }]);
    expect(calls).toContainEqual(['limit', 6]);
  });

  it('ignores an invalid batch year instead of querying NaN', async () => {
    await listLiveJobs({ batchYear: Number('abc') });
    expect(calls.some(c => c[1] === 'batch_year')).toBe(false);
  });

  it('throws on database errors', async () => {
    result = { data: null, error: new Error('db down') };
    await expect(listLiveJobs()).rejects.toThrow('db down');
  });
});

describe('getLiveJob', () => {
  it('returns the row, scoped to live', async () => {
    result = { data: { id: 'j1', title: 'T', company: 'C' }, error: null };
    expect(await getLiveJob('j1')).toMatchObject({ id: 'j1' });
    expect(calls).toContainEqual(['eq', 'status', 'live']);
  });

  it('returns null for missing rows and query errors (e.g. malformed id)', async () => {
    result = { data: null, error: null };
    expect(await getLiveJob('missing')).toBeNull();
    result = { data: null, error: { message: 'invalid input syntax for type uuid' } };
    expect(await getLiveJob('not-a-uuid')).toBeNull();
  });
});

describe('featuredOrLatest', () => {
  it('uses featured items when there are any', async () => {
    const fetcher = vi.fn(async (featured: boolean) => (featured ? ['f'] : ['l']));
    expect(await featuredOrLatest(fetcher)).toEqual(['f']);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('falls back to latest, and to [] on errors', async () => {
    expect(await featuredOrLatest(async f => (f ? [] : ['l']))).toEqual(['l']);
    expect(await featuredOrLatest(async () => { throw new Error('x'); })).toEqual([]);
  });

  it('works with listTools', async () => {
    result = { data: [{ id: 't', name: 'Tool' }], error: null };
    expect(await featuredOrLatest(featured => listTools({ featured, limit: 4 }))).toHaveLength(1);
  });
});
