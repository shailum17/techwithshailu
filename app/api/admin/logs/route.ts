/**
 * app/api/admin/logs/route.ts
 *
 * GET /api/admin/logs?limit=50
 * Returns automation_logs ordered by ran_at desc. Admin only.
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { checkAdminAuth } from '@/lib/adminAuth';
import { clampLimit } from '@/lib/validate';

export async function GET(req: NextRequest) {
  const authError = await checkAdminAuth(req);
  if (authError) return authError;

  const { searchParams } = new URL(req.url);
  // Non-numeric / negative values fall back to 100 instead of reaching PostgREST
  const limit = clampLimit(searchParams.get('limit'), 100, 500);

  try {
    const { data, error } = await supabaseAdmin
      .from('automation_logs')
      .select('id, trigger_type, query, status, fetched, added_to_pending, skipped_duplicates, error_message, raw_response, ran_at')
      .order('ran_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[GET /api/admin/logs]', msg);
    return NextResponse.json({ error: 'Failed to load logs' }, { status: 500 });
  }
}
