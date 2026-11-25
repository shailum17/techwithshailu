/**
 * lib/data/public.ts
 *
 * Read queries for public pages and the public API, shared so Server
 * Components query Supabase directly instead of calling this app's own
 * /api routes over HTTP.
 *
 * Why: server-side self-fetches all came from the server's own IP, so every
 * visitor shared one rate-limit bucket on /api/jobs (and /jobs is rendered
 * per request) — under traffic the API returned 429 and pages showed no jobs.
 * Direct queries also drop an HTTP hop and the dependency on
 * NEXT_PUBLIC_APP_URL pointing at the right deployment.
 *
 * Uses the anon client, so RLS still applies; live-only filters are also
 * applied here as defence in depth. Server-side only.
 */

import { cache } from 'react';
import { supabase } from '@/lib/supabase';
import { openDeadlineFilter } from '@/lib/jobPipeline';

/* eslint-disable @typescript-eslint/no-explicit-any */
export type JobRow  = Record<string, any> & { id: string; title: string; company: string };
export type ToolRow = Record<string, any> & { id: string; name: string };
/* eslint-enable @typescript-eslint/no-explicit-any */

export interface JobQuery {
  type?: string;
  location?: string;
  batchYear?: number;
  featured?: boolean;
  /** Full-text search over title, company, location, description. */
  q?: string;
  sort?: 'newest' | 'deadline';
  limit?: number;
  /** Rows to skip (used with limit for paging). */
  offset?: number;
}

/** Live jobs matching the query. Throws on database errors. */
export async function listLiveJobs(opts: JobQuery = {}): Promise<JobRow[]> {
  // Live and still open: past-deadline jobs are hidden even before the daily
  // cron marks them expired
  let query = supabase.from('jobs').select('*').eq('status', 'live').or(openDeadlineFilter());

  if (opts.type)                       query = query.eq('type', opts.type);
  if (opts.location)                   query = query.ilike('location', `%${opts.location}%`);
  if (Number.isFinite(opts.batchYear)) query = query.eq('batch_year', opts.batchYear as number);
  if (opts.featured)                   query = query.eq('is_featured', true);
  if (opts.q)                          query = query.textSearch('fts', opts.q, { type: 'websearch' });

  query = opts.sort === 'deadline'
    ? query.order('deadline', { ascending: true, nullsFirst: false })
    : query.order('created_at', { ascending: false });

  if (opts.limit) {
    const from = opts.offset ?? 0;
    query = query.range(from, from + opts.limit - 1);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as JobRow[];
}

/**
 * One live job by id, or null. Wrapped in React `cache` so a page's
 * generateMetadata and its body share a single query per request.
 */
export const getLiveJob = cache(async (id: string): Promise<JobRow | null> => {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .eq('status', 'live')
    .or(openDeadlineFilter())
    .maybeSingle();
  if (error) {
    // Malformed ids (not a uuid) come back as a query error — treat as not found
    console.warn('[getLiveJob]', error.message);
    return null;
  }
  return (data as JobRow) ?? null;
});

export interface ToolQuery {
  category?: string;
  featured?: boolean;
  q?: string;
  limit?: number;
  offset?: number;
}

/** AI tools matching the query, newest first. Throws on database errors. */
export async function listTools(opts: ToolQuery = {}): Promise<ToolRow[]> {
  let query = supabase.from('tools').select('*');

  if (opts.category) query = query.eq('category', opts.category);
  if (opts.featured) query = query.eq('is_featured', true);
  if (opts.q)        query = query.textSearch('fts', opts.q, { type: 'websearch' });

  query = query.order('created_at', { ascending: false });
  if (opts.limit) {
    const from = opts.offset ?? 0;
    query = query.range(from, from + opts.limit - 1);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as ToolRow[];
}

/** Featured items if any exist, otherwise the latest ones (home page sections). */
export async function featuredOrLatest<T>(
  fetcher: (featured: boolean) => Promise<T[]>,
): Promise<T[]> {
  try {
    const featured = await fetcher(true);
    if (featured.length > 0) return featured;
    return await fetcher(false);
  } catch (err) {
    console.error('[featuredOrLatest]', err instanceof Error ? err.message : err);
    return [];
  }
}

/* ── Sitemap ──────────────────────────────────────────────────────────── */

export interface SitemapRow { path: string; lastModified?: string }

/** Lightweight id/slug + timestamp lists for app/sitemap.ts. Never throw. */
export async function listSitemapJobs(max = 5000): Promise<SitemapRow[]> {
  const { data, error } = await supabase
    .from('jobs')
    .select('id, updated_at')
    .eq('status', 'live')
    .or(openDeadlineFilter())
    .order('updated_at', { ascending: false })
    .limit(max);
  if (error) { console.error('[sitemap jobs]', error.message); return []; }
  return (data ?? []).map(r => ({ path: `/jobs/${r.id}`, lastModified: r.updated_at ?? undefined }));
}

export async function listSitemapBlogs(max = 5000): Promise<SitemapRow[]> {
  const { data, error } = await supabase
    .from('blogs')
    .select('slug, updated_at, published_at')
    .eq('published', true)
    .order('published_at', { ascending: false })
    .limit(max);
  if (error) { console.error('[sitemap blogs]', error.message); return []; }
  return (data ?? []).map(r => ({
    path: `/blog/${encodeURIComponent(r.slug)}`,
    lastModified: r.updated_at ?? r.published_at ?? undefined,
  }));
}
