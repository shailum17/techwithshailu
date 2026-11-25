/**
 * app/api/admin/jobs/reject/route.ts
 *
 * POST /api/admin/jobs/reject
 * Body: { jobId: string }
 *
 * Marks a pending job as rejected. The row is kept (not deleted) so the
 * daily fetch recognises it and doesn't queue the same listing again.
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { checkAdminAuth } from '@/lib/adminAuth';
import { isUuid } from '@/lib/validate';

export async function POST(req: NextRequest) {
  const authError = await checkAdminAuth(req);
  if (authError) return authError;

  try {
    let jobId: unknown;
    try {
      ({ jobId } = await req.json());
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
    if (!isUuid(jobId)) {
      return NextResponse.json({ error: 'jobId is required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('pending_jobs')
      .update({ status: 'rejected' })
      .eq('id', jobId)
      .eq('status', 'pending')
      .select('id');

    if (error) throw error;
    if (!data?.length) {
      return NextResponse.json({ error: 'Pending job not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[POST /api/admin/jobs/reject]', msg);
    return NextResponse.json({ error: 'Failed to reject job' }, { status: 500 });
  }
}
