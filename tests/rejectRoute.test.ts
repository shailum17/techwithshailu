import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NextRequest } from 'next/server';

type Row = { id: string; status: string };
const rows: Row[] = [];

vi.mock('@/lib/supabase', () => ({
  supabaseAdmin: {
    rpc: async () => ({ data: null, error: { message: 'no db' } }),
    from: () => ({
      update: (patch: Partial<Row>) => ({
        eq: (_c1: string, id: string) => ({
          eq: (_c2: string, status: string) => ({
            select: async () => {
              const hit = rows.filter(r => r.id === id && r.status === status);
              hit.forEach(r => Object.assign(r, patch));
              return { data: hit.map(r => ({ id: r.id })), error: null };
            },
          }),
        }),
      }),
    }),
  },
}));

import { POST } from '@/app/api/admin/jobs/reject/route';

const call = (jobId: unknown) => POST(new NextRequest('http://localhost/api/admin/jobs/reject', {
  method: 'POST',
  headers: { 'content-type': 'application/json', 'x-admin-key': 'admin-secret', 'x-forwarded-for': '10.7.7.7' },
  body: JSON.stringify({ jobId }),
}));

beforeEach(() => {
  process.env.ADMIN_SECRET = 'admin-secret';
  rows.length = 0;
  rows.push({ id: 'a', status: 'pending' }, { id: 'b', status: 'approved' });
});

describe('POST /api/admin/jobs/reject', () => {
  it('marks a pending job rejected instead of deleting it', async () => {
    expect((await call('a')).status).toBe(200);
    expect(rows).toEqual([{ id: 'a', status: 'rejected' }, { id: 'b', status: 'approved' }]);
  });

  it('404s for unknown or already-reviewed jobs', async () => {
    expect((await call('b')).status).toBe(404);
    expect((await call('zzz')).status).toBe(404);
    expect(rows[1].status).toBe('approved');
  });

  it('requires a jobId', async () => {
    expect((await call(undefined)).status).toBe(400);
  });
});
