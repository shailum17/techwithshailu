/**
 * app/api/blogs/[id]/route.ts
 *
 * GET    /api/blogs/:id
 * PUT    /api/blogs/:id  (admin only)
 * DELETE /api/blogs/:id  (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { checkAdminAuth } from '@/lib/adminAuth';
import { rateLimit } from '@/lib/rateLimit';
import { sanitizeBlogHtml } from '@/lib/sanitize';

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const limited = rateLimit(req, { limit: 120, windowMs: 60_000, prefix: 'blogs-id' });
  if (limited) return limited;

  const { id } = await params;
  try {
    // Use anon client — respects Supabase RLS (published = true policy).
    // Also enforce the filter here as defense-in-depth in case RLS is
    // temporarily disabled or misconfigured.
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', id)
      .eq('published', true)
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

    // Sanitize HTML content before storing to prevent XSS
    if (typeof body.content === 'string') {
      body.content = sanitizeBlogHtml(body.content);
    }

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
