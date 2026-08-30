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

type Params = { params: { id: string } };

/* ── GET ──────────────────────────────────────────────────────── */
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { data, error } = await supabaseAdmin
      .from('tools')
      .select('*')
      .eq('id', params.id)
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

  try {
    const body = await req.json();
    delete body.id;
    const { data, error } = await supabaseAdmin
      .from('tools')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', params.id)
      .select()
      .single();
    if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
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

  try {
    const { error } = await supabaseAdmin
      .from('tools')
      .delete()
      .eq('id', params.id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[DELETE /api/tools/:id]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
