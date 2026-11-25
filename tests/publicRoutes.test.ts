import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { fakeDb as db } from './helpers/fakeSupabase';

vi.mock('@/lib/supabase', async () => {
  const { fakeDb } = await import('./helpers/fakeSupabase');
  return { supabase: fakeDb.client, supabaseAdmin: fakeDb.client };
});

import { GET as jobs } from '@/app/api/jobs/route';
import { GET as tools } from '@/app/api/tools/route';
import { GET as blogs } from '@/app/api/blogs/route';
import { GET as roadmaps } from '@/app/api/roadmaps/route';
import { GET as users } from '@/app/api/users/route';

let ip = 0;
const get = (path: string, extra: Record<string, string> = {}) =>
  new NextRequest(`http://localhost${path}`, { headers: { 'x-forwarded-for': `10.30.0.${++ip}`, ...extra } });

beforeEach(() => {
  process.env.ADMIN_SECRET = 'admin-secret';
  db.reset();
});

describe('public list routes on database failure', () => {
  it.each([
    ['/api/jobs', jobs],
    ['/api/tools', tools],
    ['/api/blogs', blogs],
    ['/api/roadmaps', roadmaps],
  ])('%s returns 503, not 200 []', async (path, handler) => {
    db.queue({ data: null, error: { message: 'connection refused' } });
    const res = await handler(get(path));
    expect(res.status).toBe(503);
  });

  it('admin GET /api/users returns 503 on failure', async () => {
    db.queue({ data: null, error: { message: 'connection refused' } });
    const res = await users(get('/api/users', { 'x-admin-key': 'admin-secret' }));
    expect(res.status).toBe(503);
  });
});

import { GET as dbCheck } from '@/app/api/db-check/route';

describe('GET /api/db-check', () => {
  it('requires admin auth', async () => {
    expect((await dbCheck(get('/api/db-check'))).status).toBe(401);
    expect(db.of('from')).toHaveLength(0);
  });

  it('pings the database for an admin', async () => {
    db.queue({ data: null, error: null, count: 3 });
    const res = await dbCheck(get('/api/db-check', { 'x-admin-key': 'admin-secret' }));
    expect(res.status).toBe(200);
    expect((await res.json()).ok).toBe(true);
  });
});
