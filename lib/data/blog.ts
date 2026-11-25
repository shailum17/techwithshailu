/**
 * lib/data/blog.ts
 *
 * Queries for the blog post page (app/blog/[slug]). Server-side only;
 * uses the anon client, so RLS (published = true) applies, and filters on
 * `published` as well for defence in depth.
 *
 * The page used to load every published post — full HTML included — on
 * each request just to find one post and its sidebar. These queries are
 * bounded: one post plus at most RELATED_LIMIT + RECENT_POOL summaries.
 */

import { cache } from 'react';
import { supabase } from '@/lib/supabase';

export interface BlogPostRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  /** Needed by the sidebar's thumbnail fallback (first <img> in the post). */
  content: string;
  published_at: string;
  read_time: string;
  cover_url?: string;
  tags?: string[];
}

const COLUMNS = 'id,slug,title,excerpt,category,content,published_at,read_time,cover_url,tags';
const NEWEST  = { ascending: false, nullsFirst: false } as const;

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
  related: BlogPostRow[];
  /** Other categories' newest posts, max 5. */
  recent: BlogPostRow[];
  /** Any other posts, newest first, max 5 (fallback when both lists are empty). */
  otherPosts: BlogPostRow[];
}

/** Sidebar lists for a post. Never throws; returns empty lists on errors. */
export async function getSidebarPosts(slug: string, category: string): Promise<SidebarPosts> {
  try {
    const [rel, rec] = await Promise.all([
      supabase.from('blogs').select(COLUMNS)
        .eq('published', true).eq('category', category).neq('slug', slug)
        .order('published_at', NEWEST).limit(RELATED_LIMIT),
      supabase.from('blogs').select(COLUMNS)
        .eq('published', true).neq('slug', slug)
        .order('published_at', NEWEST).limit(RECENT_POOL),
    ]);
    if (rel.error) console.error('[blog sidebar related]', rel.error.message);
    if (rec.error) console.error('[blog sidebar recent]', rec.error.message);

    const related = (rel.data ?? []) as BlogPostRow[];
    const newest  = (rec.data ?? []) as BlogPostRow[];
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
