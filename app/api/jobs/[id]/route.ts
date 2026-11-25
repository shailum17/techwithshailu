/**
 * app/api/jobs/[id]/route.ts
 *
 * GET    /api/jobs/:id
 * PUT    /api/jobs/:id  (admin only)
 * DELETE /api/jobs/:id  (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { checkAdminAuth } from '@/lib/adminAuth';
import { rateLimit } from '@/lib/rateLimit';
import { pick, safeHttpUrl, JOB_FIELDS } from '@/lib/validate';

type Params = { params: Promise<{ id: string }> };

/* ── GET ──────────────────────────────────────────────────────── */
export async function GET(req: NextRequest, { params }: Params) {
  const limited = rateLimit(req, { limit: 120, windowMs: 60_000, prefix: 'jobs-id' });
  if (limited) return limited;

  const { id } = await params;
  try {
    // Use anon client — respects Supabase RLS (status = 'live' policy).
    // Also enforce the filter here as defense-in-depth in case RLS is
    // temporarily disabled or misconfigured.
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .eq('status', 'live')
      .single();
    if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(data);
  } catch (err) {
    console.error('[GET /api/jobs/:id]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/* ── PUT ──────────────────────────────────────────────────────── */
export async function PUT(req: NextRequest, { params }: Params) {
  const authError = await checkAdminAuth(req);
  if (authError) return authError;

  const { id } = await params;

  try {
    // Only allow-listed columns can be written (no id / timestamps / fts)
    const body = pick(await req.json(), JOB_FIELDS);
    if (body.apply_link) {
      const link = safeHttpUrl(body.apply_link);
      if (!link) return NextResponse.json({ error: 'apply_link must be an http(s) URL' }, { status: 400 });
      body.apply_link = link;
    }

    const { data, error } = await supabaseAdmin
      .from('jobs')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[PUT /api/jobs/:id] Supabase error:', error.message, error.details);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(data);
  } catch (err) {
    console.error('[PUT /api/jobs/:id]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/* ── DELETE ───────────────────────────────────────────────────── */
export async function DELETE(req: NextRequest, { params }: Params) {
  const authError = await checkAdminAuth(req);
  if (authError) return authError;

  const { id } = await params;

  try {
    const { error } = await supabaseAdmin
      .from('jobs')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[DELETE /api/jobs/:id]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
