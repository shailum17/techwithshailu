/**
 * app/api/admin/jobs/pending/route.ts
 *
 * GET /api/admin/jobs/pending
 * Returns all pending jobs ordered by fetched_at desc.
 * Admin-only.
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { checkAdminAuth } from '@/lib/adminAuth';

export async function GET(req: NextRequest) {
  const authError = checkAdminAuth(req);
  if (authError) return authError;

  try {
    const { data, error } = await supabaseAdmin
      .from('pending_jobs')
      .select('*')
      .order('fetched_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[GET /api/admin/jobs/pending]', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
