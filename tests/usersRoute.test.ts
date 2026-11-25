import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NextRequest } from 'next/server';

const users: { email: string }[] = [];
vi.mock('@/lib/supabase', () => ({
  supabaseAdmin: {
    // No rate_limits table in tests → shared limiter falls back to in-memory
    rpc: async () => ({ data: null, error: { message: 'no db' } }),
    from: () => ({
      select: () => ({
        eq: (_c: string, email: string) => ({
          maybeSingle: async () => ({ data: users.find(u => u.email === email) ?? null, error: null }),
        }),
      }),
      insert: async (row: { email: string }) => { users.push(row); return { error: null }; },
    }),
  },
  supabase: {},
}));

import { POST } from '@/app/api/users/route';

let ipN = 0;
const post = (body: unknown, ip = `100.64.0.${++ipN}`) =>
  POST(new NextRequest('http://localhost/api/users', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
    body: JSON.stringify(body),
  }));

beforeEach(() => { users.length = 0; });

describe('POST /api/users', () => {
  it('answers identically for new and existing emails and never echoes the row', async () => {
    const first  = await post({ email: 'Student@Example.com', role: 'admin' });
    const second = await post({ email: 'student@example.com' });
    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    expect(await first.json()).toEqual(await second.json());
    expect(users).toHaveLength(1);
    expect(users[0]).toMatchObject({ email: 'student@example.com', role: 'user' });
  });

  it('validates the email', async () => {
    expect((await post({ email: 'nope' })).status).toBe(400);
    expect((await post({ email: 42 })).status).toBe(400);
  });

  it('rate-limits repeated signups from one IP', async () => {
    const statuses = [];
    for (let i = 0; i < 6; i++) statuses.push((await post({ email: `u${i}@example.com` }, '100.64.9.9')).status);
    expect(statuses.slice(0, 5).every(s => s === 200)).toBe(true);
    expect(statuses[5]).toBe(429);
  });
});
