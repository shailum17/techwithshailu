/**
 * app/api/blogs/[id]/route.ts
 *
 * GET    /api/blogs/:id
 * PUT    /api/blogs/:id  (admin only)
 * DELETE /api/blogs/:id  (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { checkAdminAuth } from '@/lib/adminAuth';

type Params = { params: { id: string } };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { data, error } = await supabaseAdmin
      .from('blogs')
      .select('*')
      .eq('id', params.id)
      .single();
    if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(data);
  } catch (err) {
    console.error('[GET /api/blogs/:id]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const authError = checkAdminAuth(req);
  if (authError) return authError;

  try {
    const body = await req.json();
    delete body.id;

    const extra: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (body.published === true) extra.published_at = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from('blogs')
      .update({ ...body, ...extra })
      .eq('id', params.id)
      .select()
      .single();
    if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(data);
  } catch (err) {
    console.error('[PUT /api/blogs/:id]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const authError = checkAdminAuth(req);
  if (authError) return authError;

  try {
    const { error } = await supabaseAdmin
      .from('blogs')
      .delete()
      .eq('id', params.id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[DELETE /api/blogs/:id]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
