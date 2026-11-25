/**
 * lib/adminSession.ts
 *
 * Stateless admin session cookie, so the admin panel doesn't have to keep
 * ADMIN_SECRET in page JavaScript after login.
 *
 * Token format: "<expiresAtUnixSeconds>.<base64url HMAC-SHA256>"
 * The HMAC key is derived from ADMIN_SECRET, so rotating ADMIN_SECRET
 * invalidates every existing session.
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

/** Creates a session token valid for ADMIN_SESSION_TTL_SECONDS. */
export function createSessionToken(secret: string, nowMs = Date.now()): string {
  const exp = Math.floor(nowMs / 1000) + ADMIN_SESSION_TTL_SECONDS;
  return `${exp}.${sign(String(exp), secret)}`;
}

/** True when the token has a valid signature and hasn't expired. */
export function verifySessionToken(token: string | undefined, secret: string, nowMs = Date.now()): boolean {
  if (!token) return false;
  const dot = token.indexOf('.');
  if (dot <= 0) return false;
  const expStr = token.slice(0, dot);
  const sig    = token.slice(dot + 1);
  if (!/^\d+$/.test(expStr)) return false;
  if (Number(expStr) * 1000 <= nowMs) return false;
  return safeEqual(sig, sign(expStr, secret));
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
