import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { rateLimit } from '@/lib/rateLimit';

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

  // timingSafeEqual requires equal-length buffers
  const providedBuf = Buffer.from(provided);
  const secretBuf   = Buffer.from(secret);

  // If lengths differ, the comparison would throw — pad to a consistent length
  // by comparing with a dummy buffer of the same length as the secret,
  // then also verify lengths are equal (which prevents length-leaking).
  const lengthsMatch = providedBuf.length === secretBuf.length;

  // Use the secretBuf length as the comparison target to avoid short-circuit
  const safeProvided = lengthsMatch
    ? providedBuf
    : Buffer.alloc(secretBuf.length); // wrong length → comparison will fail

  const keyMatch = timingSafeEqual(safeProvided, secretBuf) && lengthsMatch;

  if (!keyMatch) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return null;
}
