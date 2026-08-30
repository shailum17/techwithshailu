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

    const email = body.email.toLowerCase();

    /* Prevent duplicates */
    const { data: existing } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existing) return NextResponse.json({ message: 'Already registered' }, { status: 200 });

    const { data, error } = await supabaseAdmin
      .from('users')
      .insert({ ...body, email, role: 'user' })
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
