/**
 * app/api/jobs/[id]/route.ts
 *
 * GET    /api/jobs/:id
 * PUT    /api/jobs/:id  (admin only)
 * DELETE /api/jobs/:id  (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getLiveJob } from '@/lib/data/public';
import { checkAdminAuth } from '@/lib/adminAuth';
import { rateLimit } from '@/lib/rateLimit';
import { pick, safeHttpUrl, JOB_FIELDS, isUuid } from '@/lib/validate';

type Params = { params: Promise<{ id: string }> };

/* ── GET ──────────────────────────────────────────────────────── */
export async function GET(req: NextRequest, { params }: Params) {
  const limited = rateLimit(req, { limit: 120, windowMs: 60_000, prefix: 'jobs-id' });
  if (limited) return limited;

  const { id } = await params;
  if (!isUuid(id)) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  try {
    // Shared with the job detail page (lib/data/public.ts): anon client + status = 'live'
    const job = await getLiveJob(id);
    if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(job);
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
  if (!isUuid(id)) return NextResponse.json({ error: 'Not found' }, { status: 404 });

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
  if (!isUuid(id)) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  try {
    const { data, error } = await supabaseAdmin
      .from('jobs')
      .delete()
      .eq('id', id)
      .select('id');
    if (error) throw error;
    if (!data?.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[DELETE /api/jobs/:id]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
