import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { rateLimit } from '@/lib/rateLimit';

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

  it('uses the first address in x-forwarded-for', () => {
    const opts = { limit: 1, windowMs: 60_000, prefix: 'test-d' };
    expect(rateLimit(req('4.4.4.4, 10.0.0.1'), opts)).toBeNull();
    expect(rateLimit(req('4.4.4.4, 10.0.0.2'), opts)?.status).toBe(429);
  });
});
