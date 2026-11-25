/**
 * app/api/admin/jobs/approve/route.ts
 *
 * POST /api/admin/jobs/approve
 * Body: { jobId: string, overrides?: Partial<Job> }
 *
 * Admin edits fields in the drawer, then this moves the job
 * from pending_jobs → jobs (live) applying any overrides.
 *
 * The move is done by the approve_pending_job() Postgres function
 * (supabase/migrations/20261125000300_keep_reviewed_pending_jobs.sql) so the
 * insert and marking the pending row 'approved' happen in one transaction.
 * The row is kept so the daily fetch doesn't re-queue the same listing.
 * If that function isn't deployed yet, it falls back to a two-step
 * insert-then-mark-approved.
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { checkAdminAuth } from '@/lib/adminAuth';
import { isUuid, pick, validateJob } from '@/lib/validate';

const OVERRIDE_FIELDS = [
  'title', 'company', 'location', 'type', 'salary', 'apply_link', 'description',
  'tags', 'deadline', 'batch_year', 'is_featured',
] as const;

type Overrides = Partial<Record<(typeof OVERRIDE_FIELDS)[number], unknown>>;

/**
 * Validates admin overrides with the same rules as job create/update
 * (type, dates, URLs, tags…). Normalises in place; returns an error or null.
 * Empty apply_link / deadline become null, which keeps the pending row's value.
 */
function validateOverrides(o: Overrides): string | null {
  const checked = validateJob(o as Record<string, unknown>, true);
  if (!checked.ok) return checked.error;
  Object.assign(o, checked.value);
  return null;
}

/** Previous non-atomic path, used only until the migration is applied. */
async function legacyApprove(jobId: string, overrides: Overrides): Promise<NextResponse> {
  const { data: job, error: fetchError } = await supabaseAdmin
    .from('pending_jobs').select('*').eq('id', jobId).eq('status', 'pending').single();
  if (fetchError || !job) {
    return NextResponse.json({ error: 'Pending job not found' }, { status: 404 });
  }

  const { error: insertError } = await supabaseAdmin.from('jobs').insert({
    title:       overrides.title       ?? job.title,
    company:     overrides.company     ?? job.company,
    location:    overrides.location    ?? job.location    ?? 'Remote',
    type:        overrides.type        ?? job.type        ?? 'Internship',
    salary:      overrides.salary      ?? job.salary      ?? null,
    description: overrides.description ?? job.description ?? '',
    apply_link:  overrides.apply_link  ?? job.apply_link  ?? '',
    tags:        overrides.tags        ?? [],
    deadline:    overrides.deadline    ?? job.deadline    ?? null,
    batch_year:  overrides.batch_year  ?? null,
    is_featured: overrides.is_featured ?? false,
    status:      'live',
    source:      job.source ?? 'manual',
  });
  if (insertError) {
    console.error('[approve] insert error:', insertError.message);
    return NextResponse.json({ error: 'Failed to publish job' }, { status: 500 });
  }

  // Keep the row as 'approved' so the daily fetch doesn't queue it again
  const { error: updateError } = await supabaseAdmin
    .from('pending_jobs').update({ status: 'approved' }).eq('id', jobId);
  if (updateError) {
    console.error('[approve] status update error:', updateError.message);
    return NextResponse.json({ error: 'Job published but could not be marked approved' }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}

export async function POST(req: NextRequest) {
  const authError = await checkAdminAuth(req);
  if (authError) return authError;

  let body: { jobId?: unknown; overrides?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const jobId = typeof body.jobId === 'string' ? body.jobId : '';
  if (!isUuid(jobId)) {
    return NextResponse.json({ error: 'jobId is required' }, { status: 400 });
  }

  const overrides: Overrides = pick(body.overrides, OVERRIDE_FIELDS);
  const invalid = validateOverrides(overrides);
  if (invalid) return NextResponse.json({ error: invalid }, { status: 400 });

  try {
    const { data: newId, error } = await supabaseAdmin.rpc('approve_pending_job', {
      p_id:        jobId,
      p_overrides: overrides,
    });

    if (error) {
      // P0002 = raised by the function when the pending row doesn't exist
      if (error.code === 'P0002') {
        return NextResponse.json({ error: 'Pending job not found' }, { status: 404 });
      }
      // Function not deployed yet (PostgREST PGRST202 / Postgres 42883)
      if (error.code === 'PGRST202' || error.code === '42883') {
        console.warn('[approve] approve_pending_job() missing — using non-atomic fallback');
        return legacyApprove(jobId, overrides);
      }
      console.error('[approve] rpc error:', error.code, error.message);
      return NextResponse.json({ error: 'Failed to publish job' }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: newId });
  } catch (err) {
    console.error('[POST /api/admin/jobs/approve]', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
