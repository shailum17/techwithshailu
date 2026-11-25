/**
 * app/api/users/route.ts
 *
 * GET  /api/users  — list users (admin only)
 * POST /api/users  — register / subscribe (public)
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { checkAdminAuth } from '@/lib/adminAuth';
import { sharedRateLimit } from '@/lib/sharedRateLimit';

/** Same response whether the email is new or already subscribed (no enumeration). */
const SUBSCRIBED = { ok: true, message: 'Thanks! You are subscribed.' };

/* ── GET (admin only) ─────────────────────────────────────────── */
export async function GET(req: NextRequest) {
  const authError = await checkAdminAuth(req);
  if (authError) return authError;

  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (err) {
    console.error('[GET /api/users]', err);
    // 503 (not 200 []) so clients and monitoring can tell "no data" from "DB down"
    return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
  }
}

/* ── POST (public — register / subscribe) ─────────────────────── */
export async function POST(req: NextRequest) {
  // 5 signups per hour per IP, shared across instances
  const limited = await sharedRateLimit(req, { limit: 5, windowMs: 60 * 60_000, prefix: 'subscribe' });
  if (limited) return limited;

  try {
    const body = await req.json();
    if (typeof body?.email !== 'string' || !body.email) {
      return NextResponse.json({ error: 'email is required' }, { status: 400 });
    }

    const email = body.email.toLowerCase().trim().slice(0, 254);

    // Basic email format validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    /* Prevent duplicates */
    const { data: existing } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existing) return NextResponse.json(SUBSCRIBED, { status: 200 });

    // Allowlist only the fields a subscriber may set — never spread the full
    // body to prevent mass assignment (e.g. callers cannot override `role`,
    // `id`, `created_at`, or any other privileged column).
    const { error } = await supabaseAdmin
      .from('users')
      .insert({
        email,
        name: typeof body.name === 'string' ? body.name.slice(0, 100).trim() : null,
        role: 'user',  // always force role — never accept from client
      });
    // 23505 = unique violation (a concurrent signup with the same email)
    if (error && error.code !== '23505') throw error;
    // Don't echo the stored row back, and answer identically for new/existing emails
    return NextResponse.json(SUBSCRIBED, { status: 200 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'DB error';
    console.error('[POST /api/users]', msg);
    return NextResponse.json({ error: 'Database error' }, { status: 503 });
  }
}
