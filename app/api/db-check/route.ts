/**
 * app/api/db-check/route.ts
 *
 * GET /api/db-check  (admin only) — pings Supabase and returns connection status.
 * Used by the admin Dashboard and Database panels (session cookie auth).
 *
 * Admin-only so anonymous callers can't use it as a free, uncached
 * service-role database query.
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { checkAdminAuth } from '@/lib/adminAuth';

export async function GET(req: NextRequest) {
  const authError = await checkAdminAuth(req);
  if (authError) return authError;

  try {
    // Lightweight ping — HEAD request with a planner estimate, no table scan
    const { error } = await supabaseAdmin
      .from('jobs')
      .select('id', { count: 'estimated', head: true });

    if (error) throw error;

    return NextResponse.json({
      ok:       true,
      status:   'connected',
      database: 'Supabase (PostgreSQL)',
      message:  'Supabase is reachable.',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[db-check]', msg);
    return NextResponse.json(
      // Never echo internal error text to the caller
      { ok: false, status: 'error', message: 'Database unreachable — check server logs.' },
      { status: 500 }
    );
  }
}
