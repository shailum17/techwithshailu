/**
 * lib/jobPipeline.ts
 *
 * Pure helpers for the job-fetch pipeline (app/api/cron/fetch-jobs).
 * Kept free of I/O so they can be unit-tested.
 */

/** The job types the site and its filters understand (see supabase/schema.sql). */
export type JobType = 'Internship' | 'Job' | 'Full-time';
export const JOB_TYPES: readonly JobType[] = ['Internship', 'Job', 'Full-time'];

export const JOB_SOURCES = ['unstop', 'adzuna', 'rapidapi'] as const;
export type JobSource = (typeof JOB_SOURCES)[number];

/**
 * Maps a source's employment-type value (e.g. JSearch "FULLTIME", "INTERN",
 * "PARTTIME", "CONTRACTOR") plus the title to one of the site's JobTypes.
 * Anything that mentions intern(ship) wins, so "Software Intern" stays an
 * Internship even if the source says FULLTIME.
 */
export function normalizeJobType(raw: unknown, title = ''): JobType {
  const value = String(raw ?? '').toLowerCase().replace(/[\s_-]+/g, '');
  if (value.includes('intern') || /\bintern(ship)?s?\b/i.test(title)) return 'Internship';
  if (value === 'fulltime') return 'Full-time';
  return 'Job';
}

export interface FetchFilters {
  type?: JobType;
  source?: JobSource;
  /** Case-insensitive substring of the job's location. */
  location?: string;
  /** Only listings posted within this many days (where the source supports it). */
  maxDays?: number;
}

/** Reads the admin panel's fetch filters from the request query string. */
export function parseFetchFilters(params: URLSearchParams): FetchFilters {
  const filters: FetchFilters = {};

  const type = params.get('type');
  if (type && (JOB_TYPES as readonly string[]).includes(type)) filters.type = type as JobType;

  const source = params.get('source');
  if (source && (JOB_SOURCES as readonly string[]).includes(source)) filters.source = source as JobSource;

  const location = params.get('location')?.trim();
  if (location) filters.location = location.slice(0, 100);

  const maxDays = Number(params.get('max_days'));
  if (Number.isInteger(maxDays) && maxDays > 0) filters.maxDays = Math.min(maxDays, 365);

  return filters;
}

/** Applies the type and location filters to already-fetched jobs. */
export function applyFetchFilters<T extends { type: string; location: string }>(
  jobs: T[],
  filters: FetchFilters,
): T[] {
  const loc = filters.location?.toLowerCase();
  return jobs.filter(job =>
    (!filters.type || job.type === filters.type) &&
    (!loc || job.location.toLowerCase().includes(loc)),
  );
}

/** JSearch `date_posted` value for a max-age in days. */
export function jsearchDatePosted(maxDays?: number): 'today' | '3days' | 'week' | 'month' | 'all' {
  if (!maxDays) return 'all';
  if (maxDays <= 1) return 'today';
  if (maxDays <= 3) return '3days';
  if (maxDays <= 7) return 'week';
  if (maxDays <= 30) return 'month';
  return 'all';
}

/**
 * Key used to treat two listings as the same job (case/whitespace-insensitive
 * title + company, truncated like the original in-memory dedupe).
 */
export function dedupeKey(title: string, company: string): string {
  const norm = (v: string, n: number) => v.toLowerCase().replace(/\s+/g, ' ').trim().slice(0, n);
  return `${norm(title, 60)}||${norm(company, 40)}`;
}

/** Splits an array into chunks of at most `size` items. */
export function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}
