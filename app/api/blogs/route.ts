/**
 * app/api/blogs/route.ts
 *
 * GET  /api/blogs  — list posts (public, anon client, respects RLS)
 *   ?tag=           filter by tag
 *   ?q=             full-text search
 *   ?published=true only published posts
 *
 * POST /api/blogs  — create post (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { checkAdminAuth } from '@/lib/adminAuth';
import { rateLimit } from '@/lib/rateLimit';
import { sanitizeBlogHtml } from '@/lib/sanitize';
import { pick, BLOG_FIELDS } from '@/lib/validate';
import { resolvePublishedAt } from '@/lib/blogPublish';

/* ── GET ──────────────────────────────────────────────────────── */
export async function GET(req: NextRequest) {
  // Rate limit: 120 requests / minute per IP
  const limited = rateLimit(req, { limit: 120, windowMs: 60_000, prefix: 'blogs' });
  if (limited) return limited;

  try {
    const { searchParams } = new URL(req.url);

    // Use anon client — respects Supabase RLS policies
    let query = supabase.from('blogs').select('*');

    const tag       = searchParams.get('tag');
    const search    = searchParams.get('q');
    const published = searchParams.get('published');

    if (tag)                  query = query.contains('tags', [tag]);
    if (published === 'true') query = query.eq('published', true);
    if (search)               query = query.textSearch('fts', search, { type: 'websearch' });

    query = query.order('published_at', { ascending: false });

    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (err) {
    console.error('[GET /api/blogs]', err);
    return NextResponse.json([]);
  }
}

/* ── POST ─────────────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  const authError = await checkAdminAuth(req);
  if (authError) return authError;

  try {
    const body = pick(await req.json(), BLOG_FIELDS);
    if (body.published !== undefined && typeof body.published !== 'boolean') {
      return NextResponse.json({ error: '`published` must be true or false' }, { status: 400 });
    }
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
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error('[POST /api/blogs]', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'Database error' }, { status: 503 });
  }
}
