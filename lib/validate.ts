/**
 * lib/validate.ts
 *
 * Small, dependency-free input helpers shared by API routes and UI.
 */

/**
 * Returns the URL normalised as a string if it is an absolute http(s) URL,
 * otherwise null. Use for any link that ends up in an `href`
 * (e.g. third-party `apply_link` values) so `javascript:`, `data:` and
 * relative/garbage values never reach the page.
 */
export function safeHttpUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  try {
    const url = new URL(trimmed);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : null;
  } catch {
    return null;
  }
}

/**
 * Parses a `?limit=` query value into an integer in [1, max].
 * Returns `fallback` when the value is missing or not a positive number.
 */
export function clampLimit(value: string | null, fallback: number, max = 100): number {
  if (value === null || value === '') return fallback;
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n) || n < 1) return fallback;
  return Math.min(n, max);
}

/**
 * Returns a new object containing only the allow-listed keys that are
 * present on `body`. Prevents callers from writing arbitrary columns
 * (mass assignment) when a request body is passed to `.insert()`/`.update()`.
 */
export function pick<K extends string>(
  body: unknown,
  allowed: readonly K[],
): Partial<Record<K, unknown>> {
  const out: Partial<Record<K, unknown>> = {};
  if (!body || typeof body !== 'object') return out;
  const src = body as Record<string, unknown>;
  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(src, key) && src[key] !== undefined) {
      out[key] = src[key];
    }
  }
  return out;
}

/* ── Writable columns per table (admin API routes) ───────────────────────
 * Keep in sync with supabase/schema.sql. Server-managed columns such as
 * id, created_at, updated_at, fts, approved_at are intentionally absent. */

export const JOB_FIELDS = [
  'title', 'company', 'location', 'type', 'salary', 'description',
  'apply_link', 'tags', 'deadline', 'batch_year', 'is_featured', 'status',
  'source', 'logo_url', 'banner_url',
] as const;

export const TOOL_FIELDS = [
  'name', 'description', 'url', 'category', 'icon_url', 'logo',
  'is_free', 'is_featured', 'votes',
] as const;

// category / read_time come from supabase/migrations/20261124000000_schema_sync.sql
export const BLOG_FIELDS = [
  'title', 'slug', 'excerpt', 'content', 'category', 'tags', 'cover_url',
  'read_time', 'author', 'published',
] as const;

export const ROADMAP_FIELDS = [
  'title', 'slug', 'description', 'category', 'cover_url', 'content',
  'tags', 'order',
] as const;

/** URL-safe slug: lowercase letters/digits separated by single hyphens. */
export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isSlug(value: unknown): value is string {
  return typeof value === 'string' && value.length <= 200 && SLUG_RE.test(value);
}

/** Canonical UUID (any version). */
export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: unknown): value is string {
  return typeof value === 'string' && UUID_RE.test(value);
}

/**
 * True when a Supabase/PostgREST error means "column does not exist"
 * (PostgREST PGRST204 schema-cache miss, Postgres 42703 undefined_column).
 */
export function isMissingColumnError(err: { code?: string } | null | undefined): boolean {
  return err?.code === 'PGRST204' || err?.code === '42703';
}
