/**
 * lib/adminSession.ts
 *
 * Stateless admin session cookie, so the admin panel doesn't have to keep
 * ADMIN_SECRET in page JavaScript after login.
 *
 * Token format: "<expiresAtUnixSeconds>.<epoch>.<base64url HMAC-SHA256>"
 * The HMAC key is derived from ADMIN_SECRET, so rotating ADMIN_SECRET
 * invalidates every existing session.
 *
 * `epoch` is a counter stored in app_settings (see lib/settings.ts). A token
 * is only valid while its epoch equals the current one; logging out bumps
 * the epoch, which revokes every outstanding session (including a copied
 * cookie) without rotating ADMIN_SECRET.
 *
 * The cookie is httpOnly (unreadable by scripts), SameSite=Strict (not sent
 * on cross-site requests) and Secure in production.
 */

import { createHmac } from 'crypto';
import { safeEqual } from '@/lib/safeEqual';

export const ADMIN_SESSION_COOKIE = 'tws_admin_session';
export const ADMIN_SESSION_TTL_SECONDS = 8 * 60 * 60; // 8 hours

function signingKey(secret: string): Buffer {
  return createHmac('sha256', secret).update('admin-session-v1').digest();
}

function sign(payload: string, secret: string): string {
  return createHmac('sha256', signingKey(secret)).update(payload).digest('base64url');
}

/** Creates a session token valid for ADMIN_SESSION_TTL_SECONDS in the given epoch. */
export function createSessionToken(secret: string, nowMs = Date.now(), epoch = 0): string {
  const exp = Math.floor(nowMs / 1000) + ADMIN_SESSION_TTL_SECONDS;
  const payload = `${exp}.${epoch}`;
  return `${payload}.${sign(payload, secret)}`;
}

/** True when the token has a valid signature, hasn't expired and belongs to `epoch`. */
export function verifySessionToken(
  token: string | undefined,
  secret: string,
  nowMs = Date.now(),
  epoch = 0,
): boolean {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const [expStr, epochStr, sig] = parts;
  if (!/^\d+$/.test(expStr) || !/^\d+$/.test(epochStr)) return false;
  if (Number(expStr) * 1000 <= nowMs) return false;
  if (Number(epochStr) !== epoch) return false;
  return safeEqual(sig, sign(`${expStr}.${epochStr}`, secret));
}

/** Cookie attributes shared by login and logout. */
export function sessionCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path:     '/',
    maxAge,
  };
}
