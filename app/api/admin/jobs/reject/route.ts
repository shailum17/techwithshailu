/**
 * app/api/admin/jobs/reject/route.ts
 *
 * POST /api/admin/jobs/reject
 * Body: { jobId: string }
 *
 * Permanently deletes a job from pending_jobs.
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { checkAdminAuth } from '@/lib/adminAuth';

export async function POST(req: NextRequest) {
  const authError = checkAdminAuth(req);
  if (authError) return authError;

  try {
    const { jobId } = await req.json();
    if (!jobId) {
      return NextResponse.json({ error: 'jobId is required' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('pending_jobs')
      .delete()
      .eq('id', jobId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[POST /api/admin/jobs/reject]', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
