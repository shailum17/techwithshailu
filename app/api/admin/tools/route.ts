/**
 * GET /api/admin/tools  (admin only)
 *
 * Every tool, newest first, for the admin panel. The public /api/tools is
 * paginated (max 100 per request), which would truncate the admin list.
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { checkAdminAuth } from '@/lib/adminAuth';

export async function GET(req: NextRequest) {
  const authError = await checkAdminAuth(req);
  if (authError) return authError;

  const { data, error } = await supabaseAdmin
    .from('tools')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[GET /api/admin/tools]', error.message);
    return NextResponse.json({ error: 'Failed to load tools' }, { status: 500 });
  }
  return NextResponse.json(data ?? []);
}
