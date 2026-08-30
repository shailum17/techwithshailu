/**
 * app/api/admin/jobs/approve/route.ts
 *
 * POST /api/admin/jobs/approve
 * Body: { jobId: string, overrides?: Partial<Job> }
 *
 * Admin edits fields in the drawer, then this moves the job
 * from pending_jobs → jobs (live) applying any overrides.
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { checkAdminAuth } from '@/lib/adminAuth';

export async function POST(req: NextRequest) {
  const authError = checkAdminAuth(req);
  if (authError) return authError;

  try {
    const body = await req.json();
    const { jobId, overrides } = body as {
      jobId: string;
      overrides?: {
        title?: string; company?: string; location?: string; type?: string;
        salary?: string | null; apply_link?: string; description?: string;
        tags?: string[]; deadline?: string | null; batch_year?: number | null;
        is_featured?: boolean;
      };
    };

    if (!jobId) {
      return NextResponse.json({ error: 'jobId is required' }, { status: 400 });
    }

    // 1. Fetch from pending_jobs
    const { data: job, error: fetchError } = await supabaseAdmin
      .from('pending_jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (fetchError || !job) {
      console.error('[approve] fetch error:', fetchError?.message, 'jobId:', jobId);
      return NextResponse.json(
        { error: `Pending job not found: ${fetchError?.message ?? 'no data'}` },
        { status: 404 }
      );
    }

    // 2. Insert into live jobs — merge pending data with admin overrides
    const { error: insertError } = await supabaseAdmin.from('jobs').insert({
      title:       overrides?.title       ?? job.title,
      company:     overrides?.company     ?? job.company,
      location:    overrides?.location    ?? job.location    ?? 'Remote',
      type:        overrides?.type        ?? job.type        ?? 'Internship',
      salary:      overrides?.salary      ?? job.salary      ?? null,
      description: overrides?.description ?? job.description ?? '',
      apply_link:  overrides?.apply_link  ?? job.apply_link  ?? '',
      tags:        overrides?.tags        ?? [],
      deadline:    overrides?.deadline    ?? job.deadline    ?? null,
      batch_year:  overrides?.batch_year  ?? null,
      is_featured: overrides?.is_featured ?? false,
      status:      'live',
    });

    if (insertError) {
      console.error('[approve] insert error:', insertError.message, insertError.details, insertError.hint);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // 3. Remove from pending_jobs
    const { error: deleteError } = await supabaseAdmin
      .from('pending_jobs')
      .delete()
      .eq('id', jobId);

    if (deleteError) {
      console.error('[approve] delete error:', deleteError.message);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[POST /api/admin/jobs/approve]', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
