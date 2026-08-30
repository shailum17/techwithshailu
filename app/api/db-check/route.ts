/**
 * app/api/db-check/route.ts
 *
 * GET /api/db-check — pings Supabase and returns connection status.
 * Used by the admin Dashboard "Database" panel.
 */

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    /* Lightweight ping — count(*) on a small system table */
    const { error } = await supabaseAdmin
      .from('jobs')
      .select('id', { count: 'exact', head: true });

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
      { ok: false, status: 'error', message: msg },
      { status: 500 }
    );
  }
}
