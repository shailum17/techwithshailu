/**
 * app/api/users/route.ts
 *
 * GET  /api/users  — list users (admin only)
 * POST /api/users  — register / subscribe (public)
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { checkAdminAuth } from '@/lib/adminAuth';

/* ── GET (admin only) ─────────────────────────────────────────── */
export async function GET(req: NextRequest) {
  const authError = checkAdminAuth(req);
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
    return NextResponse.json([]);
  }
}

/* ── POST (public — register / subscribe) ─────────────────────── */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.email) {
      return NextResponse.json({ error: 'email is required' }, { status: 400 });
    }

    const email = body.email.toLowerCase().trim();

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

    if (existing) return NextResponse.json({ message: 'Already registered' }, { status: 200 });

    // Allowlist only the fields a subscriber may set — never spread the full
    // body to prevent mass assignment (e.g. callers cannot override `role`,
    // `id`, `created_at`, or any other privileged column).
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert({
        email,
        name: typeof body.name === 'string' ? body.name.slice(0, 100).trim() : null,
        role: 'user',  // always force role — never accept from client
      })
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'DB error';
    console.error('[POST /api/users]', msg);
    return NextResponse.json({ error: 'Database error', detail: msg }, { status: 503 });
  }
}
