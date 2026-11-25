/**
 * app/api/tools/route.ts
 *
 * GET  /api/tools  — list AI tools (public, anon client, respects RLS)
 *   ?category=     filter by category
 *   ?featured=true is_featured = true
 *   ?q=            full-text search
 *   ?limit=        max results
 *
 * POST /api/tools  — create tool (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { checkAdminAuth } from '@/lib/adminAuth';
import { rateLimit } from '@/lib/rateLimit';
import { clampLimit, pick, TOOL_FIELDS } from '@/lib/validate';

/* ── GET ──────────────────────────────────────────────────────── */
export async function GET(req: NextRequest) {
  // Rate limit: 120 requests / minute per IP
  const limited = rateLimit(req, { limit: 120, windowMs: 60_000, prefix: 'tools' });
  if (limited) return limited;

  try {
    const { searchParams } = new URL(req.url);

    // Use anon client — respects Supabase RLS policies
    let query = supabase.from('tools').select('*');

    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const search   = searchParams.get('q');

    if (category)            query = query.eq('category', category);
    if (featured === 'true') query = query.eq('is_featured', true);
    if (search)              query = query.textSearch('fts', search, { type: 'websearch' });

    query = query.order('created_at', { ascending: false });

    const limit = searchParams.get('limit');
    if (limit) query = query.limit(clampLimit(limit, 20, 100));

    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (err) {
    console.error('[GET /api/tools]', err);
    return NextResponse.json([]);
  }
}

/* ── POST ─────────────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  const authError = await checkAdminAuth(req);
  if (authError) return authError;

  try {
    const body = pick(await req.json(), TOOL_FIELDS);
    const { data, error } = await supabaseAdmin
      .from('tools')
      .insert(body)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error('[POST /api/tools]', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'Database error' }, { status: 503 });
  }
}
