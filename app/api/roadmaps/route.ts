/**
 * app/api/roadmaps/route.ts
 *
 * GET  /api/roadmaps  — list roadmaps (?category=, ?q=)
 * POST /api/roadmaps  — create roadmap (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { checkAdminAuth } from '@/lib/adminAuth';

/* ── GET ──────────────────────────────────────────────────────── */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    let query = supabaseAdmin.from('roadmaps').select('*');

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
      .from('roadmaps')
      .insert(body)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'DB error';
    console.error('[POST /api/roadmaps]', msg);
    return NextResponse.json({ error: 'Database error', detail: msg }, { status: 503 });
  }
}
