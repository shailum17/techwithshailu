/**
 * lib/data/blog.ts
 *
 * Queries for the blog post page (app/blog/[slug]). Server-side only;
 * uses the anon client, so RLS (published = true) applies, and filters on
 * `published` as well for defence in depth.
 *
 * The post page used to load every published post — full HTML included —
 * on each request just to find one post and its sidebar. These queries are
 * bounded (one post plus at most RELATED_LIMIT + RECENT_POOL summaries),
 * and lists use summaries (no `content`; first_image_url for thumbnails).
 */

import { cache } from 'react';
import { supabase } from '@/lib/supabase';
import { isMissingColumnError } from '@/lib/validate';

/** A post without its HTML: what lists and the sidebar need. */
export interface BlogSummaryRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  published_at: string;
  read_time: string;
  cover_url?: string;
  tags?: string[];
  /** First <img> in the post (generated column), used when cover_url is empty. */
  first_image_url?: string | null;
}

export interface BlogPostRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  content: string;
  published_at: string;
  read_time: string;
  cover_url?: string;
  tags?: string[];
}

const COLUMNS = 'id,slug,title,excerpt,category,content,published_at,read_time,cover_url,tags';
const SUMMARY_COLUMNS = 'id,slug,title,excerpt,category,published_at,read_time,cover_url,tags,first_image_url';
/** Before migrations/20261126000300_blog_first_image.sql: derive the image from content. */
const LEGACY_SUMMARY_COLUMNS = 'id,slug,title,excerpt,category,published_at,read_time,cover_url,tags,content';
const NEWEST  = { ascending: false, nullsFirst: false } as const;

const FIRST_IMAGE_RE = /<img[^>]+src=["']([^"']+)["']/i;

type SummaryQuery = (columns: string) => PromiseLike<{ data: unknown; error: { code?: string; message: string } | null }>;

/**
 * Runs a summary query with first_image_url; if that column doesn't exist
 * yet, re-runs it selecting content and extracts the image in JS. Either
 * way the rows returned never include `content`.
 */
async function selectSummaries(query: SummaryQuery): Promise<{ data: BlogSummaryRow[]; error?: string }> {
  const res = await query(SUMMARY_COLUMNS);
  if (!res.error) return { data: (res.data ?? []) as BlogSummaryRow[] };
  if (!isMissingColumnError(res.error)) return { data: [], error: res.error.message };

  const legacy = await query(LEGACY_SUMMARY_COLUMNS);
  if (legacy.error) return { data: [], error: legacy.error.message };
  return {
    data: ((legacy.data ?? []) as (BlogSummaryRow & { content?: string })[]).map(({ content, ...row }) => ({
      ...row,
      first_image_url: (content ?? '').match(FIRST_IMAGE_RE)?.[1] ?? null,
    })),
  };
}

/** Every published post as a summary (no HTML), newest first, for the /blog list. */
export async function listPublishedSummaries(): Promise<BlogSummaryRow[]> {
  try {
    const { data, error } = await selectSummaries(cols =>
      supabase.from('blogs').select(cols).eq('published', true).order('published_at', NEWEST));
    if (error) console.error('[blog list]', error);
    return data;
  } catch (err) {
    console.error('[blog list]', err instanceof Error ? err.message : err);
    return [];
  }
}

export const RELATED_LIMIT = 4;
/** Newest other posts fetched for the "recent" list (5 shown after removing related ones). */
export const RECENT_POOL   = 10;

/**
 * One published post by slug, or null. Wrapped in React `cache` so the
 * page's generateMetadata and body share a single query per request.
 */
export const getPublishedPost = cache(async (slug: string): Promise<BlogPostRow | null> => {
  const { data, error } = await supabase
    .from('blogs')
    .select(COLUMNS)
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();
  if (error) {
    console.error('[blog post]', error.message);
    return null;
  }
  return (data as BlogPostRow | null) ?? null;
});

export interface SidebarPosts {
  /** Same category, newest first, max RELATED_LIMIT. */
  related: BlogSummaryRow[];
  /** Other categories' newest posts, max 5. */
  recent: BlogSummaryRow[];
  /** Any other posts, newest first, max 5 (fallback when both lists are empty). */
  otherPosts: BlogSummaryRow[];
}

/** Sidebar lists for a post (summaries, no HTML). Never throws; empty lists on errors. */
export async function getSidebarPosts(slug: string, category: string): Promise<SidebarPosts> {
  try {
    const [rel, rec] = await Promise.all([
      selectSummaries(cols => supabase.from('blogs').select(cols)
        .eq('published', true).eq('category', category).neq('slug', slug)
        .order('published_at', NEWEST).limit(RELATED_LIMIT)),
      selectSummaries(cols => supabase.from('blogs').select(cols)
        .eq('published', true).neq('slug', slug)
        .order('published_at', NEWEST).limit(RECENT_POOL)),
    ]);
    if (rel.error) console.error('[blog sidebar related]', rel.error);
    if (rec.error) console.error('[blog sidebar recent]', rec.error);

    const related = rel.data;
    const newest  = rec.data;
    const relatedSlugs = new Set(related.map(p => p.slug));

    return {
      related,
      recent:     newest.filter(p => !relatedSlugs.has(p.slug)).slice(0, 5),
      otherPosts: newest.slice(0, 5),
    };
  } catch (err) {
    console.error('[blog sidebar]', err instanceof Error ? err.message : err);
    return { related: [], recent: [], otherPosts: [] };
  }
}
