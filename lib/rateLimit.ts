/**
 * lib/rateLimit.ts
 *
 * Lightweight in-memory rate limiter for Next.js API routes.
 * Works per-IP across serverless function instances within a single container.
 *
 * Usage:
 *   const limited = rateLimit(req, { limit: 60, windowMs: 60_000 });
 *   if (limited) return limited; // returns a 429 NextResponse
 */

import { NextRequest, NextResponse } from 'next/server';

interface Window {
  count: number;
  resetAt: number;
}

// Stored per-process — resets when the serverless instance cold-starts
const store = new Map<string, Window>();

// Clean up expired entries every 5 minutes to avoid memory leaks
const sweeper = setInterval(() => {
  const now = Date.now();
  store.forEach((win, key) => {
    if (now > win.resetAt) store.delete(key);
  });
}, 5 * 60 * 1000);
// Don't keep the process alive just for cleanup (tests, scripts)
sweeper.unref?.();

/** Best-effort client IP (Vercel sets x-forwarded-for; first entry is the client). */
export function clientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    'anonymous'
  );
}

export interface RateLimitOptions {
  /** Max requests per window. Default: 60 */
  limit?: number;
  /** Window duration in ms. Default: 60 000 (1 minute) */
  windowMs?: number;
  /** Identifier prefix to namespace separate limiters. Default: '' */
  prefix?: string;
  /**
   * Only check whether the caller is already over the limit, without
   * counting this request. Lets callers count just *failed* attempts
   * (check with peek, then call again without peek on failure).
   */
  peek?: boolean;
}

/**
 * Returns a 429 NextResponse if the caller is over the limit, otherwise null.
 * Call at the top of your route handler before any logic.
 */
export function rateLimit(
  req: NextRequest,
  { limit = 60, windowMs = 60_000, prefix = '', peek = false }: RateLimitOptions = {},
): NextResponse | null {
  const ip = clientIp(req);

  const key = `${prefix}:${ip}`;
  const now = Date.now();

  let win = store.get(key);
  if (!win || now > win.resetAt) {
    win = { count: 0, resetAt: now + windowMs };
    store.set(key, win);
  }

  if (!peek) win.count++;

  const remaining = Math.max(0, limit - win.count);
  const reset      = Math.ceil(win.resetAt / 1000); // Unix seconds

  if (peek ? win.count >= limit : win.count > limit) {
    return new NextResponse(
      JSON.stringify({ error: 'Too many requests. Please slow down.' }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit':     String(limit),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset':     String(reset),
          'Retry-After':           String(Math.ceil(windowMs / 1000)),
        },
      },
    );
  }

  // Within limit — attach informational headers (optional but useful for clients)
  // We can't mutate the request, so callers can add these to their own response if desired.
  void remaining; void reset;
  return null;
}
