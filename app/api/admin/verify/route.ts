/**
 * GET /api/admin/verify
 *
 * Lets the admin login screen check a key before showing the dashboard.
 * 200 { ok: true } when x-admin-key is valid; 401 (or 429) otherwise.
 * Uses the same timing-safe, rate-limited check as every admin route.
 */

import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/adminAuth';

export async function GET(req: NextRequest) {
  const authError = checkAdminAuth(req);
  if (authError) return authError;
  return NextResponse.json({ ok: true });
}
