/**
 * app/api/blogs/route.ts
 *
 * GET  /api/blogs  — list posts (public, anon client, respects RLS)
 *   ?tag=           filter by tag
 *   ?q=             full-text search
 *   ?published=true only published posts
 *   ?limit= / ?offset=  paging (default 50, max 100)
 *   List rows omit `content`; fetch /api/blogs/:id for the full post.
 *
 * POST /api/blogs  — create post (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { checkAdminAuth } from '@/lib/adminAuth';
import { rateLimit } from '@/lib/rateLimit';
import { sanitizeBlogHtml } from '@/lib/sanitize';
import { clampLimit, clampOffset, LIST_DEFAULT_LIMIT, LIST_MAX_LIMIT, pick, validateBlog, writeErrorStatus, BLOG_FIELDS } from '@/lib/validate';
import { resolvePublishedAt } from '@/lib/blogPublish';

/* ── GET ──────────────────────────────────────────────────────── */
export async function GET(req: NextRequest) {
  // Rate limit: 120 requests / minute per IP
  const limited = rateLimit(req, { limit: 120, windowMs: 60_000, prefix: 'blogs' });
  if (limited) return limited;

  try {
    const { searchParams } = new URL(req.url);

    // Use anon client — respects Supabase RLS policies
    // Summary columns only: full post HTML would make every list response huge
    let query = supabase.from('blogs').select(
      'id, title, slug, excerpt, category, tags, cover_url, read_time, author, published, published_at, created_at, updated_at',
    );

    const tag       = searchParams.get('tag');
    const search    = searchParams.get('q');
    const published = searchParams.get('published');

    if (tag)                  query = query.contains('tags', [tag]);
    if (published === 'true') query = query.eq('published', true);
    if (search)               query = query.textSearch('fts', search, { type: 'websearch' });

    const limit  = clampLimit(searchParams.get('limit'), LIST_DEFAULT_LIMIT, LIST_MAX_LIMIT);
    const offset = clampOffset(searchParams.get('offset'));
    query = query
      .order('published_at', { ascending: false, nullsFirst: false })
      .range(offset, offset + limit - 1);

    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (err) {
    console.error('[GET /api/blogs]', err);
    // 503 (not 200 []) so clients and monitoring can tell "no data" from "DB down"
    return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
  }
}

/* ── POST ─────────────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  const authError = await checkAdminAuth(req);
  if (authError) return authError;

  try {
    let raw: unknown;
    try { raw = await req.json(); } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
    const checked = validateBlog(pick(raw, BLOG_FIELDS));
    if (!checked.ok) return NextResponse.json({ error: checked.error }, { status: 400 });
    const body = checked.value;
    const doc  = {
      ...body,
      // Sanitize HTML content before storing to prevent XSS
      content:      typeof body.content === 'string' ? sanitizeBlogHtml(body.content) : body.content,
      published:    body.published ?? false,
      published_at: resolvePublishedAt(null, body.published === true),
    };
    const { data, error } = await supabaseAdmin
      .from('blogs')
      .insert(doc)
      .select()
      .single();
    if (error) {
      console.error('[POST /api/blogs]', error.code, error.message);
      const { status, error: msg } = writeErrorStatus(error);
      return NextResponse.json({ error: msg }, { status });
    }
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error('[POST /api/blogs]', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'Database error' }, { status: 503 });
  }
}
