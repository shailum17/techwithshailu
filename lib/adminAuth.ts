import { NextRequest, NextResponse } from 'next/server';
import { sharedRateLimit } from '@/lib/sharedRateLimit';
import { safeEqual } from '@/lib/safeEqual';
import { ADMIN_SESSION_COOKIE, verifySessionToken } from '@/lib/adminSession';

export { safeEqual };

/** Failed attempts allowed per IP per minute before admin auth returns 429. */
const FAILED_AUTH_LIMIT = { limit: 20, windowMs: 60_000, prefix: 'admin-auth-fail' } as const;

/**
 * For cookie-authenticated state-changing requests, require that a browser
 * Origin header (when present) matches this host. SameSite=Strict already
 * blocks cross-site cookies; this is defence in depth against CSRF.
 */
function isCrossOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return false;
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host');
  try {
    return new URL(origin).host !== host;
  } catch {
    return true;
  }
}

/**
 * Checks a submitted admin key (e.g. from the login form) with the same
 * failed-attempt rate limit as checkAdminAuth. Returns a 4xx/5xx response
 * when the key is wrong or the caller is locked out, null when correct.
 */
export async function checkAdminKey(req: NextRequest, provided: string): Promise<NextResponse | null> {
  const limited = await sharedRateLimit(req, { ...FAILED_AUTH_LIMIT, peek: true });
  if (limited) return limited;

  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    console.error('[adminAuth] ADMIN_SECRET env var is not set');
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  }

  if (provided && safeEqual(provided, secret)) return null;
  await sharedRateLimit(req, FAILED_AUTH_LIMIT); // record the failure
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

/**
 * Authorises an admin request. Accepts either:
 *  - the `x-admin-key` header matching ADMIN_SECRET (scripts, cron manual runs), or
 *  - a valid admin session cookie (the /admin panel after login; see lib/adminSession.ts).
 *
 * Security properties:
 *  - Timing-safe comparisons.
 *  - Only *failed* attempts are rate-limited (20 / minute per IP, shared across
 *    serverless instances via lib/sharedRateLimit.ts), so a busy
 *    admin session never locks itself out while brute force is still slowed.
 *  - Cookie-authenticated non-GET requests must not come from another origin.
 *  - Returns 401 for both missing and wrong credentials (no information leakage).
 *
 * Returns a 4xx/5xx NextResponse if not authorised, null if OK.
 */
export async function checkAdminAuth(req: NextRequest): Promise<NextResponse | null> {
  // ── 1. Block callers that already failed too often ─────────────────────────
  const limited = await sharedRateLimit(req, { ...FAILED_AUTH_LIMIT, peek: true });
  if (limited) return limited;

  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    console.error('[adminAuth] ADMIN_SECRET env var is not set');
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  }

  // ── 2. Header key (constant-time) ──────────────────────────────────────────
  const provided = req.headers.get('x-admin-key');
  if (provided) return checkAdminKey(req, provided);

  // ── 3. Session cookie ──────────────────────────────────────────────────────
  const token = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (verifySessionToken(token, secret)) {
    if (req.method !== 'GET' && req.method !== 'HEAD' && isCrossOrigin(req)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return null;
  }

  await sharedRateLimit(req, FAILED_AUTH_LIMIT); // record the failure
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
