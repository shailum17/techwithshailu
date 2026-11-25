/**
 * app/api/admin/seed-tools/route.ts
 *
 * POST /api/admin/seed-tools
 *
 * One-time endpoint to populate the `tools` table from the seed data.
 * Requires admin auth header: x-admin-key: <ADMIN_SECRET>
 *
 * Uses upsert on `name` so it's safe to run multiple times.
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { checkAdminAuth } from '@/lib/adminAuth';
import { TOOLS_SEED } from '@/scripts/seed-tools';

export async function POST(req: NextRequest) {
  const authError = await checkAdminAuth(req);
  if (authError) return authError;

  try {
    // Upsert in batches of 50 to stay within Supabase limits
    const BATCH = 50;
    let inserted = 0;
    const errors: string[] = [];

    for (let i = 0; i < TOOLS_SEED.length; i += BATCH) {
      const batch = TOOLS_SEED.slice(i, i + BATCH);
      const { data, error } = await supabaseAdmin
        .from('tools')
        .upsert(batch, { onConflict: 'name', ignoreDuplicates: false })
        .select('id');

      if (error) {
        errors.push(error.message);
      } else {
        inserted += data?.length ?? 0;
      }
    }

    if (errors.length) {
      return NextResponse.json(
        { success: false, inserted, errors },
        { status: 207 }
      );
    }

    return NextResponse.json({ success: true, inserted, total: TOOLS_SEED.length });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('[POST /api/admin/seed-tools]', msg);
    return NextResponse.json({ error: 'Seeding failed' }, { status: 500 });
  }
}
