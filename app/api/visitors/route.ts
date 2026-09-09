/**
 * POST /api/visitors
 * Atomically increments the visitor_count in site_stats.
 * Called once per session from the VisitorPing client component.
 *
 * GET /api/visitors
 * Returns the current visitor count (used by getSiteStats as fallback).
 */

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST() {
  try {
    const { data, error } = await supabaseAdmin.rpc('increment_stat', {
      stat_key: 'visitor_count',
    });
    if (error) throw error;
    return NextResponse.json({ count: data ?? 0 });
  } catch (err) {
    console.error('[POST /api/visitors]', err);
    return NextResponse.json({ error: 'Failed to increment' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('site_stats')
      .select('value')
      .eq('key', 'visitor_count')
      .single();
    if (error) throw error;
    return NextResponse.json({ count: data?.value ?? 0 });
  } catch (err) {
    console.error('[GET /api/visitors]', err);
    return NextResponse.json({ count: 0 });
  }
}
