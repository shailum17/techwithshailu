/**
 * GET /api/admin/blogs  (admin only)
 *
 * All blog posts including unpublished drafts, newest first.
 * The public /api/blogs uses the anon client, whose RLS policy only returns
 * published = true, so drafts would otherwise vanish from the admin panel.
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { checkAdminAuth } from '@/lib/adminAuth';

export async function GET(req: NextRequest) {
  const authError = await checkAdminAuth(req);
  if (authError) return authError;

  const { data, error } = await supabaseAdmin
    .from('blogs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[GET /api/admin/blogs]', error.message);
    return NextResponse.json({ error: 'Failed to load posts' }, { status: 500 });
  }
  return NextResponse.json(data ?? []);
}
