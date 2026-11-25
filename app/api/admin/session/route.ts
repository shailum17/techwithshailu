/**
 * app/api/admin/session/route.ts
 *
 * POST   /api/admin/session   Body: { key: string }
 *        Logs in: checks the key and sets an httpOnly admin session cookie.
 * DELETE /api/admin/session
 *        Logs out: clears the cookie and, when the caller holds a valid
 *        session, bumps the session epoch so every outstanding admin session
 *        (other browsers, a copied cookie) stops working too.
 *
 * The /admin panel uses this so it never has to keep ADMIN_SECRET in
 * JavaScript after login. Scripts can still send the x-admin-key header.
 */

import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth, checkAdminKey } from '@/lib/adminAuth';
import { bumpSessionEpoch, getSessionEpoch } from '@/lib/settings';
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_TTL_SECONDS,
  createSessionToken,
  sessionCookieOptions,
} from '@/lib/adminSession';

export async function POST(req: NextRequest) {
  let key = '';
  try {
    const body = await req.json();
    if (typeof body?.key === 'string') key = body.key;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const authError = await checkAdminKey(req, key);
  if (authError) return authError;

  const res = NextResponse.json({ ok: true });
  res.cookies.set(
    ADMIN_SESSION_COOKIE,
    createSessionToken(process.env.ADMIN_SECRET as string, Date.now(), await getSessionEpoch()),
    sessionCookieOptions(ADMIN_SESSION_TTL_SECONDS),
  );
  return res;
}

export async function DELETE(req: NextRequest) {
  // Only a valid, same-origin session may revoke sessions — otherwise anyone
  // could log the admin out. Without one, this just clears the cookie.
  let revoked = false;
  if (req.cookies.get(ADMIN_SESSION_COOKIE)?.value && !(await checkAdminAuth(req))) {
    try {
      await bumpSessionEpoch();
      revoked = true;
    } catch (err) {
      console.error('[DELETE /api/admin/session] could not revoke sessions:', err instanceof Error ? err.message : err);
    }
  }

  const res = NextResponse.json({ ok: true, revoked });
  res.cookies.set(ADMIN_SESSION_COOKIE, '', sessionCookieOptions(0));
  return res;
}
