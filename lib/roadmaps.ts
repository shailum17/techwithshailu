/**
 * lib/roadmaps.ts
 *
 * Fetches roadmap data DIRECTLY from Supabase — no static fallback.
 * Only used server-side (Server Components / API routes).
 *
 * DB schema used:
 *   roadmaps.title       — display title
 *   roadmaps.slug        — route param (e.g. "frontend")
 *   roadmaps.description — one-line description shown on cards
 *   roadmaps.content     — JSONB with two sections:
 *       content._meta    — { dotColor, subtitle }
 *       content.<nodeId> — { title, yt: [], web: [] }  (node resources)
 */

import { supabaseAdmin } from './supabase';
import type { RoadmapCategory, NodeResources } from '@/app/resources/roadmaps/data';

/* ── DB row shape ───────────────────────────────────────────── */
interface RoadmapRow {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  content: {
    _meta?: { dotColor?: string; subtitle?: string };
    [nodeId: string]: NodeResources | { dotColor?: string; subtitle?: string } | undefined;
  } | null;
  tags: string[];
  order: number;
}

/* ── Map a DB row → RoadmapCategory ─────────────────────────── */
function toCategory(row: RoadmapRow): RoadmapCategory {
  // Supabase may return JSONB as a string — parse it if needed
  const content = typeof row.content === 'string'
    ? JSON.parse(row.content)
    : row.content;

  const meta = content?._meta ?? {};

  // Separate _meta from node resources
  const nodeResources: Record<string, NodeResources> = {};
  if (content) {
    for (const [key, val] of Object.entries(content)) {
      if (key !== '_meta' && val && typeof val === 'object' && 'title' in val && 'yt' in val) {
        nodeResources[key] = val as NodeResources;
      }
    }
  }

  return {
    id:            row.slug,
    title:         row.title,
    subtitle:      meta.subtitle      ?? row.description ?? '',
    description:   row.description    ?? '',
    dotColor:      meta.dotColor      ?? '#A8E63D',
    resources:     [],
    nodeResources: Object.keys(nodeResources).length > 0 ? nodeResources : undefined,
    tags:          row.tags ?? [],
  };
}

/* ── Fetch all roadmap categories (ordered) ─────────────────── */
export async function getRoadmapCategories(): Promise<RoadmapCategory[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('roadmaps')
      .select('id, title, slug, description, content, tags, order')
      .order('order', { ascending: true });

    if (error) {
      console.error('[getRoadmapCategories]', error.message);
      return [];
    }
    if (!data?.length) return [];

    return (data as RoadmapRow[]).map(toCategory);
  } catch (err) {
    console.error('[getRoadmapCategories] fetch failed:', err instanceof Error ? err.message : err);
    return [];
  }
}

/* ── Fetch a single roadmap category by slug ────────────────── */
export async function getRoadmapCategory(slug: string): Promise<RoadmapCategory | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('roadmaps')
      .select('id, title, slug, description, content, tags, order')
      .eq('slug', slug)
      .single();

    if (error || !data) return null;

    return toCategory(data as RoadmapRow);
  } catch (err) {
    console.error('[getRoadmapCategory] fetch failed:', err instanceof Error ? err.message : err);
    return null;
  }
}
