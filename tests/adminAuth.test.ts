import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// No database in unit tests: the shared limiter's RPC fails and it falls back
// to the in-memory limiter, which these tests exercise.
vi.mock('@/lib/supabase', () => ({
  supabaseAdmin: { rpc: async () => ({ data: null, error: { message: 'no db in tests' } }) },
}));
import { NextRequest } from 'next/server';
import { safeEqual, checkAdminAuth } from '@/lib/adminAuth';

let ipCounter = 0;
function req(headers: Record<string, string> = {}) {
  // Unique IP per request so the admin rate limiter never interferes
  ipCounter++;
  return new NextRequest('http://localhost/api/admin/x', {
    headers: { 'x-forwarded-for': `10.0.0.${ipCounter}`, ...headers },
  });
}

describe('safeEqual', () => {
  it('matches identical strings only', async () => {
    expect(safeEqual('secret', 'secret')).toBe(true);
    expect(safeEqual('secreT', 'secret')).toBe(false);
    expect(safeEqual('short', 'longer-secret')).toBe(false);
    expect(safeEqual('', 'secret')).toBe(false);
  });
});

describe('checkAdminAuth', () => {
  const original = process.env.ADMIN_SECRET;
  beforeEach(() => { process.env.ADMIN_SECRET = 'test-secret'; });
  afterEach(() => { process.env.ADMIN_SECRET = original; });

  it('allows the correct key', async () => {
    expect(await checkAdminAuth(req({ 'x-admin-key': 'test-secret' }))).toBeNull();
  });

  it('rejects a missing or wrong key with 401', async () => {
    expect((await checkAdminAuth(req()))?.status).toBe(401);
    expect((await checkAdminAuth(req({ 'x-admin-key': 'nope' })))?.status).toBe(401);
  });

  it('returns 500 when ADMIN_SECRET is not configured', async () => {
    delete process.env.ADMIN_SECRET;
    expect((await checkAdminAuth(req({ 'x-admin-key': 'anything' })))?.status).toBe(500);
  });

  it('rate-limits repeated attempts from one IP', async () => {
    const headers = { 'x-forwarded-for': '192.168.99.1', 'x-admin-key': 'nope' };
    const statuses: (number | undefined)[] = [];
    for (let i = 0; i < 21; i++) {
      statuses.push((await checkAdminAuth(new NextRequest('http://localhost/api/admin/x', { headers })))?.status);
    }
    expect(statuses.slice(0, 20).every(s => s === 401)).toBe(true);
    expect(statuses[20]).toBe(429);
  });
});
