/**
 * app/api/blogs/[id]/route.ts
 *
 * GET    /api/blogs/:id
 * PUT    /api/blogs/:id  (admin only)
 * DELETE /api/blogs/:id  (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { checkAdminAuth } from '@/lib/adminAuth';
import { rateLimit } from '@/lib/rateLimit';
import { sanitizeBlogHtml } from '@/lib/sanitize';
import { pick, checkBlogSlug, validateBlog, BLOG_FIELDS, isUuid, writeErrorStatus } from '@/lib/validate';
import { resolvePublishedAt } from '@/lib/blogPublish';

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const limited = rateLimit(req, { limit: 120, windowMs: 60_000, prefix: 'blogs-id' });
  if (limited) return limited;

  const { id } = await params;
  if (!isUuid(id)) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  try {
    // Use anon client — respects Supabase RLS (published = true policy).
    // Also enforce the filter here as defense-in-depth in case RLS is
    // temporarily disabled or misconfigured.
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', id)
      .eq('published', true)
      .single();
    if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(data);
  } catch (err) {
    console.error('[GET /api/blogs/:id]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const authError = await checkAdminAuth(req);
  if (authError) return authError;

  const { id } = await params;
  if (!isUuid(id)) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  try {
    let raw: unknown;
    try { raw = await req.json(); } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
    const checked = validateBlog(pick(raw, BLOG_FIELDS), true);
    if (!checked.ok) return NextResponse.json({ error: checked.error }, { status: 400 });
    const body = checked.value;

    // Current row: needed to keep published_at on re-publish, and to allow
    // re-saving a legacy slug that predates the slug format rules.
    let current: { published_at: string | null; slug: string } | null = null;
    if ('published' in body || 'slug' in body) {
      const { data, error: curErr } = await supabaseAdmin
        .from('blogs')
        .select('published_at, slug')
        .eq('id', id)
        .maybeSingle();
      if (curErr) throw curErr;
      if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      current = data;
    }
    if ('slug' in body) {
      const slugError = checkBlogSlug(body.slug, current?.slug);
      if (slugError) return NextResponse.json({ error: slugError }, { status: 400 });
    }

    // Sanitize HTML content before storing to prevent XSS
    if (typeof body.content === 'string') {
      body.content = sanitizeBlogHtml(body.content);
    }

    // Set published_at on first publish only — editing a live post keeps its date
    if (current && 'published' in body) {
      const publishedAt = resolvePublishedAt(current.published_at, body.published);
      if (publishedAt !== undefined) body.published_at = publishedAt;
    }

    const { data, error } = await supabaseAdmin
      .from('blogs')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      // .single() on zero rows → PGRST116: the id doesn't exist
      if (error.code === 'PGRST116') return NextResponse.json({ error: 'Not found' }, { status: 404 });
      console.error('[PUT /api/blogs/:id]', error.code, error.message);
      const { status, error: msg } = writeErrorStatus(error);
      return NextResponse.json({ error: msg }, { status });
    }
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(data);
  } catch (err) {
    console.error('[PUT /api/blogs/:id]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const authError = await checkAdminAuth(req);
  if (authError) return authError;

  const { id } = await params;
  if (!isUuid(id)) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  try {
    const { data, error } = await supabaseAdmin
      .from('blogs')
      .delete()
      .eq('id', id)
      .select('id');
    if (error) throw error;
    if (!data?.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[DELETE /api/blogs/:id]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
