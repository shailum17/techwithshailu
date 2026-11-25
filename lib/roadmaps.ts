/**
 * lib/roadmaps.ts
 *
 * Fetches roadmap data DIRECTLY from Supabase — no static fallback.
 * Only used server-side (Server Components / API routes).
 *
 * Roadmaps are public, so this uses the anon client (RLS applies), not the
 * service-role key. Each row is parsed on its own: a row with malformed
 * `content` is logged and skipped instead of hiding every roadmap, and
 * resource links that aren't http(s) are dropped.
 *
 * DB schema used:
 *   roadmaps.title       — display title
 *   roadmaps.slug        — route param (e.g. "frontend")
 *   roadmaps.description — one-line description shown on cards
 *   roadmaps.content     — JSONB with two sections:
 *       content._meta    — { dotColor, subtitle }
 *       content.<nodeId> — { title, yt: [], web: [] }  (node resources)
 */

import { supabase } from './supabase';
import { safeHttpUrl } from './validate';
import type { RoadmapCategory, NodeResources } from '@/app/resources/roadmaps/data';
import type { Link } from '@/app/resources/roadmaps/[category]/resources-data';

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

/** Keeps only well-formed links with an http(s) URL. */
function safeLinks(value: unknown): Link[] {
  if (!Array.isArray(value)) return [];
  const out: Link[] = [];
  for (const l of value) {
    if (!l || typeof l !== 'object') continue;
    const url = safeHttpUrl((l as Link).url);
    if (url) out.push({ label: String((l as Link).label ?? ''), url });
  }
  return out;
}

/* ── Map a DB row → RoadmapCategory (throws on malformed content) ── */
function toCategory(row: RoadmapRow): RoadmapCategory {
  // Supabase may return JSONB as a string — parse it if needed
  const content = typeof row.content === 'string'
    ? JSON.parse(row.content)
    : row.content;

  const meta = content?._meta ?? {};

  // Separate _meta from node resources
  const nodeResources: Record<string, NodeResources> = {};
  if (content && typeof content === 'object') {
    for (const [key, val] of Object.entries(content)) {
      if (key !== '_meta' && val && typeof val === 'object' && 'title' in val && 'yt' in val) {
        const node = val as NodeResources;
        nodeResources[key] = { title: String(node.title ?? ''), yt: safeLinks(node.yt), web: safeLinks(node.web) };
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

/** toCategory for one row; logs and returns null instead of failing the whole list. */
function toCategorySafe(row: RoadmapRow): RoadmapCategory | null {
  try {
    return toCategory(row);
  } catch (err) {
    console.error(`[roadmaps] skipping "${row.slug}": malformed content —`, err instanceof Error ? err.message : err);
    return null;
  }
}

/* ── Fetch all roadmap categories (ordered) ─────────────────── */
export async function getRoadmapCategories(): Promise<RoadmapCategory[]> {
  try {
    const { data, error } = await supabase
      .from('roadmaps')
      .select('id, title, slug, description, content, tags, order')
      .order('order', { ascending: true });

    if (error) {
      console.error('[getRoadmapCategories]', error.message);
      return [];
    }
    if (!data?.length) return [];

    return (data as RoadmapRow[]).map(toCategorySafe).filter((c): c is RoadmapCategory => c !== null);
  } catch (err) {
    console.error('[getRoadmapCategories] fetch failed:', err instanceof Error ? err.message : err);
    return [];
  }
}

/* ── Fetch a single roadmap category by slug ────────────────── */
export async function getRoadmapCategory(slug: string): Promise<RoadmapCategory | null> {
  try {
    const { data, error } = await supabase
      .from('roadmaps')
      .select('id, title, slug, description, content, tags, order')
      .eq('slug', slug)
      .maybeSingle();

    if (error || !data) return null;

    return toCategorySafe(data as RoadmapRow);
  } catch (err) {
    console.error('[getRoadmapCategory] fetch failed:', err instanceof Error ? err.message : err);
    return null;
  }
}
