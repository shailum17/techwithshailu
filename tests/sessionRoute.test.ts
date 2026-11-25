import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { fakeDb as db } from './helpers/fakeSupabase';

vi.mock('@/lib/supabase', async () => {
  const { fakeDb } = await import('./helpers/fakeSupabase');
  return { supabase: fakeDb.client, supabaseAdmin: fakeDb.client };
});

import { DELETE, POST } from '@/app/api/admin/session/route';
import { ADMIN_SESSION_COOKIE, createSessionToken } from '@/lib/adminSession';
import { checkAdminAuth } from '@/lib/adminAuth';

const SECRET = 'admin-secret';
let ip = 0;
const req = (method: string, init: { cookie?: string; body?: unknown } = {}) =>
  new NextRequest('https://techwithshailu.in/api/admin/session', {
    method,
    headers: {
      host: 'techwithshailu.in',
      origin: 'https://techwithshailu.in',
      'content-type': 'application/json',
      'x-forwarded-for': `10.50.0.${++ip}`,
      ...(init.cookie ? { cookie: `${ADMIN_SESSION_COOKIE}=${init.cookie}` } : {}),
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });
const epochRow = (epoch: number) => ({ data: { value: { epoch } }, error: null });

beforeEach(() => {
  process.env.ADMIN_SECRET = SECRET;
  db.reset();
});

describe('/api/admin/session', () => {
  it('login issues a token for the current epoch', async () => {
    db.queue(epochRow(5));
    const res = await POST(req('POST', { body: { key: SECRET } }));
    expect(res.status).toBe(200);
    const token = res.cookies.get(ADMIN_SESSION_COOKIE)?.value ?? '';
    expect(token.split('.')[1]).toBe('5');
  });

  it('logout with a valid session bumps the epoch, revoking old tokens', async () => {
    const token = createSessionToken(SECRET, Date.now(), 0);
    db.queue(epochRow(0), epochRow(0), { data: null, error: null }); // auth read, bump read, upsert
    const res = await DELETE(req('DELETE', { cookie: token }));
    expect((await res.json()).revoked).toBe(true);
    const upsert = db.of('upsert')[0].args[0] as { key: string; value: { epoch: number } };
    expect(upsert).toMatchObject({ key: 'admin_session', value: { epoch: 1 } });

    // The same token is now rejected
    db.queue(epochRow(1));
    const r = new NextRequest('https://techwithshailu.in/api/admin/x', {
      headers: { cookie: `${ADMIN_SESSION_COOKIE}=${token}`, 'x-forwarded-for': '10.50.1.1' },
    });
    expect((await checkAdminAuth(r))?.status).toBe(401);
  });

  it('logout without a session only clears the cookie', async () => {
    const res = await DELETE(req('DELETE'));
    expect((await res.json()).revoked).toBe(false);
    expect(db.of('upsert')).toHaveLength(0);
  });
});
