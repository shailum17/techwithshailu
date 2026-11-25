/**
 * GET /api/admin/settings/automation   (admin only)
 *   → { enabled: boolean, schedule: string | null }
 * PUT /api/admin/settings/automation   (admin only)   Body: { enabled: boolean }
 *
 * `enabled` pauses/resumes the scheduled job fetch (the cron route checks it).
 * `schedule` is the cron expression actually deployed in vercel.json; changing
 * it requires editing vercel.json and redeploying.
 */

import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/adminAuth';
import { getAutoFetchEnabled, setAutoFetchEnabled } from '@/lib/settings';
import vercelConfig from '@/vercel.json';

function deployedSchedule(): string | null {
  const cron = vercelConfig.crons?.find(c => c.path === '/api/cron/fetch-jobs');
  return cron?.schedule ?? null;
}

export async function GET(req: NextRequest) {
  const authError = await checkAdminAuth(req);
  if (authError) return authError;
  return NextResponse.json({ enabled: await getAutoFetchEnabled(), schedule: deployedSchedule() });
}

export async function PUT(req: NextRequest) {
  const authError = await checkAdminAuth(req);
  if (authError) return authError;

  let enabled: unknown;
  try {
    ({ enabled } = await req.json());
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  if (typeof enabled !== 'boolean') {
    return NextResponse.json({ error: '`enabled` must be true or false' }, { status: 400 });
  }

  try {
    await setAutoFetchEnabled(enabled);
  } catch (err) {
    console.error('[PUT /api/admin/settings/automation]', err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: 'Could not save. Has supabase/migrations/20261125000000_app_settings.sql been applied?' },
      { status: 500 },
    );
  }
  return NextResponse.json({ enabled, schedule: deployedSchedule() });
}
