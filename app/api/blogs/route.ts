/**
 * app/api/blogs/route.ts
 *
 * GET  /api/blogs  — list posts (?tag=, ?q=, ?published=true)
 * POST /api/blogs  — create post (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { checkAdminAuth } from '@/lib/adminAuth';

/* ── GET ──────────────────────────────────────────────────────── */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    let query = supabaseAdmin.from('blogs').select('*');

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
  const authError = checkAdminAuth(req);
  if (authError) return authError;

  try {
    const body = await req.json();
    const doc  = {
      ...body,
      published:    body.published ?? false,
      published_at: body.published ? new Date().toISOString() : null,
    };
    const { data, error } = await supabaseAdmin
      .from('blogs')
      .insert(doc)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'DB error';
    console.error('[POST /api/blogs]', msg);
    return NextResponse.json({ error: 'Database error', detail: msg }, { status: 503 });
  }
}
