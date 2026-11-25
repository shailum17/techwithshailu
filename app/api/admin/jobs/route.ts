/**
 * GET /api/admin/jobs  (admin only)
 *
 * All jobs regardless of status (live, draft, expired), newest first.
 * The public /api/jobs uses the anon client, whose RLS policy only returns
 * status = 'live', so the admin panel needs this to manage everything.
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { checkAdminAuth } from '@/lib/adminAuth';

export async function GET(req: NextRequest) {
  const authError = await checkAdminAuth(req);
  if (authError) return authError;

  const { data, error } = await supabaseAdmin
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[GET /api/admin/jobs]', error.message);
    return NextResponse.json({ error: 'Failed to load jobs' }, { status: 500 });
  }
  return NextResponse.json(data ?? []);
}
