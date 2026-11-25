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
import { supabaseAdmin } from '@/lib/supabase';
import { listTools } from '@/lib/data/public';
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
    const limit = searchParams.get('limit');
    const tools = await listTools({
      category: searchParams.get('category') || undefined,
      featured: searchParams.get('featured') === 'true',
      q:        searchParams.get('q') || undefined,
      limit:    limit ? clampLimit(limit, 20, 100) : undefined,
    });
    return NextResponse.json(tools);
  } catch (err) {
    console.error('[GET /api/tools]', err);
    // 503 (not 200 []) so clients and monitoring can tell "no data" from "DB down"
    return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
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
