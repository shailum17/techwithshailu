import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/supabase', async () => {
  const { fakeDb } = await import('./helpers/fakeSupabase');
  return { supabase: fakeDb.client, supabaseAdmin: fakeDb.client };
});

import { GET } from '@/app/api/admin/debug-fetch/route';

let ip = 0;
const call = (qs: string) => GET(new NextRequest(`http://localhost/api/admin/debug-fetch${qs}`, {
  headers: { 'x-admin-key': 'admin-secret', 'x-forwarded-for': `10.80.0.${++ip}` },
}));

beforeEach(() => { process.env.ADMIN_SECRET = 'admin-secret'; });
afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers(); });

describe('GET /api/admin/debug-fetch', () => {
  it('returns 504 instead of hanging when the source never answers', async () => {
    vi.useFakeTimers();
    vi.stubGlobal('fetch', vi.fn((_u: unknown, init?: RequestInit) => new Promise((_, reject) => {
      init?.signal?.addEventListener('abort', () => reject(Object.assign(new Error('aborted'), { name: 'AbortError' })));
    })));
    const pending = call('?source=unstop');
    await vi.advanceTimersByTimeAsync(8_000);
    const res = await pending;
    expect(res.status).toBe(504);
  });

  it('caps the query sent upstream at 200 characters', async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ data: { data: [] } }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    const res = await call(`?source=unstop&q=${'a'.repeat(5000)}`);
    expect(res.status).toBe(200);
    const sent = new URL(String((fetchMock.mock.calls[0] as unknown[])[0])).searchParams.get('searchTerm');
    expect(sent).toHaveLength(200);
  });

  it('returns 502 when the upstream request fails', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => { throw new TypeError('fetch failed'); }));
    expect((await call('?source=unstop')).status).toBe(502);
  });
});
