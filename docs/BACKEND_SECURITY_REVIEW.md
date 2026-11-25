# Backend Logic & Security Review — techwithshailu

_Static review of the server side (Next.js API routes in `app/api/**`, `lib/**`, `supabase/**`) at commit `9f7d9cc` (2026-11-25), after the 29 items in [`CODEBASE_ISSUES.md`](./CODEBASE_ISSUES.md) were resolved. This is a second pass: everything below is **new** or was not covered by that document._

Defensive review only. Nothing was run against production; findings were checked by reading the code, running the local tool chain, and small local reproductions where noted.

**Progress (2026-11-26): 18 of 18 issues fixed** on branch `claude/optimistic-johnson-8pnh5j`, worked from lowest to highest severity, one commit per issue. Tests went from 96 to 174; `npm audit --omit=dev` went from 8 advisories to **0**. See the [Resolution log](#resolution-log) at the end.

**Deployment checklist** (these fixes only take full effect in production after this):

1. **Set `ADMIN_SECRET` to at least 32 characters** in Vercel *before* deploying (e.g. `openssl rand -base64 36`). With a shorter one, admin login is refused in production (#11).
2. Run the new migrations in `supabase/migrations/` in order (see `supabase/README.md`):
   - `20261126000000_jobs_value_checks.sql` (#7)
   - `20261126000100_job_dedupe_key.sql` (#5): **deletes duplicate `pending_jobs` rows** before adding the unique index (keeps approved, then rejected, then the oldest pending; `jobs` is untouched)
   - `20261126000200_jobs_live_only_policy.sql` (#2)
3. After migrating, run the `pg_policies` check in `supabase/README.md`. On `jobs`, the only anon `SELECT` policy should be `status = 'live'`.
4. Log in to `/admin` again after the deploy. The session token format changed (#10).
5. Self-hosting only (not Vercel): set `TRUSTED_PROXY_HOPS` to the number of reverse proxies in front of the app (#12).
6. Optional: set `RATE_LIMIT_SALT` (#17).

**Behaviour changes to be aware of**

- `/api/jobs`, `/api/tools`, `/api/blogs` and `/api/roadmaps` now return one page (default 50, max 100; use `?limit` and `?offset`). `/api/blogs` list rows no longer include `content`. The admin panel reads tools from the new `/api/admin/tools`.
- Public list endpoints return **503** (not `200 []`) when the database is down. Server-rendered pages are unaffected; they query Supabase directly.
- `/api/db-check` now needs admin auth (the admin panel already sends it).
- **Logout signs out every admin session**, in all browsers.
- Admin writes return 400 with a message for invalid values. Blog slugs must be `lowercase-with-hyphens`, but an existing legacy slug can be re-saved unchanged.

---

## Summary

**Overall risk: Medium–High.** The application code is in good shape after the first pass (auth is timing-safe and rate-limited, writes are allow-listed, HTML is sanitized at write *and* render time, cron auth fails closed). The remaining risk comes mainly from **outdated dependencies with published critical advisories** and **one database policy that undoes the "live jobs only" rule**.

| Severity | Count |
|---|---|
| 🔴 High | 2 |
| 🟠 Medium | 4 |
| 🟡 Low | 9 |
| ⚪ Info | 3 |

**Top 3 actions**

1. Upgrade `next` to **15.5.29** (or later) and run `npm audit fix` — closes critical RCE advisories in the Image Optimization API, which this site uses (#1).
2. Drop the `using (true)` select policies on `jobs` with a new migration, so the public anon key can no longer read draft/expired jobs (#2).
3. Disable gray-matter's JavaScript front-matter engine in the Markdown upload route (#3).

### Tool-chain results (local)

| Check | Result |
|---|---|
| `npm test` (vitest) | ✅ 14 files, 96 tests passed |
| `npm run typecheck` | ✅ no errors |
| `npm run lint` | ✅ no errors |
| `npm audit --omit=dev` | ❌ 8 advisories: 1 critical, 4 high, 1 moderate, 2 low (table below) |
| Secret scan (`.env*` in git, hard-coded keys) | ✅ only `.env.example` with empty values is committed |

---

## Findings index

| # | Sev | Area | Title | Finding | Status |
|---|---|---|---|---|---|
| 1 | 🔴 | Dependencies | `next@15.5.19` has critical advisories (Image Optimization RCE, cache poisoning, DoS) | CONFIRMED (version) | ✅ Fixed |
| 2 | 🔴 | Supabase RLS | Leftover `using (true)` policies make **all** jobs (draft/expired) readable with the public anon key | CONFIRMED (SQL) | ✅ Fixed (needs migration) |
| 3 | 🟠 | Injection | Markdown upload evaluates `---js` front-matter with `eval()` on the server | CONFIRMED (local repro) | ✅ Fixed |
| 4 | 🟠 | Dependencies | `sanitize-html@2.13.1` has 5 XSS-class advisories | CONFIRMED (version) | ✅ Fixed |
| 5 | 🟠 | Job pipeline | De-duplication can miss existing jobs → duplicate rows in the review queue | CONFIRMED (logic) | ✅ Fixed (needs migration) |
| 6 | 🟠 | DoS / data | Public list endpoints are unbounded by default and only limited per instance | CONFIRMED | ✅ Fixed |
| 7 | 🟡 | Validation | Admin writes have no type/enum/URL validation; bad input returns 500/503 | CONFIRMED | ✅ Fixed (+ migration) |
| 8 | 🟡 | API | Non-UUID ids return 500; DELETE reports success for ids that don't exist | CONFIRMED | ✅ Fixed |
| 9 | 🟡 | API | `/api/admin/logs?limit=abc` (or negative) returns 500 | CONFIRMED | ✅ Fixed |
| 10 | 🟡 | Auth | Admin sessions can't be revoked; logout only clears the cookie | CONFIRMED (design) | ✅ Fixed |
| 11 | 🟡 | Auth | Failed-login limiter can be exceeded with parallel requests; no secret-strength check | PLAUSIBLE | ✅ Fixed (needs 32+ char secret) |
| 12 | 🟡 | Rate limiting | Client IP taken from first `X-Forwarded-For` entry — spoofable off Vercel | PLAUSIBLE (deployment-dependent) | ✅ Fixed |
| 13 | 🟡 | Exposure | `/api/db-check` is public, unthrottled and uses the service-role client | CONFIRMED | ✅ Fixed |
| 14 | 🟡 | Upload | `upload-md` has no size limit and doesn't validate `slug` / `cover_url` | CONFIRMED | ✅ Fixed |
| 15 | 🟡 | Error handling | Some routes turn DB failures into `200 []` | CONFIRMED | ✅ Fixed |
| 16 | ⚪ | Logic | `published: "true"` (string) can publish a post with `published_at = null` | PLAUSIBLE | ✅ Fixed |
| 17 | ⚪ | Crypto hygiene | Rate-limit IP salt falls back to `ADMIN_SECRET` / a constant | CONFIRMED | ✅ Fixed |
| 18 | ⚪ | Dependencies | `@supabase/supabase-js@2.49.4` low-severity advisory | CONFIRMED (version) | ✅ Fixed |

---

## 🔴 High

### 1. `next@15.5.19` has critical, exploitable advisories

**Where:** `package.json` (`"next": "^15.3.3"`, lockfile resolves `15.5.19`)

`npm audit` reports 17 advisories against the installed Next.js, including:

| Advisory | Severity | Fixed in | Applies here? |
|---|---|---|---|
| GHSA-2xp9-vwfh-vxw4 — unauthenticated RCE in Image Optimization API (AVIF) | critical | 15.5.24 | **Yes** – `next/image` is used in 3 components with `images.remotePatterns` set |
| GHSA-2464-fhr4-w9xw — unauthenticated RCE in Image Optimization API (SVG) | critical | 15.5.28 | **Yes** |
| GHSA-p293-qw3h-jr36 — RCE on Windows-hosted servers | critical | 15.5.24 | No (Vercel/Linux) |
| GHSA-mcj8-r9mp-w47p / GHSA-4jqv-mc3x-m676 — ISR/SSG cache poisoning | moderate | 15.5.27 | Mostly self-hosted |
| GHSA-m99w-x7hq-7vfj, GHSA-p3m5-59mp-jv5r — Server Actions DoS | high | 15.5.28 | Low (no Server Actions found) |
| GHSA-f3mh-rxg3-f5g2 — HttpOnly cookie exposure on Edge routes | moderate | 15.5.29 | Low (routes are Node runtime) — but the admin session is an HttpOnly cookie |

Transitive: `sharp@0.34.5` (libvips/libheif/librsvg CVEs, used by the image optimizer), `postcss`, `nanoid`, `source-map-js`.

**Abuse:** an anonymous visitor sends a crafted image request through `/_next/image` and may execute code on the server, which holds `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_SECRET`, and all API keys.

**Fix:**

```bash
npm install next@15.5.29
```

```bash
npm audit fix
```

Bump `eslint-config-next` to the matching version as well. Then re-run `npm run build`, `npm test`, and `npm audit --omit=dev`. Consider pinning `next` to an exact patch version in `package.json` so CI and production resolve the same build.

---

### 2. Non-live jobs are readable by anyone with the public anon key

**Where:**
- `supabase/schema.sql:279` — `create policy "public read jobs" on jobs for select using (true);`
- `supabase/rls_policies.sql:51-55` — `create policy "jobs: public select" on jobs for select using (true);` (the comment above it says "live jobs", the predicate says everything)
- `supabase/migrations/20260915000000_enable_rls_policies.sql:13-21` adds `jobs_public_read … using (status = 'live')` but only drops policies named `"allow all"`, `"Enable read access"`, `"public read"` — **not** `"public read jobs"` or `"jobs: public select"`.

Postgres RLS policies of the same command are **permissive and OR-ed together**. Following `supabase/README.md` (schema.sql → migrations, optionally rls_policies.sql) leaves at least one `using (true)` policy in place, so `status = 'live'` is never enforced at the database level.

The app's own queries filter `status = 'live'` (`lib/data/public.ts:39,67`), so pages look correct — the exposure is through the Supabase REST API directly, using `NEXT_PUBLIC_SUPABASE_ANON_KEY`, which is shipped to every browser.

**Abuse:** anyone can read draft and expired jobs (e.g. unpublished listings the admin is still editing) with `GET https://<project>.supabase.co/rest/v1/jobs?select=*` plus the public anon key.

**Evidence:** SQL read only — verify on the live DB with:

```sql
select policyname, cmd, qual from pg_policies where tablename = 'jobs';
```

**Fix:** new migration, e.g. `supabase/migrations/20261126000000_jobs_live_only_policy.sql`:

```sql
drop policy if exists "public read jobs"   on jobs;
drop policy if exists "jobs: public select" on jobs;

drop policy if exists "jobs_public_read" on jobs;
create policy "jobs_public_read" on jobs
  for select to anon, authenticated
  using (status = 'live');
```

Also change `schema.sql:279` and `rls_policies.sql:51-55` to `using (status = 'live')` so a fresh database is correct, and run the same `pg_policies` check for `blogs`, `tools`, `roadmaps`, `site_stats`. Add the check to `supabase/README.md`.

---

## 🟠 Medium

### 3. Markdown upload evaluates JavaScript front-matter (`eval`)

**Where:** `app/api/admin/blogs/upload-md/route.ts:61` — `matter(raw)`

`gray-matter@4.0.3` ships a `javascript` engine (`node_modules/gray-matter/lib/engines.js:36-43`) that runs front-matter through `eval()` when the file starts with `---js` or `---javascript`. It is enabled by default.

**Evidence (local, harmless):**

```js
matter('---js\n{ title: String(6*7), slug: typeof process }\n---\nbody')
// → { title: '42', slug: 'object' }   ← code ran with access to Node's `process`
```

**Abuse:** the route is admin-only, so this is not anonymous RCE. But the feature exists to upload Markdown files, which are often written by someone else (guest posts, copied templates). A file with a `---js` header runs arbitrary code on the server with access to the service-role key and every secret in the environment. Uploading a document should never mean running it.

**Fix:** disable the JS engines explicitly.

```ts
const NO_JS = () => { throw new Error('JavaScript front-matter is not allowed'); };

let parsed;
try {
  parsed = matter(raw, { engines: { js: NO_JS, javascript: NO_JS } });
} catch {
  return NextResponse.json({ error: 'Invalid front-matter (YAML only)' }, { status: 422 });
}
const { data, content: mdBody } = parsed as { data: FrontMatter; content: string };
```

Add a unit test that a `---js` file returns 422 and the code is not executed.

---

### 4. `sanitize-html@2.13.1` has known bypasses

**Where:** `package.json` pins `"sanitize-html": "2.13.1"`; used by `lib/sanitize.ts` for blog HTML and third-party job descriptions.

Advisories: GHSA-vccv-cmxp-4j9h, GHSA-g8qq-57p8-ggw5, GHSA-jxwj-j7wr-gfrw (mutation-XSS / `allowedTags` bypass), GHSA-x3q4-9hxx-gx8m, GHSA-cv27-6wvh-8x7j. Fixed in **2.18.2**.

The configured allow-lists avoid most of the listed attributes, but job descriptions come from **third-party APIs** (JSearch, Adzuna, Unstop) and are rendered with `dangerouslySetInnerHTML` (`app/jobs/[id]/page.tsx:211`). A parser-level bypass would give stored XSS on the public site. The CSP allows `'unsafe-inline'` scripts, so it does not fully contain this.

**Fix:**

```bash
npm install sanitize-html@2.18.2
```

Update `@types/sanitize-html` to the matching release and re-run `tests/sanitize.test.ts`.

---

### 5. Job-fetch de-duplication can miss existing rows

**Where:** `app/api/cron/fetch-jobs/route.ts:559-586`

Three gaps let the same listing be queued again:

1. **Exact vs. normalised match.** Existing rows are looked up with `.in('title', batch)` — an exact, case-sensitive match — but compared with `dedupeKey()`, which lower-cases and collapses whitespace. `"Software Engineer Intern"` in the DB isn't returned for an incoming `"Software engineer intern"`, so it's inserted as new.
2. **Lookup errors are ignored.** If a lookup batch fails (`error` at line 567), the loop `continue`s and those jobs are treated as new. A transient DB error duplicates up to 50 titles per failed batch.
3. **No DB constraint.** Two runs at the same time (cron + manual "Fetch now") both pass the check and both insert. Nothing in `pending_jobs` prevents duplicates.

**Abuse / impact:** not a security issue. It clutters the admin review queue and makes it easy to approve the same job twice.

**Fix:**

```sql
-- migration
alter table pending_jobs add column if not exists dedupe_key text
  generated always as (
    left(regexp_replace(lower(trim(title)), '\s+', ' ', 'g'), 60) || '||' ||
    left(regexp_replace(lower(trim(company)), '\s+', ' ', 'g'), 40)
  ) stored;
create unique index if not exists pending_jobs_dedupe_key_idx on pending_jobs(dedupe_key);
```

Then insert with `.upsert(rows, { onConflict: 'dedupe_key', ignoreDuplicates: true })`, and if a lookup batch errors, abort the insert (log `status: 'error'`) instead of continuing. Keep the `jobs`-table lookup, but query it on the same normalised key (add the same generated column to `jobs`).

---

### 6. Public list endpoints are unbounded by default

**Where:**
- `app/api/jobs/route.ts:42` — `limit: limit ? clampLimit(...) : undefined` → no `?limit` means **no limit**
- `app/api/tools/route.ts:33` — same pattern
- `app/api/blogs/route.ts:30` — `select('*')` with no limit, includes full post `content`
- `app/api/roadmaps/route.ts:27` — `select('*')` with no limit; `/api/roadmaps/[id]` has no rate limit at all

Each request returns every matching row with every column (full job descriptions, full blog HTML). The only protection is the **per-instance** in-memory limiter (120/min per IP per instance), which the first review (#14) noted doesn't hold across serverless instances. Supabase's `max-rows` (1000 by default) caps the worst case, but payloads still grow with content.

**Abuse:** cheap bandwidth/DB-load amplification; each call costs one full-table scan and a large response.

**Fix:** always apply a default and maximum, and select only the columns lists need:

```ts
limit: clampLimit(searchParams.get('limit'), 20, 100),   // default 20 even when absent
```

For blogs, list `id, title, slug, excerpt, cover_url, tags, category, read_time, published_at` and leave `content` to `/api/blogs/[id]`. Add `rateLimit(...)` to `GET /api/roadmaps/[id]`. Optionally add `Cache-Control: public, s-maxage=60` so Vercel's CDN absorbs repeat reads.

---

## 🟡 Low

### 7. Admin writes lack type / enum / URL validation

**Where:** `app/api/jobs/route.ts:57`, `app/api/jobs/[id]/route.ts:44`, `app/api/tools/**`, `app/api/roadmaps/**`, `app/api/blogs/**`, `app/api/admin/jobs/approve/route.ts:33-53`

`pick()` stops mass assignment, but the *values* aren't checked:

- `jobs.type` and approve `overrides.type` accept any string — a typo (`"Fulltime"`) silently hides the job from the site's type filter (`lib/jobPipeline.ts:9` lists the valid ones).
- `jobs.status` accepts any string — `"Live"` hides the job.
- `tools.url`, `tools.icon_url`, `blogs.cover_url`, `roadmaps.cover_url` aren't checked with `safeHttpUrl()`, unlike `apply_link`. `tools.url` is rendered as `href` (`components/ToolCard.tsx:146`, `app/ai-tools/AIToolsClient.tsx:262`). React 19 blocks `javascript:` hrefs, so this is defence in depth.
- `blogs.slug` accepts `/`, spaces and `?`, producing posts whose `/blog/[slug]` page can't be reached.
- `deadline` in approve is checked with `Date.parse()`, which accepts formats Postgres `::date` rejects → 500.
- Validation failures (missing `title`, wrong type) surface as **503 "Database error"** (`jobs/route.ts:72`, `tools/route.ts:58`, `roadmaps/route.ts:62`, `blogs/route.ts:74`), which looks like an outage.

**Fix:** a small per-table schema in `lib/validate.ts` (or `zod`), applied in each POST/PUT before the DB call, returning `400` with the field name:

```ts
export function validateJob(b: Partial<Record<(typeof JOB_FIELDS)[number], unknown>>, partial = false): string | null {
  if (!partial && (typeof b.title !== 'string' || !b.title.trim())) return 'title is required';
  if (b.type !== undefined && !(JOB_TYPES as readonly unknown[]).includes(b.type)) return `type must be one of ${JOB_TYPES.join(', ')}`;
  if (b.status !== undefined && !['live', 'draft', 'expired'].includes(b.status as string)) return 'invalid status';
  if (b.deadline && !/^\d{4}-\d{2}-\d{2}$/.test(String(b.deadline))) return 'deadline must be YYYY-MM-DD';
  return null;
}
export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
```

Use `safeHttpUrl()` for every URL column. Add `check` constraints in a migration for `jobs.type` and `jobs.status` so the DB enforces it too.

### 8. Non-UUID ids return 500; DELETE always reports success

**Where:** `app/api/{jobs,tools,roadmaps,blogs}/[id]/route.ts` PUT/DELETE, `app/api/admin/jobs/reject/route.ts:21`

A non-UUID id makes Postgres raise `22P02`, which the routes return as 500. DELETE uses `.delete().eq('id', id)` without `.select()`, so deleting an id that doesn't exist returns `{ success: true }`.

**Fix:** reuse the `UUID_RE` from `approve/route.ts:28` (move it to `lib/validate.ts`) and return 400 early; use `.delete().eq('id', id).select('id')` and return 404 when nothing was deleted.

### 9. `/api/admin/logs` crashes on a non-numeric `limit`

**Where:** `app/api/admin/logs/route.ts:17` — `Math.min(Number(searchParams.get('limit') ?? '100'), 500)`

`?limit=abc` → `NaN`; `?limit=-5` → `-5`. Both reach `.limit()` and PostgREST rejects them → 500.

**Fix:** `const limit = clampLimit(searchParams.get('limit'), 100, 500);` (helper already in `lib/validate.ts`).

### 10. Admin sessions can't be revoked

**Where:** `lib/adminSession.ts`, `app/api/admin/session/route.ts:43-47`

The session token is stateless (`exp.HMAC`). Logout clears the cookie in that browser, but a copied token stays valid for up to 8 hours. The only way to kill all sessions is to rotate `ADMIN_SECRET` (which also breaks scripts using the header).

**Fix (pick one):** shorten the TTL (e.g. 2 h) and slide it on activity; or add a `session_version` in `app_settings`, include it in the signed payload, and bump it on logout / "log out everywhere".

### 11. Failed-login limiter is check-then-act; no secret-strength check

**Where:** `lib/adminAuth.ts:32-44, 62-87`

The limiter first **peeks**, then compares, then records the failure. Parallel requests all pass the peek before any failure is recorded, so a burst can try many more than 20 keys per minute. If the `rate_limit_hit` RPC fails, it falls back to the per-instance limiter (`lib/sharedRateLimit.ts:56-59`). There is also no check that `ADMIN_SECRET` is long enough. With a 32+ character random secret this is not practically exploitable; with a short one it is.

**Fix:** at startup (or in `checkAdminKey`), refuse to authenticate if `ADMIN_SECRET.length < 32` and log why. Optionally record the attempt first (non-peek) and decrement on success, so concurrent attempts are counted.

### 12. Client IP comes from the first `X-Forwarded-For` entry

**Where:** `lib/rateLimit.ts:33-39`

On Vercel this header is set by the platform and is safe. On any other host (Docker, a VPS behind nginx, `next start` directly), the client controls the first entry, so every rate limit — including the admin brute-force limit — can be bypassed by sending a new fake IP with each request.

**Fix:** prefer the platform header (`x-vercel-forwarded-for` / `x-real-ip` on Vercel), and document in the README that self-hosting needs a proxy that overwrites `X-Forwarded-For`, or take the **last** trusted hop.

### 13. `/api/db-check` is public and unthrottled

**Where:** `app/api/db-check/route.ts`

It has no auth and no rate limit, and runs `count: 'exact'` on `jobs` with the service-role client on every call. The comment says only the admin dashboard uses it. It leaks only "up/down", but it's a free, uncached DB query for anyone.

**Fix:** add `checkAdminAuth(req)` (the admin panel already sends the session cookie), or at least `rateLimit()` and switch to `count: 'estimated'`.

### 14. `upload-md` has no size limit and doesn't validate fields

**Where:** `app/api/admin/blogs/upload-md/route.ts:53-68, 101-113`

- No size cap: the whole file is read into memory, parsed and rendered.
- `slug` is used as-is (see #7); `cover_url` isn't checked; `title` may be a non-string (YAML `title: 2026`).
- The extension check is case-sensitive (`.MD` is rejected).
- `isMissingCol` (line 137) retries without `category`/`read_time` whenever the error message contains the word "column" — that also matches unrelated errors (e.g. a not-null violation), hiding the real cause.

**Fix:** reject `file.size > 512 * 1024` with 413; validate `slug` with `SLUG_RE`, `cover_url` with `safeHttpUrl`, `title` as a non-empty string; use `/\.md$/i`; only retry on PostgREST code `PGRST204` / Postgres `42703` (undefined column).

### 15. DB failures returned as `200 []`

**Where:** `app/api/users/route.ts:29-31` (admin), `app/api/jobs/route.ts:46-48`, `app/api/tools/route.ts:37-39`, `app/api/blogs/route.ts:45-48`, `app/api/roadmaps/route.ts:40-43`

The public lists do this on purpose so pages degrade gracefully, but it means monitoring and clients can't tell "no data" from "database down". For the admin users list it's actively misleading: an outage looks like "no subscribers".

**Fix:** return `503` from the API routes (Server Components already query directly via `lib/data/public.ts` and can keep their own fallback). At minimum, fix `GET /api/users`.

---

## ⚪ Info

### 16. `published` isn't type-checked
`app/api/blogs/route.ts:62-63`, `app/api/blogs/[id]/route.ts:57-66`. A JSON body with `"published": "true"` (string) stores `published = true` (Postgres coerces it) but `resolvePublishedAt()` only reacts to the boolean `true`, so `published_at` stays `null`. Postgres sorts `NULL` **first** in `order by published_at desc`, so such a post sticks to the top of the blog. The admin UI sends booleans, so this needs a script or a bug in the UI. Fix: reject non-boolean `published` with 400.

### 17. Rate-limit salt fallback
`lib/sharedRateLimit.ts:20` uses `RATE_LIMIT_SALT || ADMIN_SECRET || 'techwithshailu'`. Reusing the admin secret as an HMAC key elsewhere isn't a vulnerability today, but key separation is cheap: require `RATE_LIMIT_SALT` in production, or derive it with `createHmac('sha256', ADMIN_SECRET).update('rate-limit-v1')` as `adminSession.ts` already does.

### 18. `@supabase/supabase-js@2.49.4`
GHSA-8r88-6cj9-9fh5 (low, `auth-js` path routing). This app doesn't use Supabase Auth, so impact is negligible; upgrade with the next dependency refresh.

---

## Dependency table (`npm audit --omit=dev`, 2026-11-25)

| Package | Installed | Severity | Advisories (examples) | Fixed version |
|---|---|---|---|---|
| next | 15.5.19 | **critical** | GHSA-2xp9-vwfh-vxw4, GHSA-2464-fhr4-w9xw, GHSA-p293-qw3h-jr36, GHSA-mcj8-r9mp-w47p, GHSA-f3mh-rxg3-f5g2 (+12) | 15.5.29 |
| sharp (via next) | 0.34.5 | high | GHSA-f88m-g3jw-g9cj, GHSA-rgj7-g3m4-5g8c, GHSA-wq5f-xc86-pv6w | 0.35.5 |
| postcss (via next) | 8.5.15 | high | GHSA-qx2v-qp2m-jg93, GHSA-6g55-p6wh-862q | 8.5.33 |
| nanoid (via next) | 3.3.15 | high | GHSA-28wg-ghj8-5hjv, GHSA-2v37-7h3g-55p8 | 3.3.20 |
| source-map-js | 1.2.1 | high | GHSA-68fv-2mgg-jv7q | 1.2.4 |
| sanitize-html | 2.13.1 | moderate | GHSA-vccv-cmxp-4j9h, GHSA-jxwj-j7wr-gfrw (+3) | 2.18.2 |
| @supabase/supabase-js / auth-js | 2.49.4 | low | GHSA-8r88-6cj9-9fh5 | 2.119.2 |

`gray-matter@4.0.3` has no advisory, but see #3 for its unsafe default.

---

## What was checked and found OK

- **Auth on every admin route:** each `app/api/admin/**` handler and every POST/PUT/DELETE on `jobs`, `tools`, `roadmaps`, `blogs`, plus `GET /api/users`, calls `checkAdminAuth()` first. Cron accepts `CRON_SECRET` only when it is set (timing-safe).
- **Session cookie:** HttpOnly, `SameSite=Strict`, `Secure` in production, HMAC-signed with a derived key, expiry checked; cross-origin non-GET requests are rejected.
- **Mass assignment:** all admin writes go through `pick()` allow-lists; `POST /api/users` forces `role: 'user'`.
- **No email enumeration** on subscribe; signups and visitor pings use the shared (DB-backed) limiter.
- **XSS:** blog HTML is sanitized on write and again on render; job descriptions are sanitized on render via `formatJobDescription()`; `apply_link` goes through `safeHttpUrl()` on write and render.
- **SQL injection:** all queries use the Supabase query builder; no raw SQL or `.or()` string building with user input. `security definer` functions pin `search_path` and are `revoke`d from `anon`/`authenticated`.
- **Approve is atomic** (row lock + single transaction) and only approves `status = 'pending'` rows.
- **Secrets:** the service-role key fails loudly when missing; no secrets committed; errors aren't echoed to clients.
- **Outbound fetches** in the cron route have timeouts; no endpoint fetches a user-supplied URL (no SSRF).

---

## Suggested order of work

1. **#1** dependency upgrade (`next`, then `npm audit fix`) — one PR, run the build + tests.
2. **#2** RLS migration, then verify with `pg_policies` on the live project.
3. **#3, #4** gray-matter engine + sanitize-html upgrade (small, with tests).
4. **#5, #6** pipeline de-dup constraint and default list limits.
5. **#7–#15** validation and error-handling clean-up, ideally as one shared `lib/validate.ts` change.

---

## Resolution log

Fixed 2026-11-26, from lowest to highest severity. Each fix has its own commit and tests. Every commit passed lint, typecheck and the full test suite.

| # | Commit | What changed |
|---|---|---|
| 18 | `4c25ebf` | `@supabase/supabase-js` 2.49.4 → 2.119.2. |
| 17 | `79235e8` | IP-hash salt is `RATE_LIMIT_SALT` or an HMAC-derived key, never `ADMIN_SECRET` itself (`lib/sharedRateLimit.ts`). |
| 16 | `a5435b3` | Blog create/update reject a non-boolean `published` (400). Added `tests/helpers/fakeSupabase.ts` for route tests. |
| 15 | `076c062` | `GET /api/{jobs,tools,blogs,roadmaps,users}` return 503 on DB failure instead of `200 []`. |
| 14 | `8277dec` | `upload-md`: 512 KB cap (413), `.md` case-insensitive, slug/title/`cover_url` validated, and the fallback only retries on a real missing-column error (`PGRST204`/`42703`). |
| 13 | `b75ee78` | `/api/db-check` requires admin auth and uses `count: 'estimated'`. |
| 12 | `79b1727` | `clientIp()` uses the first `X-Forwarded-For` entry only on Vercel. Elsewhere it takes the entry `TRUSTED_PROXY_HOPS` from the right (default 1). |
| 11 | `8c9ec1b` | Every admin-key comparison is counted **before** comparing (60/min per IP), so parallel bursts can't beat the 20/min failure limit. Production refuses an `ADMIN_SECRET` under 32 characters. Cookie sessions are still never counted. |
| 10 | `5dfe10b` | Session tokens carry a signed epoch stored in `app_settings` (`admin_session`). Logout with a valid session bumps the epoch, revoking every session including copied cookies. If `app_settings` can't be read, it falls back to epoch 0 (the old behaviour). |
| 9 | `7662869` | `/api/admin/logs` uses `clampLimit()`. |
| 8 | `1aa8849` | Non-UUID path ids → 404 with no DB call. `reject` needs a UUID `jobId` (400). DELETE returns 404 when nothing was deleted. `UUID_RE`/`isUuid` are shared from `lib/validate.ts`. |
| 7 | `b6abead` | `validateJob/Tool/Blog/Roadmap` check required fields, enums, `YYYY-MM-DD` dates, http(s) URLs, tags, booleans and integers. Bad JSON → 400. Constraint errors → 400/409 via `writeErrorStatus()`. PUT on a missing row → 404 (it was returning 500 from `PGRST116`). Approve overrides use the same validator. Migration adds `NOT VALID` checks on `jobs.type`/`status`. **Also fixes "Add job" without a deadline**, which sent `''` to a `date` column and failed with 503. |
| 6 | `550879d` | Public lists are always paged (default 50, max 100, `?offset`). The `/api/blogs` list omits `content`. `GET /api/roadmaps/:id` is rate-limited. New `GET /api/admin/tools`. |
| 5 | `b9fce76` | Generated `dedupe_key` column on `pending_jobs`/`jobs` (same normalisation as `dedupeKey()`), with a unique index on `pending_jobs`. Lookups use the key. A failed lookup aborts the insert. Inserts use `ON CONFLICT DO NOTHING`. The old behaviour is kept as a fallback until the migration is applied. |
| 4 | `d6be12d` | `sanitize-html` 2.13.1 → 2.18.2, with regression tests for the advisory payload classes. |
| 3 | `eed50af` | `upload-md` accepts YAML front-matter only (`matter.language()` checked first), and the js/javascript/coffee engines are replaced with ones that throw. A test proves a `---js` payload is not executed. |
| 2 | `95e11e6` | Migration drops the `using (true)` job read policies and recreates the live-only one. `schema.sql` and `rls_policies.sql` were corrected too. **Verified on local Postgres 16** with Supabase-like roles: before the fix, `anon` could read a draft job; after it, only live jobs, on an upgraded DB, a fresh DB, and with `rls_policies.sql` run afterwards. |
| 1 | `c4d6b19` | `next` 15.5.19 → 15.5.29 (and `eslint-config-next`). `npm audit fix` updated sharp, postcss, nanoid and source-map-js. An `overrides` entry moves Next's pinned `postcss@8.4.31` to 8.5.33, since the upstream fix is only in Next 16. A clean `npm ci` + `next build` passes and the production server was smoke-tested. |

**Final checks:** 174 tests pass, `tsc --noEmit` and `eslint` are clean, `next build` succeeds, and `npm audit --omit=dev` finds **0 vulnerabilities**.

