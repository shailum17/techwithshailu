import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NextRequest } from 'next/server';

const rpc = vi.fn();
const legacy = { inserted: [] as unknown[], updated: [] as unknown[] };
const pending: { row: { deadline: string | null } | null } = { row: { deadline: null } };

vi.mock('@/lib/supabase', () => ({
  supabaseAdmin: {
    rpc: (fn: string, args: unknown) =>
      fn === 'rate_limit_hit' ? Promise.resolve({ data: null, error: { message: 'no db' } }) : rpc(fn, args),
    from: (t: string) => ({
      select: () => ({ eq: () => ({
        eq: () => ({
          single: async () => ({ data: { id: 'x', title: 'P', company: 'C', source: 'unstop' }, error: null }),
        }),
        // deadline lookup before approving (#26)
        maybeSingle: async () => ({ data: pending.row, error: null }),
      }) }),
      insert: async (row: unknown) => { legacy.inserted.push({ t, row }); return { error: null }; },
      update: (patch: unknown) => ({
        eq: async (_c: string, id: string) => { legacy.updated.push({ t, id, patch }); return { error: null }; },
      }),
    }),
  },
}));

import { POST } from '@/app/api/admin/jobs/approve/route';

const ID = '11111111-1111-1111-1111-111111111111';
const call = (body: unknown) => POST(new NextRequest('http://localhost/api/admin/jobs/approve', {
  method: 'POST',
  headers: { 'content-type': 'application/json', 'x-admin-key': 'admin-secret', 'x-forwarded-for': '10.9.9.9' },
  body: JSON.stringify(body),
}));

beforeEach(() => {
  process.env.ADMIN_SECRET = 'admin-secret';
  rpc.mockReset();
  legacy.inserted.length = 0;
  legacy.updated.length = 0;
  pending.row = { deadline: null };
});

describe('POST /api/admin/jobs/approve', () => {
  it('approves atomically via the RPC with only allow-listed overrides', async () => {
    rpc.mockResolvedValue({ data: 'new-id', error: null });
    const res = await call({ jobId: ID, overrides: { title: 'T', status: 'draft', id: 'evil', apply_link: ' https://a.com/x ' } });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true, id: 'new-id' });
    expect(rpc).toHaveBeenCalledWith('approve_pending_job', {
      p_id: ID, p_overrides: { title: 'T', apply_link: 'https://a.com/x' },
    });
  });

  it('maps "pending job not found" to 404', async () => {
    rpc.mockResolvedValue({ data: null, error: { code: 'P0002', message: 'pending job not found' } });
    expect((await call({ jobId: ID })).status).toBe(404);
  });

  it('falls back to the two-step path when the function is not deployed', async () => {
    rpc.mockResolvedValue({ data: null, error: { code: 'PGRST202', message: 'Could not find the function' } });
    const res = await call({ jobId: ID, overrides: { title: 'Edited' } });
    expect(res.status).toBe(200);
    expect(legacy.inserted).toHaveLength(1);
    // pending row is kept and marked approved, not deleted (#2)
    expect(legacy.updated).toEqual([{ t: 'pending_jobs', id: ID, patch: { status: 'approved' } }]);
  });

  it.each([
    [{ jobId: 'not-a-uuid' }, 'jobId'],
    [{ jobId: ID, overrides: { apply_link: 'javascript:alert(1)' } }, 'apply_link'],
    [{ jobId: ID, overrides: { tags: 'a,b' } }, 'tags'],
    [{ jobId: ID, overrides: { deadline: 'soon' } }, 'deadline'],
    [{ jobId: ID, overrides: { batch_year: 2026.5 } }, 'batch_year'],
  ])('rejects invalid input %j', async (body, field) => {
    const res = await call(body);
    expect(res.status).toBe(400);
    expect((await res.json()).error).toContain(field);
    expect(rpc).not.toHaveBeenCalled();
  });

  describe('deadline already passed (#26)', () => {
    it("refuses with 409 when the pending row's deadline has passed, and publishes nothing", async () => {
      pending.row = { deadline: '2020-01-01' };
      const res = await call({ jobId: ID });
      expect(res.status).toBe(409);
      expect((await res.json()).error).toMatch(/deadline \(2020-01-01\) has passed/);
      expect(rpc).not.toHaveBeenCalled();
    });

    it("refuses a past deadline given as an override", async () => {
      const res = await call({ jobId: ID, overrides: { deadline: '2020-01-01' } });
      expect(res.status).toBe(409);
      expect(rpc).not.toHaveBeenCalled();
    });

    it('a future override rescues an expired pending job', async () => {
      pending.row = { deadline: '2020-01-01' };
      rpc.mockResolvedValue({ data: 'new-id', error: null });
      expect((await call({ jobId: ID, overrides: { deadline: '2099-12-31' } })).status).toBe(200);
    });

    it("today's deadline is still open (India date)", async () => {
      const { todayInIndia } = await import('@/lib/jobPipeline');
      pending.row = { deadline: todayInIndia() };
      rpc.mockResolvedValue({ data: 'new-id', error: null });
      expect((await call({ jobId: ID })).status).toBe(200);
    });
  });
});
