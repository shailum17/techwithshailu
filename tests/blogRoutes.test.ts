import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NextRequest } from 'next/server';

const db = await vi.hoisted(async () => (await import('./helpers/fakeSupabase')).createFakeSupabase());
vi.mock('@/lib/supabase', () => ({ supabase: db.client, supabaseAdmin: db.client }));

import { POST } from '@/app/api/blogs/route';
import { PUT } from '@/app/api/blogs/[id]/route';

const ID = '22222222-2222-2222-2222-222222222222';
let ip = 0;
const headers = () => ({
  'content-type': 'application/json',
  'x-admin-key': 'admin-secret',
  'x-forwarded-for': `10.20.0.${++ip}`,
});
const post = (body: unknown) =>
  POST(new NextRequest('http://localhost/api/blogs', { method: 'POST', headers: headers(), body: JSON.stringify(body) }));
const put = (body: unknown, id = ID) =>
  PUT(new NextRequest(`http://localhost/api/blogs/${id}`, { method: 'PUT', headers: headers(), body: JSON.stringify(body) }),
      { params: Promise.resolve({ id }) });

beforeEach(() => {
  process.env.ADMIN_SECRET = 'admin-secret';
  db.reset();
});

describe('blog writes — published flag', () => {
  it('rejects a non-boolean published on create and update', async () => {
    expect((await post({ title: 'T', slug: 't', published: 'true' })).status).toBe(400);
    expect((await put({ published: 1 })).status).toBe(400);
    expect(db.of('insert')).toHaveLength(0);
    expect(db.of('update')).toHaveLength(0);
  });

  it('accepts a boolean and sets published_at on first publish', async () => {
    db.queue({ data: { id: ID }, error: null });
    expect((await post({ title: 'T', slug: 't', published: true })).status).toBe(201);
    const row = db.of('insert')[0].args[0] as Record<string, unknown>;
    expect(row.published).toBe(true);
    expect(typeof row.published_at).toBe('string');
  });
});
