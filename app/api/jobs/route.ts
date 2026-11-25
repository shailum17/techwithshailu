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
 *   ?limit=        page size (default 50, max 100)
 *   ?offset=       rows to skip (paging)
 *
 * POST /api/jobs  — create job (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { listLiveJobs } from '@/lib/data/public';
import { checkAdminAuth } from '@/lib/adminAuth';
import { rateLimit } from '@/lib/rateLimit';
import { clampLimit, clampOffset, LIST_DEFAULT_LIMIT, LIST_MAX_LIMIT, pick, validateJob, writeErrorStatus, JOB_FIELDS } from '@/lib/validate';

/* ── GET ──────────────────────────────────────────────────────── */
export async function GET(req: NextRequest) {
  // Rate limit: 120 requests / minute per IP
  const limited = rateLimit(req, { limit: 120, windowMs: 60_000, prefix: 'jobs' });
  if (limited) return limited;

  try {
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get('limit');
    const batch = searchParams.get('batch_year');

    // Same query the Server Components use (lib/data/public.ts)
    const jobs = await listLiveJobs({
      type:      searchParams.get('type') || undefined,
      location:  searchParams.get('location') || undefined,
      batchYear: batch ? Number(batch) : undefined,
      featured:  searchParams.get('featured') === 'true',
      q:         searchParams.get('q') || undefined,
      sort:      searchParams.get('sort') === 'deadline' ? 'deadline' : 'newest',
      // Always bounded: no ?limit means the default page, never the whole table
      limit:     clampLimit(limit, LIST_DEFAULT_LIMIT, LIST_MAX_LIMIT),
      offset:    clampOffset(searchParams.get('offset')),
    });
    return NextResponse.json(jobs);
  } catch (err) {
    console.error('[GET /api/jobs]', err);
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
    const checked = validateJob(pick(raw, JOB_FIELDS));
    if (!checked.ok) return NextResponse.json({ error: checked.error }, { status: 400 });

    const { data, error } = await supabaseAdmin
      .from('jobs')
      .insert(checked.value)
      .select()
      .single();
    if (error) {
      console.error('[POST /api/jobs]', error.code, error.message);
      const { status, error: msg } = writeErrorStatus(error);
      return NextResponse.json({ error: msg }, { status });
    }
    return NextResponse.json(data, { status: 201 });
  } catch (err: unknown) {
    console.error('[POST /api/jobs]', err);
    return NextResponse.json({ error: 'Database error' }, { status: 503 });
  }
}
