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
 * (supabase/migrations/20261125000200_approve_pending_job.sql) so the insert
 * and the delete happen in one transaction. If that function isn't deployed
 * yet, it falls back to the previous two-step insert-then-delete.
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { checkAdminAuth } from '@/lib/adminAuth';
import { pick, safeHttpUrl } from '@/lib/validate';

const OVERRIDE_FIELDS = [
  'title', 'company', 'location', 'type', 'salary', 'apply_link', 'description',
  'tags', 'deadline', 'batch_year', 'is_featured',
] as const;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Overrides = Partial<Record<(typeof OVERRIDE_FIELDS)[number], unknown>>;

/** Validates admin overrides; returns an error message or null. */
function validateOverrides(o: Overrides): string | null {
  if (o.apply_link !== undefined && o.apply_link !== null && o.apply_link !== '') {
    const link = safeHttpUrl(o.apply_link);
    if (!link) return 'apply_link must be an http(s) URL';
    o.apply_link = link;
  }
  if (o.tags !== undefined && o.tags !== null &&
      !(Array.isArray(o.tags) && o.tags.every(t => typeof t === 'string'))) {
    return 'tags must be an array of strings';
  }
  if (o.deadline !== undefined && o.deadline !== null && o.deadline !== '' &&
      (typeof o.deadline !== 'string' || Number.isNaN(Date.parse(o.deadline)))) {
    return 'deadline must be a date (YYYY-MM-DD)';
  }
  if (o.deadline === '') o.deadline = null;
  if (o.batch_year !== undefined && o.batch_year !== null &&
      !(Number.isInteger(o.batch_year))) {
    return 'batch_year must be a whole number';
  }
  return null;
}

/** Previous non-atomic path, used only until the migration is applied. */
async function legacyApprove(jobId: string, overrides: Overrides): Promise<NextResponse> {
  const { data: job, error: fetchError } = await supabaseAdmin
    .from('pending_jobs').select('*').eq('id', jobId).single();
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

  const { error: deleteError } = await supabaseAdmin.from('pending_jobs').delete().eq('id', jobId);
  if (deleteError) {
    console.error('[approve] delete error:', deleteError.message);
    return NextResponse.json({ error: 'Job published but could not be removed from pending' }, { status: 500 });
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
  if (!UUID_RE.test(jobId)) {
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
