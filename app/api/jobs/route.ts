/**
 * app/api/jobs/route.ts
 *
 * GET  /api/jobs  — list jobs (public, anon client, respects RLS)
 *   ?type=         filter by type (Job | Internship | Full-time)
 *   ?location=     ilike filter on location
 *   ?batch_year=   exact match
 *   ?featured=true is_featured = true
 *   ?q=            full-text search (title, company, description)
 *   ?sort=newest|deadline
 *   ?limit=        max results
 *
 * POST /api/jobs  — create job (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { checkAdminAuth } from '@/lib/adminAuth';
import { rateLimit } from '@/lib/rateLimit';
import { clampLimit, pick, safeHttpUrl, JOB_FIELDS } from '@/lib/validate';

/* ── GET ──────────────────────────────────────────────────────── */
export async function GET(req: NextRequest) {
  // Rate limit: 120 requests / minute per IP
  const limited = rateLimit(req, { limit: 120, windowMs: 60_000, prefix: 'jobs' });
  if (limited) return limited;

  try {
    const { searchParams } = new URL(req.url);

    // Use anon client — respects Supabase RLS policies
    let query = supabase.from('jobs').select('*');

    const type     = searchParams.get('type');
    const location = searchParams.get('location');
    const batch    = searchParams.get('batch_year');
    const featured = searchParams.get('featured');
    const search   = searchParams.get('q');
    const sort     = searchParams.get('sort') || 'newest';

    if (type)                query = query.eq('type', type);
    if (location)            query = query.ilike('location', `%${location}%`);
    if (batch)               query = query.eq('batch_year', Number(batch));
    if (featured === 'true') query = query.eq('is_featured', true);
    if (search)              query = query.textSearch('fts', search, { type: 'websearch' });

    query = sort === 'deadline'
      ? query.order('deadline', { ascending: true })
      : query.order('created_at', { ascending: false });

    const limit = searchParams.get('limit');
    if (limit) query = query.limit(clampLimit(limit, 20, 100));

    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (err) {
    console.error('[GET /api/jobs]', err);
    return NextResponse.json([]);
  }
}

/* ── POST ─────────────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  const authError = checkAdminAuth(req);
  if (authError) return authError;

  try {
    const body = pick(await req.json(), JOB_FIELDS);
    if (body.apply_link) {
      const link = safeHttpUrl(body.apply_link);
      if (!link) return NextResponse.json({ error: 'apply_link must be an http(s) URL' }, { status: 400 });
      body.apply_link = link;
    }
    const { data, error } = await supabaseAdmin
      .from('jobs')
      .insert(body)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err: unknown) {
    console.error('[POST /api/jobs]', err);
    return NextResponse.json({ error: 'Database error' }, { status: 503 });
  }
}
