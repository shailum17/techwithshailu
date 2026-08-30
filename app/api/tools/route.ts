/**
 * app/api/tools/route.ts
 *
 * GET  /api/tools  — list AI tools
 *   ?category=     filter by category
 *   ?featured=true  is_featured = true
 *   ?q=            full-text search
 *
 * POST /api/tools  — create tool (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { checkAdminAuth } from '@/lib/adminAuth';

/* ── GET ──────────────────────────────────────────────────────── */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    let query = supabaseAdmin.from('tools').select('*');

    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const search   = searchParams.get('q');

    if (category)            query = query.eq('category', category);
    if (featured === 'true') query = query.eq('is_featured', true);
    if (search)              query = query.textSearch('fts', search, { type: 'websearch' });

    query = query.order('created_at', { ascending: false });

    const limit = searchParams.get('limit');
    if (limit) query = query.limit(Number(limit));

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
  const authError = checkAdminAuth(req);
  if (authError) return authError;

  try {
    const body = await req.json();
    const { data, error } = await supabaseAdmin
      .from('tools')
      .insert(body)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'DB error';
    console.error('[POST /api/tools]', msg);
    return NextResponse.json({ error: 'Database error', detail: msg }, { status: 503 });
  }
}
