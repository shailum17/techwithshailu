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

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const { data, error } = await supabaseAdmin
      .from('blogs')
      .select('*')
      .eq('id', id)
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

  const { id } = await params;

  try {
    const body = await req.json();
    delete body.id;
    delete body.updated_at;

    // Set published_at when publishing for the first time
    if (body.published === true) {
      body.published_at = new Date().toISOString();
    }

    const { data, error } = await supabaseAdmin
      .from('blogs')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[PUT /api/blogs/:id] Supabase error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(data);
  } catch (err) {
    console.error('[PUT /api/blogs/:id]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const authError = checkAdminAuth(req);
  if (authError) return authError;

  const { id } = await params;

  try {
    const { error } = await supabaseAdmin
      .from('blogs')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[DELETE /api/blogs/:id]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
