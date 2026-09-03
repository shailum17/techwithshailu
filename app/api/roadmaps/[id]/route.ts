/**
 * app/api/roadmaps/[id]/route.ts
 *
 * GET    /api/roadmaps/:id
 * PUT    /api/roadmaps/:id  (admin only)
 * DELETE /api/roadmaps/:id  (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { checkAdminAuth } from '@/lib/adminAuth';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const { data, error } = await supabaseAdmin
      .from('roadmaps')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(data);
  } catch (err) {
    console.error('[GET /api/roadmaps/:id]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const authError = checkAdminAuth(req);
  if (authError) return authError;

  const { id } = await params;

  try {
    const body = await req.json();
    delete body.id;
    delete body.updated_at;

    const { data, error } = await supabaseAdmin
      .from('roadmaps')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[PUT /api/roadmaps/:id] Supabase error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(data);
  } catch (err) {
    console.error('[PUT /api/roadmaps/:id]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const authError = checkAdminAuth(req);
  if (authError) return authError;

  const { id } = await params;

  try {
    const { error } = await supabaseAdmin
      .from('roadmaps')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[DELETE /api/roadmaps/:id]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
