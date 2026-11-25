import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { fakeDb as db } from './helpers/fakeSupabase';

vi.mock('@/lib/supabase', async () => {
  const { fakeDb } = await import('./helpers/fakeSupabase');
  return { supabase: fakeDb.client, supabaseAdmin: fakeDb.client };
});

import * as jobs from '@/app/api/jobs/[id]/route';
import * as tools from '@/app/api/tools/[id]/route';
import * as roadmaps from '@/app/api/roadmaps/[id]/route';
import * as blogs from '@/app/api/blogs/[id]/route';

const ID = '33333333-3333-4333-8333-333333333333';
let ip = 0;
const call = (
  handler: (r: NextRequest, c: { params: Promise<{ id: string }> }) => Promise<Response>,
  method: string, id: string, body?: unknown,
) => handler(
  new NextRequest(`http://localhost/api/x/${id}`, {
    method,
    headers: { 'content-type': 'application/json', 'x-admin-key': 'admin-secret', 'x-forwarded-for': `10.60.0.${++ip}` },
    body: body === undefined ? undefined : JSON.stringify(body),
  }),
  { params: Promise.resolve({ id }) },
);

beforeEach(() => {
  process.env.ADMIN_SECRET = 'admin-secret';
  db.reset();
});

describe.each([
  ['jobs', jobs],
  ['tools', tools],
  ['roadmaps', roadmaps],
  ['blogs', blogs],
])('/api/%s/[id]', (_name, mod) => {
  it('returns 404 for a non-UUID id without querying the database', async () => {
    expect((await call(mod.PUT, 'PUT', 'nope', { title: 'x' })).status).toBe(404);
    expect((await call(mod.DELETE, 'DELETE', 'nope')).status).toBe(404);
    expect(db.of('from')).toHaveLength(0);
  });

  it('DELETE returns 404 when no row was deleted, 200 when one was', async () => {
    db.queue({ data: [], error: null });
    expect((await call(mod.DELETE, 'DELETE', ID)).status).toBe(404);
    db.queue({ data: [{ id: ID }], error: null });
    expect((await call(mod.DELETE, 'DELETE', ID)).status).toBe(200);
  });
});
