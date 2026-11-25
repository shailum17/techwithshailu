/**
 * lib/sharedRateLimit.ts
 *
 * Rate limiting shared across all serverless instances, backed by the
 * `rate_limit_hit` Postgres function (supabase/migrations/20261125000100_rate_limits.sql).
 * Use it where abuse matters (auth failures, public writes). Public read
 * endpoints keep the cheaper per-instance limiter in lib/rateLimit.ts.
 *
 * If the RPC fails (e.g. migration not applied, DB unreachable) it falls
 * back to the in-memory limiter rather than failing open or closed.
 */

import { createHmac } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { clientIp, rateLimit, type RateLimitOptions } from '@/lib/rateLimit';

/** HMAC of the IP so raw addresses are never stored in the database. */
function hashedKey(prefix: string, ip: string): string {
  const salt = process.env.RATE_LIMIT_SALT || process.env.ADMIN_SECRET || 'techwithshailu';
  return `${prefix}:${createHmac('sha256', salt).update(ip).digest('base64url').slice(0, 32)}`;
}

function tooMany(limit: number, resetAt: Date): NextResponse {
  const retryAfter = Math.max(1, Math.ceil((resetAt.getTime() - Date.now()) / 1000));
  return new NextResponse(JSON.stringify({ error: 'Too many requests. Please slow down.' }), {
    status: 429,
    headers: {
      'Content-Type':          'application/json',
      'X-RateLimit-Limit':     String(limit),
      'X-RateLimit-Remaining': '0',
      'Retry-After':           String(retryAfter),
    },
  });
}

/**
 * Same contract as rateLimit(): returns a 429 response when over the limit,
 * otherwise null. With `peek`, only checks without counting this request.
 */
export async function sharedRateLimit(
  req: NextRequest,
  { limit = 60, windowMs = 60_000, prefix = '', peek = false }: RateLimitOptions = {},
): Promise<NextResponse | null> {
  try {
    const { data, error } = await supabaseAdmin.rpc('rate_limit_hit', {
      p_key:            hashedKey(prefix, clientIp(req)),
      p_limit:          limit,
      p_window_seconds: Math.ceil(windowMs / 1000),
      p_peek:           peek,
    });
    if (error) throw error;
    const row = Array.isArray(data) ? data[0] : data;
    if (!row) throw new Error('empty rate_limit_hit result');
    return row.allowed ? null : tooMany(limit, new Date(row.reset_at));
  } catch (err) {
    console.warn('[sharedRateLimit] falling back to in-memory limiter:', err instanceof Error ? err.message : err);
    return rateLimit(req, { limit, windowMs, prefix, peek });
  }
}
