/**
 * app/api/roadmaps/route.ts
 *
 * GET  /api/roadmaps  — list roadmaps (public, anon client, respects RLS)
 *   ?category=  filter by category
 *   ?q=         full-text search
 *
 * POST /api/roadmaps  — create roadmap (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { checkAdminAuth } from '@/lib/adminAuth';
import { rateLimit } from '@/lib/rateLimit';
import { pick, validateRoadmap, writeErrorStatus, ROADMAP_FIELDS } from '@/lib/validate';

/* ── GET ──────────────────────────────────────────────────────── */
export async function GET(req: NextRequest) {
  // Rate limit: 120 requests / minute per IP
  const limited = rateLimit(req, { limit: 120, windowMs: 60_000, prefix: 'roadmaps' });
  if (limited) return limited;

  try {
    const { searchParams } = new URL(req.url);

    // Use anon client — respects Supabase RLS policies
    let query = supabase.from('roadmaps').select('*');

    const category = searchParams.get('category');
    const search   = searchParams.get('q');

    if (category) query = query.eq('category', category);
    if (search)   query = query.textSearch('fts', search, { type: 'websearch' });

    query = query.order('order', { ascending: true }).order('created_at', { ascending: false });

    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (err) {
    console.error('[GET /api/roadmaps]', err);
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
    const checked = validateRoadmap(pick(raw, ROADMAP_FIELDS));
    if (!checked.ok) return NextResponse.json({ error: checked.error }, { status: 400 });
    const { data, error } = await supabaseAdmin
      .from('roadmaps')
      .insert(checked.value)
      .select()
      .single();
    if (error) {
      console.error('[POST /api/roadmaps]', error.code, error.message);
      const { status, error: msg } = writeErrorStatus(error);
      return NextResponse.json({ error: msg }, { status });
    }
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error('[POST /api/roadmaps]', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'Database error' }, { status: 503 });
  }
}
