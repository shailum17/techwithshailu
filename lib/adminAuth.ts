import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { rateLimit } from '@/lib/rateLimit';

/**
 * Constant-time string comparison. Returns false for differing lengths
 * without leaking where the strings differ.
 */
export function safeEqual(provided: string, expected: string): boolean {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) {
    // Still burn a comparison so timing doesn't reveal the length mismatch early
    timingSafeEqual(b, b);
    return false;
  }
  return timingSafeEqual(a, b);
}

/**
 * Verifies the x-admin-key header matches ADMIN_SECRET.
 *
 * Security properties:
 *  - Timing-safe comparison (via crypto.timingSafeEqual) to prevent
 *    timing-based secret enumeration attacks.
 *  - Rate-limited to 20 attempts / minute per IP to slow brute-force.
 *  - Returns 401 for both missing and wrong keys (no information leakage).
 *
 * Returns a 4xx NextResponse if not authorized, null if OK.
 */
export function checkAdminAuth(req: NextRequest): NextResponse | null {
  // ── 1. Rate-limit admin endpoints ─────────────────────────────────────────
  const limited = rateLimit(req, { limit: 20, windowMs: 60_000, prefix: 'admin-auth' });
  if (limited) return limited;

  // ── 2. Constant-time secret comparison ────────────────────────────────────
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    console.error('[adminAuth] ADMIN_SECRET env var is not set');
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  }

  const provided = req.headers.get('x-admin-key') ?? '';

  if (!safeEqual(provided, secret)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return null;
}
