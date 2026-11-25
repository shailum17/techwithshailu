/**
 * lib/validate.ts
 *
 * Small, dependency-free input helpers shared by API routes and UI.
 */

import { JOB_TYPES } from '@/lib/jobPipeline';

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

/* ── Value validation for admin writes ────────────────────────────────────
 * pick() decides *which* columns may be written; these decide whether the
 * *values* are acceptable. Each returns { error } or { value } where value
 * is the normalised body ('' → null for dates/optional URLs, trimmed strings).
 */

export const JOB_STATUS_VALUES = ['live', 'draft', 'expired'] as const;

type Body = Record<string, unknown>;
export type Checked = { ok: false; error: string } | { ok: true; value: Body };

const fail = (error: string): Checked => ({ ok: false, error });

function checkString(b: Body, key: string, { required = false, max = 10_000 } = {}): string | null {
  const v = b[key];
  if (v === undefined) return required ? `${key} is required` : null;
  if (v === null && !required) return null;
  if (typeof v !== 'string') return `${key} must be a string`;
  if (required && !v.trim()) return `${key} is required`;
  if (v.length > max) return `${key} is too long (max ${max} characters)`;
  return null;
}

/** Optional http(s) URL: '' / null clear it; anything else must be http(s). Normalises in place. */
function checkUrl(b: Body, key: string, { required = false } = {}): string | null {
  const v = b[key];
  if (v === undefined) return required ? `${key} is required` : null;
  if ((v === '' || v === null) && !required) { b[key] = null; return null; }
  const url = safeHttpUrl(v);
  if (!url) return `${key} must be an http(s) URL`;
  b[key] = url;
  return null;
}

function checkTags(b: Body): string | null {
  const v = b.tags;
  if (v === undefined || v === null) return null;
  if (!Array.isArray(v) || !v.every(t => typeof t === 'string') || v.length > 50) {
    return 'tags must be an array of up to 50 strings';
  }
  b.tags = v.map(t => t.trim()).filter(Boolean);
  return null;
}

function checkBool(b: Body, key: string): string | null {
  return b[key] === undefined || typeof b[key] === 'boolean' ? null : `${key} must be true or false`;
}

function checkInt(b: Body, key: string, min: number, max: number, { nullable = true } = {}): string | null {
  const v = b[key];
  if (v === undefined || (v === null && nullable)) return null;
  if (v === '' && nullable) { b[key] = null; return null; }
  if (!Number.isInteger(v) || (v as number) < min || (v as number) > max) {
    return `${key} must be a whole number between ${min} and ${max}`;
  }
  return null;
}

/** YYYY-MM-DD calendar date, or ''/null to clear. */
export function checkDate(b: Body, key: string): string | null {
  const v = b[key];
  if (v === undefined) return null;
  if (v === '' || v === null) { b[key] = null; return null; }
  if (typeof v !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return `${key} must be a date (YYYY-MM-DD)`;
  const d = new Date(`${v}T00:00:00Z`);
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== v) return `${key} is not a valid date`;
  return null;
}

function checkEnum(b: Body, key: string, allowed: readonly string[]): string | null {
  const v = b[key];
  if (v === undefined) return null;
  return typeof v === 'string' && allowed.includes(v) ? null : `${key} must be one of: ${allowed.join(', ')}`;
}

function run(b: Body, checks: (string | null)[]): Checked {
  const error = checks.find(Boolean);
  return error ? fail(error) : { ok: true, value: b };
}

/** `partial` = update (PUT): required fields may be omitted but not blanked. */
export function validateJob(input: Body, partial = false): Checked {
  const b = { ...input };
  return run(b, [
    checkString(b, 'title', { required: !partial || 'title' in b, max: 300 }),
    checkString(b, 'company', { required: !partial || 'company' in b, max: 200 }),
    checkString(b, 'location', { max: 200 }),
    checkString(b, 'salary', { max: 100 }),
    checkString(b, 'description', { max: 100_000 }),
    checkString(b, 'source', { max: 50 }),
    checkEnum(b, 'type', JOB_TYPES),
    checkEnum(b, 'status', JOB_STATUS_VALUES),
    checkDate(b, 'deadline'),
    checkInt(b, 'batch_year', 2000, 2100),
    checkTags(b),
    checkBool(b, 'is_featured'),
    checkUrl(b, 'apply_link'),
    checkUrl(b, 'logo_url'),
    checkUrl(b, 'banner_url'),
  ]);
}

export function validateTool(input: Body, partial = false): Checked {
  const b = { ...input };
  return run(b, [
    checkString(b, 'name', { required: !partial || 'name' in b, max: 200 }),
    checkString(b, 'description', { max: 5_000 }),
    checkString(b, 'category', { max: 100 }),
    checkUrl(b, 'url', { required: !partial || 'url' in b }),
    checkUrl(b, 'icon_url'),
    checkUrl(b, 'logo'),
    checkBool(b, 'is_free'),
    checkBool(b, 'is_featured'),
    checkInt(b, 'votes', 0, 10_000_000, { nullable: false }),
  ]);
}

const SLUG_MESSAGE = 'slug must be lowercase letters, digits and single hyphens (e.g. my-first-post)';

/**
 * Blog slug rule. `currentSlug` (updates only) lets a legacy slug that
 * predates the format rules be re-saved unchanged; a *new* slug must match.
 */
export function checkBlogSlug(slug: unknown, currentSlug?: string | null): string | null {
  if (currentSlug !== undefined && slug === currentSlug) return null;
  return isSlug(slug) ? null : SLUG_MESSAGE;
}

/**
 * Blog posts. With `partial` (PUT) the slug *format* is not checked here —
 * the route checks it with checkBlogSlug() once it knows the current slug.
 */
export function validateBlog(input: Body, partial = false): Checked {
  const b = { ...input };
  return run(b, [
    checkString(b, 'title', { required: !partial || 'title' in b, max: 300 }),
    partial ? null : (b.slug === undefined ? 'slug is required' : checkBlogSlug(b.slug)),
    checkString(b, 'excerpt', { max: 2_000 }),
    checkString(b, 'content', { max: 500_000 }),
    checkString(b, 'category', { max: 100 }),
    checkString(b, 'read_time', { max: 50 }),
    checkString(b, 'author', { max: 100 }),
    checkUrl(b, 'cover_url'),
    checkTags(b),
    checkBool(b, 'published'),
  ]);
}

export function validateRoadmap(input: Body, partial = false): Checked {
  const b = { ...input };
  return run(b, [
    checkString(b, 'title', { required: !partial || 'title' in b, max: 300 }),
    b.slug === undefined
      ? (partial ? null : 'slug is required')
      : (isSlug(b.slug) ? null : SLUG_MESSAGE),
    checkString(b, 'category', { required: !partial || 'category' in b, max: 100 }),
    checkString(b, 'description', { max: 5_000 }),
    checkString(b, 'content', { max: 500_000 }),
    checkUrl(b, 'cover_url'),
    checkTags(b),
    checkInt(b, 'order', -100_000, 100_000, { nullable: false }),
  ]);
}

/**
 * Maps a write error to a response status/message: client-side data
 * problems (constraint violations, bad casts) → 400/409, anything else →
 * 503. Never returns the database's own message.
 */
export function writeErrorStatus(err: { code?: string } | null | undefined): { status: number; error: string } {
  switch (err?.code) {
    case '23505': return { status: 409, error: 'A record with the same unique value (e.g. slug or name) already exists' };
    case '23502': return { status: 400, error: 'A required field is missing' };
    case '23514': return { status: 400, error: 'A field has a value that is not allowed' };
    case '22P02':
    case '22007':
    case '22008': return { status: 400, error: 'A field has an invalid format' };
    default:      return { status: 503, error: 'Database error' };
  }
}
