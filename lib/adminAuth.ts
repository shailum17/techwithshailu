import { NextRequest, NextResponse } from 'next/server';
import { sharedRateLimit } from '@/lib/sharedRateLimit';
import { safeEqual } from '@/lib/safeEqual';
import { ADMIN_SESSION_COOKIE, verifySessionToken } from '@/lib/adminSession';
import { getSessionEpoch } from '@/lib/settings';

export { safeEqual };

/** Failed attempts allowed per IP per minute before admin auth returns 429. */
const FAILED_AUTH_LIMIT = { limit: 20, windowMs: 60_000, prefix: 'admin-auth-fail' } as const;

/**
 * Every admin-*key* comparison (x-admin-key header or the login form) is
 * counted *before* comparing. The failed-attempt limit above is check-then-
 * record, so a burst of parallel requests could all pass its check; this
 * atomic counter bounds guesses per minute regardless of concurrency.
 * Cookie-authenticated requests (the admin panel) are not counted.
 */
const KEY_ATTEMPT_LIMIT = { limit: 60, windowMs: 60_000, prefix: 'admin-key-attempt' } as const;

/** Shortest ADMIN_SECRET accepted in production. */
export const MIN_ADMIN_SECRET_LENGTH = 32;

/** Returns ADMIN_SECRET, or a 500 response when it is missing or too weak for production. */
function adminSecret(): string | NextResponse {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    console.error('[adminAuth] ADMIN_SECRET env var is not set');
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  }
  if (process.env.NODE_ENV === 'production' && secret.length < MIN_ADMIN_SECRET_LENGTH) {
    console.error(`[adminAuth] ADMIN_SECRET is shorter than ${MIN_ADMIN_SECRET_LENGTH} characters — refusing admin auth`);
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  }
  return secret;
}

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

  const secret = adminSecret();
  if (typeof secret !== 'string') return secret;

  const tooMany = await sharedRateLimit(req, KEY_ATTEMPT_LIMIT); // counted before comparing
  if (tooMany) return tooMany;

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
 *  - Failed attempts are rate-limited (20 / minute per IP, shared across
 *    serverless instances via lib/sharedRateLimit.ts), and every admin-key
 *    comparison is also counted up front (60 / minute) so parallel bursts
 *    can't exceed the limit. Cookie sessions are never counted, so a busy
 *    admin panel doesn't lock itself out.
 *  - In production, ADMIN_SECRET must be at least 32 characters.
 *  - Cookie-authenticated non-GET requests must not come from another origin.
 *  - Returns 401 for both missing and wrong credentials (no information leakage).
 *
 * Returns a 4xx/5xx NextResponse if not authorised, null if OK.
 */
export async function checkAdminAuth(req: NextRequest): Promise<NextResponse | null> {
  // ── 1. Block callers that already failed too often ─────────────────────────
  const limited = await sharedRateLimit(req, { ...FAILED_AUTH_LIMIT, peek: true });
  if (limited) return limited;

  const secret = adminSecret();
  if (typeof secret !== 'string') return secret;

  // ── 2. Header key (constant-time) ──────────────────────────────────────────
  const provided = req.headers.get('x-admin-key');
  if (provided) return checkAdminKey(req, provided);

  // ── 3. Session cookie ──────────────────────────────────────────────────────
  const token = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (token && verifySessionToken(token, secret, Date.now(), await getSessionEpoch())) {
    if (req.method !== 'GET' && req.method !== 'HEAD' && isCrossOrigin(req)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return null;
  }

  await sharedRateLimit(req, FAILED_AUTH_LIMIT); // record the failure
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
