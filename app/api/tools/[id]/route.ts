/**
 * app/api/tools/[id]/route.ts
 *
 * GET    /api/tools/:id
 * PUT    /api/tools/:id  (admin only)
 * DELETE /api/tools/:id  (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { checkAdminAuth } from '@/lib/adminAuth';
import { rateLimit } from '@/lib/rateLimit';
import { pick, TOOL_FIELDS } from '@/lib/validate';

type Params = { params: Promise<{ id: string }> };

/* ── GET ──────────────────────────────────────────────────────── */
export async function GET(req: NextRequest, { params }: Params) {
  const limited = rateLimit(req, { limit: 120, windowMs: 60_000, prefix: 'tools-id' });
  if (limited) return limited;

  const { id } = await params;
  try {
    // Use anon client — respects Supabase RLS policies
    const { data, error } = await supabase
      .from('tools')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(data);
  } catch (err) {
    console.error('[GET /api/tools/:id]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/* ── PUT ──────────────────────────────────────────────────────── */
export async function PUT(req: NextRequest, { params }: Params) {
  const authError = checkAdminAuth(req);
  if (authError) return authError;

  const { id } = await params;

  try {
    const body = pick(await req.json(), TOOL_FIELDS);

    const { data, error } = await supabaseAdmin
      .from('tools')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[PUT /api/tools/:id] Supabase error:', error.message);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(data);
  } catch (err) {
    console.error('[PUT /api/tools/:id]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/* ── DELETE ───────────────────────────────────────────────────── */
export async function DELETE(req: NextRequest, { params }: Params) {
  const authError = checkAdminAuth(req);
  if (authError) return authError;

  const { id } = await params;

  try {
    const { error } = await supabaseAdmin
      .from('tools')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[DELETE /api/tools/:id]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
