import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NextRequest } from 'next/server';

const rpc = vi.fn();
vi.mock('@/lib/supabase', () => ({ supabaseAdmin: { rpc: (...a: unknown[]) => rpc(...a) } }));

import { sharedRateLimit } from '@/lib/sharedRateLimit';

const req = (ip = '203.0.113.9') =>
  new NextRequest('http://localhost/api/x', { headers: { 'x-forwarded-for': ip } });

beforeEach(() => rpc.mockReset());

describe('sharedRateLimit', () => {
  it('allows when the database says allowed', async () => {
    rpc.mockResolvedValue({ data: [{ allowed: true, remaining: 4, reset_at: new Date().toISOString() }], error: null });
    expect(await sharedRateLimit(req(), { limit: 5, windowMs: 60_000, prefix: 'p' })).toBeNull();
  });

  it('returns 429 with Retry-After when the database says no', async () => {
    const resetAt = new Date(Date.now() + 30_000).toISOString();
    rpc.mockResolvedValue({ data: [{ allowed: false, remaining: 0, reset_at: resetAt }], error: null });
    const res = await sharedRateLimit(req(), { limit: 5, windowMs: 60_000, prefix: 'p' });
    expect(res?.status).toBe(429);
    expect(Number(res?.headers.get('Retry-After'))).toBeGreaterThan(25);
  });

  it('sends a hashed key (never the raw IP) and the peek flag', async () => {
    rpc.mockResolvedValue({ data: [{ allowed: true, remaining: 1, reset_at: new Date().toISOString() }], error: null });
    await sharedRateLimit(req('198.51.100.77'), { limit: 3, windowMs: 120_000, prefix: 'login', peek: true });
    const [fn, args] = rpc.mock.calls[0];
    expect(fn).toBe('rate_limit_hit');
    expect(args.p_key).toMatch(/^login:/);
    expect(args.p_key).not.toContain('198.51.100.77');
    expect(args).toMatchObject({ p_limit: 3, p_window_seconds: 120, p_peek: true });
  });

  it('falls back to the in-memory limiter when the RPC fails', async () => {
    rpc.mockResolvedValue({ data: null, error: { message: 'function rate_limit_hit does not exist' } });
    const opts = { limit: 2, windowMs: 60_000, prefix: 'fallback' };
    expect(await sharedRateLimit(req('192.0.2.1'), opts)).toBeNull();
    expect(await sharedRateLimit(req('192.0.2.1'), opts)).toBeNull();
    expect((await sharedRateLimit(req('192.0.2.1'), opts))?.status).toBe(429);
  });
});

describe('rateLimitSalt', () => {
  it('prefers RATE_LIMIT_SALT, otherwise derives from ADMIN_SECRET without reusing it', async () => {
    const { rateLimitSalt } = await import('@/lib/sharedRateLimit');
    const saved = { s: process.env.RATE_LIMIT_SALT, a: process.env.ADMIN_SECRET };
    try {
      process.env.RATE_LIMIT_SALT = 'explicit-salt';
      expect(rateLimitSalt()).toBe('explicit-salt');
      delete process.env.RATE_LIMIT_SALT;
      process.env.ADMIN_SECRET = 'the-admin-secret';
      const derived = rateLimitSalt();
      expect(derived).not.toBe('the-admin-secret');
      expect(derived).not.toContain('the-admin-secret');
      expect(rateLimitSalt()).toBe(derived); // stable
    } finally {
      if (saved.s === undefined) delete process.env.RATE_LIMIT_SALT; else process.env.RATE_LIMIT_SALT = saved.s;
      if (saved.a === undefined) delete process.env.ADMIN_SECRET; else process.env.ADMIN_SECRET = saved.a;
    }
  });
});
