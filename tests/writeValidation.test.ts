import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { fakeDb as db } from './helpers/fakeSupabase';
import { validateJob, validateTool, validateBlog, checkBlogSlug, writeErrorStatus } from '@/lib/validate';

vi.mock('@/lib/supabase', async () => {
  const { fakeDb } = await import('./helpers/fakeSupabase');
  return { supabase: fakeDb.client, supabaseAdmin: fakeDb.client };
});

import { POST as createJob } from '@/app/api/jobs/route';
import { PUT as updateJob } from '@/app/api/jobs/[id]/route';
import { POST as createTool } from '@/app/api/tools/route';
import { PUT as updateBlog } from '@/app/api/blogs/[id]/route';

const ID = '44444444-4444-4444-8444-444444444444';
let ip = 0;
const send = (method: string, body: unknown) => new NextRequest('http://localhost/api/x', {
  method,
  headers: { 'content-type': 'application/json', 'x-admin-key': 'admin-secret', 'x-forwarded-for': `10.70.0.${++ip}` },
  body: typeof body === 'string' ? body : JSON.stringify(body),
});
const params = { params: Promise.resolve({ id: ID }) };

beforeEach(() => {
  process.env.ADMIN_SECRET = 'admin-secret';
  db.reset();
});

describe('validators', () => {
  it('jobs: enums, dates, URLs, required fields', () => {
    expect(validateJob({ title: 'T', company: 'C' }).ok).toBe(true);
    expect(validateJob({ company: 'C' }).ok).toBe(false);
    expect(validateJob({ title: 'T', company: 'C', type: 'Fulltime' }).ok).toBe(false);
    expect(validateJob({ title: 'T', company: 'C', status: 'Live' }).ok).toBe(false);
    expect(validateJob({ title: 'T', company: 'C', deadline: '2026-02-30' }).ok).toBe(false);
    expect(validateJob({ title: 'T', company: 'C', logo_url: 'javascript:alert(1)' }).ok).toBe(false);
    expect(validateJob({ title: 'T', company: 'C', batch_year: '2026' }).ok).toBe(false);
    expect(validateJob({ is_featured: true }, true).ok).toBe(true);
    expect(validateJob({ title: '' }, true).ok).toBe(false); // can't blank a required field on update
  });

  it("jobs: '' deadline / optional URLs become null (form sends empty strings)", () => {
    const r = validateJob({ title: 'T', company: 'C', deadline: '', logo_url: '', apply_link: '' });
    expect(r.ok && r.value).toMatchObject({ deadline: null, logo_url: null, apply_link: null });
  });

  it('tools: url is required and must be http(s)', () => {
    expect(validateTool({ name: 'X', url: 'https://x.dev' }).ok).toBe(true);
    expect(validateTool({ name: 'X' }).ok).toBe(false);
    expect(validateTool({ name: 'X', url: 'javascript:alert(1)' }).ok).toBe(false);
    expect(validateTool({ votes: -1 }, true).ok).toBe(false);
  });

  it('blogs: slug format on create; legacy slug may be re-saved unchanged', () => {
    expect(validateBlog({ title: 'T', slug: 'my-post' }).ok).toBe(true);
    expect(validateBlog({ title: 'T', slug: 'My Post' }).ok).toBe(false);
    expect(checkBlogSlug('Old_Slug', 'Old_Slug')).toBeNull();
    expect(checkBlogSlug('Another Bad', 'Old_Slug')).not.toBeNull();
  });

  it('maps DB write errors without leaking messages', () => {
    expect(writeErrorStatus({ code: '23505' }).status).toBe(409);
    expect(writeErrorStatus({ code: '23502' }).status).toBe(400);
    expect(writeErrorStatus({ code: 'XX000' })).toEqual({ status: 503, error: 'Database error' });
  });
});

describe('write routes', () => {
  it('POST /api/jobs accepts the admin form shape (empty deadline) and stores null', async () => {
    db.queue({ data: { id: ID }, error: null });
    const res = await createJob(send('POST', {
      title: 'Dev', company: 'Acme', location: '', type: 'Internship', salary: '',
      apply_link: '', deadline: '', description: '', is_featured: false, tags: [], logo_url: '', banner_url: '',
    }));
    expect(res.status).toBe(201);
    expect((db.of('insert')[0].args[0] as Record<string, unknown>).deadline).toBeNull();
  });

  it('POST /api/jobs rejects bad values with 400 and a message, without touching the DB', async () => {
    const res = await createJob(send('POST', { title: 'Dev', company: 'Acme', type: 'Contract' }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/type/);
    expect(db.of('insert')).toHaveLength(0);
  });

  it('bad JSON is a 400, not a 503', async () => {
    expect((await createJob(send('POST', '{not json'))).status).toBe(400);
  });

  it('PUT /api/jobs/:id returns 404 when the row does not exist', async () => {
    db.queue({ data: null, error: { code: 'PGRST116', message: '0 rows' } });
    expect((await updateJob(send('PUT', { is_featured: true }), params)).status).toBe(404);
  });

  it('POST /api/tools maps a unique violation to 409', async () => {
    db.queue({ data: null, error: { code: '23505', message: 'duplicate key value violates unique constraint "tools_name_key"' } });
    const res = await createTool(send('POST', { name: 'X', url: 'https://x.dev' }));
    expect(res.status).toBe(409);
    expect(JSON.stringify(await res.json())).not.toContain('tools_name_key');
  });

  it('PUT /api/blogs/:id allows re-saving a legacy slug but not a new invalid one', async () => {
    db.queue({ data: { published_at: null, slug: 'Old_Slug' }, error: null }, { data: { id: ID }, error: null });
    expect((await updateBlog(send('PUT', { slug: 'Old_Slug', title: 'T' }), params)).status).toBe(200);

    db.queue({ data: { published_at: null, slug: 'Old_Slug' }, error: null });
    expect((await updateBlog(send('PUT', { slug: 'New Bad Slug' }), params)).status).toBe(400);
  });
});
