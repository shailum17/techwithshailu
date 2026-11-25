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
import { pick, validateTool, TOOL_FIELDS, isUuid, writeErrorStatus } from '@/lib/validate';

type Params = { params: Promise<{ id: string }> };

/* ── GET ──────────────────────────────────────────────────────── */
export async function GET(req: NextRequest, { params }: Params) {
  const limited = rateLimit(req, { limit: 120, windowMs: 60_000, prefix: 'tools-id' });
  if (limited) return limited;

  const { id } = await params;
  if (!isUuid(id)) return NextResponse.json({ error: 'Not found' }, { status: 404 });
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
  const authError = await checkAdminAuth(req);
  if (authError) return authError;

  const { id } = await params;
  if (!isUuid(id)) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  try {
    let raw: unknown;
    try { raw = await req.json(); } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
    const checked = validateTool(pick(raw, TOOL_FIELDS), true);
    if (!checked.ok) return NextResponse.json({ error: checked.error }, { status: 400 });

    const { data, error } = await supabaseAdmin
      .from('tools')
      .update(checked.value)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      // .single() on zero rows → PGRST116: the id doesn't exist
      if (error.code === 'PGRST116') return NextResponse.json({ error: 'Not found' }, { status: 404 });
      console.error('[PUT /api/tools/:id]', error.code, error.message);
      const { status, error: msg } = writeErrorStatus(error);
      return NextResponse.json({ error: msg }, { status });
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
  const authError = await checkAdminAuth(req);
  if (authError) return authError;

  const { id } = await params;
  if (!isUuid(id)) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  try {
    const { data, error } = await supabaseAdmin
      .from('tools')
      .delete()
      .eq('id', id)
      .select('id');
    if (error) throw error;
    if (!data?.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[DELETE /api/tools/:id]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
