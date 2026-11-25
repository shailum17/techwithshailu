import { describe, it, expect, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { clientIp, rateLimit } from '@/lib/rateLimit';

function req(ip: string) {
  return new NextRequest('http://localhost/api/x', { headers: { 'x-forwarded-for': ip } });
}

describe('rateLimit', () => {
  it('allows up to the limit, then returns 429 with Retry-After', () => {
    const opts = { limit: 3, windowMs: 60_000, prefix: 'test-a' };
    expect(rateLimit(req('1.1.1.1'), opts)).toBeNull();
    expect(rateLimit(req('1.1.1.1'), opts)).toBeNull();
    expect(rateLimit(req('1.1.1.1'), opts)).toBeNull();
    const blocked = rateLimit(req('1.1.1.1'), opts);
    expect(blocked?.status).toBe(429);
    expect(blocked?.headers.get('Retry-After')).toBe('60');
  });

  it('tracks IPs and prefixes separately', () => {
    const opts = { limit: 1, windowMs: 60_000, prefix: 'test-b' };
    expect(rateLimit(req('2.2.2.2'), opts)).toBeNull();
    expect(rateLimit(req('3.3.3.3'), opts)).toBeNull();
    expect(rateLimit(req('2.2.2.2'), { ...opts, prefix: 'test-c' })).toBeNull();
    expect(rateLimit(req('2.2.2.2'), opts)?.status).toBe(429);
  });

  it('on Vercel, keys on the first address in x-forwarded-for', () => {
    process.env.VERCEL = '1';
    try {
      const opts = { limit: 1, windowMs: 60_000, prefix: 'test-d' };
      expect(rateLimit(req('4.4.4.4, 10.0.0.1'), opts)).toBeNull();
      expect(rateLimit(req('4.4.4.4, 10.0.0.2'), opts)?.status).toBe(429);
    } finally {
      delete process.env.VERCEL;
    }
  });

  it('off Vercel, a spoofed first address does not get a fresh bucket', () => {
    const opts = { limit: 1, windowMs: 60_000, prefix: 'test-e' };
    expect(rateLimit(req('1.0.0.1, 203.0.113.50'), opts)).toBeNull();
    expect(rateLimit(req('1.0.0.2, 203.0.113.50'), opts)?.status).toBe(429);
  });
});

describe('clientIp', () => {
  const r = (h: Record<string, string>) => new NextRequest('http://localhost/api/x', { headers: h });
  afterEach(() => { delete process.env.VERCEL; delete process.env.TRUSTED_PROXY_HOPS; });

  it('off Vercel, ignores the client-supplied first X-Forwarded-For entry', () => {
    // client sent "6.6.6.6", our proxy appended the real peer 203.0.113.5
    expect(clientIp(r({ 'x-forwarded-for': '6.6.6.6, 203.0.113.5' }))).toBe('203.0.113.5');
  });

  it('honours TRUSTED_PROXY_HOPS for chains of proxies', () => {
    process.env.TRUSTED_PROXY_HOPS = '2';
    expect(clientIp(r({ 'x-forwarded-for': '6.6.6.6, 198.51.100.1, 10.0.0.2' }))).toBe('198.51.100.1');
  });

  it('on Vercel, uses the first entry (the platform overwrites the header)', () => {
    process.env.VERCEL = '1';
    expect(clientIp(r({ 'x-forwarded-for': '203.0.113.9, 10.0.0.1' }))).toBe('203.0.113.9');
  });

  it('falls back to x-real-ip, then "anonymous"', () => {
    expect(clientIp(r({ 'x-real-ip': '192.0.2.4' }))).toBe('192.0.2.4');
    expect(clientIp(r({}))).toBe('anonymous');
  });
});
