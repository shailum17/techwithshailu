/**
 * app/api/tools/[id]/route.ts
 *
 * GET    /api/tools/:id
 * PUT    /api/tools/:id  (admin only)
 * DELETE /api/tools/:id  (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { checkAdminAuth } from '@/lib/adminAuth';

type Params = { params: Promise<{ id: string }> };

/* ── GET ──────────────────────────────────────────────────────── */
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const { data, error } = await supabaseAdmin
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
    const body = await req.json();
    delete body.id;
    delete body.updated_at;

    const { data, error } = await supabaseAdmin
      .from('tools')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[PUT /api/tools/:id] Supabase error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
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
