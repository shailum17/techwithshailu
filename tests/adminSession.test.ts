import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// No database in unit tests: the shared limiter's RPC fails and it falls back
// to the in-memory limiter, which these tests exercise.
vi.mock('@/lib/supabase', () => ({
  supabaseAdmin: { rpc: async () => ({ data: null, error: { message: 'no db in tests' } }) },
}));
import { NextRequest } from 'next/server';
import { checkAdminAuth } from '@/lib/adminAuth';
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_TTL_SECONDS,
  createSessionToken,
  verifySessionToken,
} from '@/lib/adminSession';

const SECRET = 'test-secret';
let ip = 0;

function req(opts: { method?: string; cookie?: string; headers?: Record<string, string> } = {}) {
  ip++;
  const headers: Record<string, string> = {
    'x-forwarded-for': `172.16.0.${ip}`,
    host: 'techwithshailu.in',
    ...opts.headers,
  };
  if (opts.cookie !== undefined) headers.cookie = `${ADMIN_SESSION_COOKIE}=${opts.cookie}`;
  return new NextRequest('https://techwithshailu.in/api/admin/x', { method: opts.method ?? 'GET', headers });
}

describe('session tokens', () => {
  it('verifies a fresh token', async () => {
    expect(verifySessionToken(createSessionToken(SECRET), SECRET)).toBe(true);
  });

  it('rejects expired, tampered, malformed or foreign tokens', async () => {
    const now = Date.now();
    const token = createSessionToken(SECRET, now);
    const afterExpiry = now + (ADMIN_SESSION_TTL_SECONDS + 1) * 1000;
    expect(verifySessionToken(token, SECRET, afterExpiry)).toBe(false);

    const [exp, epoch, sig] = token.split('.');
    expect(verifySessionToken(`${Number(exp) + 9999}.${epoch}.${sig}`, SECRET)).toBe(false);
    expect(verifySessionToken(`${exp}.${epoch}.${sig}x`, SECRET)).toBe(false);
    expect(verifySessionToken(`${exp}.${sig}`, SECRET)).toBe(false); // old 2-part format
    expect(verifySessionToken('garbage', SECRET)).toBe(false);
    expect(verifySessionToken(undefined, SECRET)).toBe(false);
    expect(verifySessionToken(token, 'rotated-secret')).toBe(false);
  });

  it('is only valid in the epoch it was issued for', () => {
    const now = Date.now();
    const token = createSessionToken(SECRET, now, 3);
    expect(verifySessionToken(token, SECRET, now, 3)).toBe(true);
    expect(verifySessionToken(token, SECRET, now, 4)).toBe(false); // revoked by logout
    const [exp, , sig] = token.split('.');
    expect(verifySessionToken(`${exp}.4.${sig}`, SECRET, now, 4)).toBe(false); // epoch is signed
  });
});

describe('checkAdminAuth with session cookie', () => {
  const original = process.env.ADMIN_SECRET;
  beforeEach(() => { process.env.ADMIN_SECRET = SECRET; });
  afterEach(() => { process.env.ADMIN_SECRET = original; });

  it('accepts a valid cookie for GET and same-origin POST', async () => {
    const token = createSessionToken(SECRET);
    expect(await checkAdminAuth(req({ cookie: token }))).toBeNull();
    expect(await checkAdminAuth(req({
      method: 'POST', cookie: token, headers: { origin: 'https://techwithshailu.in' },
    }))).toBeNull();
  });

  it('rejects cross-origin state-changing requests that rely on the cookie', async () => {
    const token = createSessionToken(SECRET);
    const res = await checkAdminAuth(req({
      method: 'DELETE', cookie: token, headers: { origin: 'https://evil.example' },
    }));
    expect(res?.status).toBe(403);
  });

  it('rejects an invalid cookie with 401', async () => {
    expect((await checkAdminAuth(req({ cookie: 'nope' })))?.status).toBe(401);
  });

  it('does not rate-limit successful requests', async () => {
    const token = createSessionToken(SECRET);
    const headers = { 'x-forwarded-for': '203.0.113.7', cookie: `${ADMIN_SESSION_COOKIE}=${token}` };
    for (let i = 0; i < 50; i++) {
      expect(await checkAdminAuth(new NextRequest('https://techwithshailu.in/api/admin/x', { headers }))).toBeNull();
    }
  });
});
