import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { fakeDb as db } from './helpers/fakeSupabase';

vi.mock('@/lib/supabase', async () => {
  const { fakeDb } = await import('./helpers/fakeSupabase');
  return { supabase: fakeDb.client, supabaseAdmin: fakeDb.client };
});

import { POST } from '@/app/api/admin/blogs/upload-md/route';

let ip = 0;
function upload(content: string, name = 'post.md') {
  const form = new FormData();
  form.append('file', new File([content], name, { type: 'text/markdown' }));
  return POST(new NextRequest('http://localhost/api/admin/blogs/upload-md', {
    method: 'POST',
    headers: { 'x-admin-key': 'admin-secret', 'x-forwarded-for': `10.40.0.${++ip}` },
    body: form,
  }));
}
const md = (front: string, body = 'Hello') => `---\n${front}\n---\n${body}`;

beforeEach(() => {
  process.env.ADMIN_SECRET = 'admin-secret';
  db.reset();
});

describe('POST /api/admin/blogs/upload-md', () => {
  it('uploads a valid post (case-insensitive .md)', async () => {
    db.queue(
      { data: null, error: null },                                                  // existing-slug lookup
      { data: { id: '1', slug: 'my-post', title: 'T', published: true }, error: null }, // upsert
    );
    const res = await upload(md('title: T\nslug: my-post\npublished: true\ncover_url: https://res.cloudinary.com/x.png'), 'POST.MD');
    expect(res.status).toBe(201);
  });

  it('rejects files over the size limit with 413', async () => {
    const res = await upload(md('title: T\nslug: big', 'x'.repeat(600 * 1024)));
    expect(res.status).toBe(413);
  });

  it('rejects unsafe slugs and cover URLs', async () => {
    expect((await upload(md('title: T\nslug: "../admin?x=1"'))).status).toBe(422);
    expect((await upload(md('title: T\nslug: Has Spaces'))).status).toBe(422);
    expect((await upload(md('title: T\nslug: ok\ncover_url: "javascript:alert(1)"'))).status).toBe(422);
    expect(db.of('upsert')).toHaveLength(0);
  });

  it('requires a string title', async () => {
    expect((await upload(md('title: 2026\nslug: ok'))).status).toBe(422);
  });

  it('only retries without optional columns when a column is actually missing', async () => {
    db.queue(
      { data: null, error: null },
      { data: null, error: { code: '23502', message: 'null value in column "x" violates not-null constraint' } },
    );
    const res = await upload(md('title: T\nslug: ok\ncategory: Tech'));
    expect(res.status).toBe(500);
    expect(db.of('upsert')).toHaveLength(1); // no blind retry
  });

  it.each(['js', 'JS', 'javascript', 'coffee'])('refuses ---%s front-matter without executing it (#3)', async lang => {
    const g = globalThis as { __uploadMdExecuted?: boolean };
    delete g.__uploadMdExecuted;
    const res = await upload(`---${lang}\n{ title: (globalThis.__uploadMdExecuted = true, "T"), slug: "x" }\n---\nbody`);
    expect(res.status).toBe(422);
    expect(g.__uploadMdExecuted).toBeUndefined();
    expect(db.of('upsert')).toHaveLength(0);
  });

  it('returns 422 for malformed YAML', async () => {
    expect((await upload('---\ntitle: [unclosed\n---\nbody')).status).toBe(422);
  });
});
