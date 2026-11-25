# Codebase Issues — techwithshailu

_Static review of the repository as of commit `df79927` (2026-11-24). The Status column and the "Resolution log" at the end track what has been fixed since._

**Progress (2026-11-25): 29 of 29 issues completed.** Every 🔴 high, 🟠 medium and 🟡 low issue is done. Items marked *needs migration* or *needs env* take effect in production only after the deployment steps below.

**Deployment checklist:**
1. Run the new migrations in `supabase/migrations/` in order (see `supabase/README.md`): `20261124000000_schema_sync`, `20261125000000_app_settings`, `20261125000100_rate_limits`, `20261125000200_approve_pending_job`, `20261125000300_keep_reviewed_pending_jobs`.
2. In Vercel set `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` (optionally `RATE_LIMIT_SALT`), then delete or disable the old **unsigned** upload preset in Cloudinary.
3. Make sure `CRON_SECRET` and `ADMIN_SECRET` are set; with `CRON_SECRET` unset, the scheduled fetch is refused.

Severity scale: **🔴 High** (security hole or user-visible breakage) · **🟠 Medium** (wrong behaviour / reliability risk) · **🟡 Low** (hardening, hygiene, maintainability).

## Summary

| # | Severity | Area | Issue | Status |
|---|---|---|---|---|
| 1 | 🔴 | Security | Cron endpoint auth bypass when `CRON_SECRET` is unset | ✅ Completed (via #20) |
| 2 | 🔴 | Jobs pipeline | Approved and rejected jobs come back into the pending queue on the next run | ✅ Completed (needs migration) |
| 3 | 🔴 | Reliability | SSR pages calling `/api/jobs` share a single rate-limit bucket → empty job lists under traffic | ✅ Completed |
| 4 | 🔴 | SEO | Sitemap advertises 5 URLs that all return 404 | ✅ Completed |
| 5 | 🟠 | Admin | Admin lists use public endpoints → draft blogs / non-live jobs are invisible to the admin | ✅ Completed |
| 6 | 🟠 | Admin | Users view always fails (no admin key sent) | ✅ Completed (via #17) |
| 7 | 🟠 | Blog | Every edit of a published post resets `published_at` | ✅ Completed |
| 8 | 🟠 | Jobs pipeline | Admin fetch filters (type/source/location/max_days) are ignored by the API | ✅ Completed |
| 9 | 🟠 | Jobs pipeline | Telegram alert is fire-and-forget and can be dropped | ✅ Completed |
| 10 | 🟠 | Jobs pipeline | Sequential N+1 DB queries in cron risk the 60 s timeout | ✅ Completed |
| 11 | 🟠 | Jobs pipeline | JSearch `type` values don't match the site's type filter | ✅ Completed |
| 12 | 🟠 | Admin | "Schedule" settings are cosmetic — saved only to localStorage | ✅ Completed (needs migration) |
| 13 | 🟠 | Abuse | `/api/visitors` and `/api/users` POST have no rate limiting | ✅ Completed (needs migration) |
| 14 | 🟠 | Rate limiting | In-memory limiter is per-instance and unreliable on serverless | ✅ Completed (needs migration) |
| 15 | 🟠 | Data | Approve flow is not atomic (insert then delete) | ✅ Completed (needs migration) |
| 16 | 🟡 | Admin | Login screen accepts any key without validating it | ✅ Completed |
| 17 | 🟡 | Security | Admin key stored in `sessionStorage` + CSP allows `unsafe-inline`/`unsafe-eval` | ✅ Completed (inline scripts accepted, see log) |
| 18 | 🟡 | Security | Unsigned Cloudinary upload preset is public | ✅ Completed (needs env + preset disabled) |
| 19 | 🟡 | Security | Admin write routes insert/update the raw request body | ✅ Completed |
| 20 | 🟡 | Security | Cron route uses non-constant-time secret comparison and no rate limit | ✅ Completed |
| 21 | 🟡 | API | `limit` query param is unbounded / unvalidated | ✅ Completed |
| 22 | 🟡 | API | Internal DB error messages returned to clients | ✅ Completed |
| 23 | 🟡 | Config | Domain inconsistency: `.com` vs `.in` | ✅ Completed |
| 24 | 🟡 | Database | SQL files drift: `increment_stat` not defined in repo, duplicate migrations | ✅ Completed |
| 25 | 🟡 | Docs/Deps | README and package.json describe MongoDB; `mongoose` unused | ✅ Completed |
| 26 | 🟡 | Tooling | No ESLint installed, no tests, no CI, no `.env.example` | ✅ Completed |
| 27 | 🟡 | Maintainability | 3,700-line admin page and duplicated pending-jobs UI | ✅ Completed |
| 28 | 🟡 | Dead code | `/resources/[slug]` route has an empty data map | ✅ Completed |
| 29 | 🟡 | Security | `apply_link` from third parties is never validated | ✅ Completed |

---

## 🔴 High

### 1. Cron endpoint auth bypass when `CRON_SECRET` is unset
**File:** `app/api/cron/fetch-jobs/route.ts` (main `GET` handler)

```ts
if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && adminKey !== process.env.ADMIN_SECRET)
```
If `CRON_SECRET` is missing in any environment (preview deploys, local, misconfigured prod), the template string becomes `"Bearer undefined"`. Anyone sending `Authorization: Bearer undefined` passes auth and can trigger the job fetch. That burns RapidAPI/Adzuna quota, floods `pending_jobs`, and spams Telegram.

**Fix:** Fail closed when the env var is missing. Reuse the timing-safe comparison from `lib/adminAuth.ts` for both secrets.

### 2. Approved and rejected jobs re-enter the pending queue
**Files:** `app/api/cron/fetch-jobs/route.ts`, `app/api/admin/jobs/approve/route.ts`, `app/api/admin/jobs/reject/route.ts`

The cron dedupe only checks `pending_jobs` (`.eq('title').eq('company')`). Approving a job moves it to `jobs` and **deletes** it from `pending_jobs`, and rejecting a job deletes it outright. On the next daily run, the same listing is fetched again, isn't found in `pending_jobs`, and is re-queued. The admin ends up re-reviewing (and possibly double-publishing) the same jobs every day.

**Fix:** Also dedupe against `jobs`. Keep rejected rows, for example with `status = 'rejected'` in `pending_jobs` or a `rejected_jobs` table, instead of deleting them. Dedupe on a stable key such as `apply_link` or a source ID, with a unique index.

### 3. SSR self-fetches share one rate-limit bucket
**Files:** `app/page.tsx`, `app/jobs/page.tsx`, `app/jobs/[id]/page.tsx`, `lib/rateLimit.ts`

Server Components fetch `${NEXT_PUBLIC_APP_URL}/api/jobs` over HTTP. Those requests come from the server, not from the visitor, so every page render counts against the same IP key: the function's egress IP, or `'anonymous'` when no forwarding header exists. `/api/jobs` allows 120 req/min per key. `/jobs` uses `cache: 'no-store'`, so every page view makes such a request. Above roughly 120 views/min on an instance, the API returns 429, and the pages treat `!res.ok` as "no jobs", so users see an empty jobs board.

The extra HTTP hop also adds latency. It also breaks on preview deployments where `NEXT_PUBLIC_APP_URL` points somewhere else.

**Fix:** In Server Components, query Supabase directly through a shared data function, as `app/blog/page.tsx` already does, instead of calling your own API over HTTP.

### 4. Sitemap lists 5 URLs that return 404
**Files:** `app/sitemap.ts`, `app/resources/[slug]/page.tsx`

The sitemap advertises `/resources/frontend`, `/resources/dsa`, `/resources/backend`, `/resources/system-design` and `/resources/aiml`. These resolve to `app/resources/[slug]/page.tsx`, whose `roadmapData` map is **empty** (`{}`), so every one calls `notFound()`. The real roadmap pages live under `/resources/roadmaps/[category]`. The sitemap also omits all dynamic pages (`/jobs/[id]`, `/blog/[slug]`) and other resource sections.

**Fix:** Point the URLs at `/resources/roadmaps/<category>`. Generate job and blog entries from Supabase.

---

## 🟠 Medium

### 5. Admin can't see drafts or non-live content
**File:** `app/admin/page.tsx` (~line 3435)

The admin dashboard loads its lists through `fetch('/api/jobs')`, `fetch('/api/tools')` and `fetch('/api/blogs')`. These are public endpoints using the **anon** client, and RLS only returns `status = 'live'` jobs and `published = true` blogs. As a result:
- an unpublished or draft blog post disappears from the admin list once saved, so it can't be edited or published from the UI;
- expired or draft jobs can't be managed.

**Fix:** Add admin-only list endpoints, for example `/api/admin/blogs` and `/api/admin/jobs`, that use `supabaseAdmin`.

### 6. Users view always fails
**File:** `app/admin/page.tsx` (`UsersView`, ~line 3131)

`fetch('/api/users')` is sent **without** the `x-admin-key` header. The route is admin-only, so it always returns 401 and the subscriber count never shows.

**Fix:** Pass `adminKey` into `UsersView` and send the header.

### 7. Editing a published post resets its publish date
**File:** `app/api/blogs/[id]/route.ts` (`PUT`)

```ts
if (body.published === true) body.published_at = new Date().toISOString();
```
The admin form always sends the full form, including `published: true`. Every typo fix on a live post bumps it to "just published", which changes post order and misleads readers.

**Fix:** Set `published_at` only when it is currently `null`, i.e. on the first publish.

### 8. Admin fetch filters are silently ignored
**Files:** `app/admin/page.tsx` (`buildFetchUrl`), `app/api/cron/fetch-jobs/route.ts`

The admin UI sends `type`, `source`, `location` and `max_days` query params, but the route only reads `q`. The filters do nothing, while the UI suggests they work.

### 9. Telegram notification may be dropped
**File:** `app/api/cron/fetch-jobs/route.ts`

`fetch('https://api.telegram.org/...')` is not awaited before the handler returns. Vercel can freeze or terminate the function once the response is sent, so the alert is lost.

**Fix:** `await` it, with a short timeout, or use `waitUntil` from `@vercel/functions`.

### 10. Sequential N+1 queries in the cron run
**File:** `app/api/cron/fetch-jobs/route.ts`

For every merged job (up to ~150 per run), the route makes one `SELECT`, then one `INSERT`, **sequentially**. Together with up to 9 RapidAPI calls and 8–9 s timeouts per source, a run can approach `maxDuration = 60`. A timeout leaves no `automation_logs` row and sends no Telegram alert.

**Fix:** Load existing keys in one query, then do a single bulk `insert` or an `upsert` backed by a unique index.

### 11. JSearch job types don't match site filters
**File:** `app/api/cron/fetch-jobs/route.ts` (`fetchOneRapidQuery`)

`type: j.job_employment_type` stores raw values like `FULLTIME` or `INTERN`. The public filter and schema expect `Internship | Job | Full-time`. If the admin doesn't fix the value on approve, those jobs never match a type filter.

**Fix:** Map the values to the canonical set when fetching.

### 12. Schedule settings in the admin are cosmetic
**File:** `app/admin/page.tsx` (~lines 1752–1790, 2120–2235)

The enabled/paused toggle and cron preset are only written to `localStorage`. The real schedule is fixed in `vercel.json` (`0 7 * * *`). Showing "Paused" in the UI doesn't stop the cron, which is misleading. At minimum, label it as a config generator, or store the state server-side and check it in the cron route.

### 13. Unthrottled public write endpoints
**Files:** `app/api/visitors/route.ts`, `app/api/users/route.ts`

- `POST /api/visitors` has no auth and no rate limit, so anyone can inflate the visitor counter shown on the home page. The once-per-session check in `VisitorPing` only runs in the browser.
- `POST /api/users` (newsletter signup) has no rate limit, so it can be used to flood the `users` table. The `"Already registered"` response also reveals whether an email is subscribed.

**Fix:** Apply `rateLimit` to both. Return the same response for new and existing emails.

### 14. In-memory rate limiter is per-instance
**File:** `lib/rateLimit.ts`

The `Map` lives inside each serverless instance. Limits reset on cold starts and are multiplied by however many instances are running. The module-level `setInterval` also runs in every instance. The limiter works as a best-effort speed bump, but it is not a real protection, especially for admin brute-force at 20/min per instance.

**Fix:** Use a shared store such as Upstash Redis, Vercel KV, or a Supabase table, or Vercel's WAF rate limiting.

### 15. Approve is not atomic
**File:** `app/api/admin/jobs/approve/route.ts`

The route inserts into `jobs`, then deletes from `pending_jobs`. If the delete fails, the job is live **and** still pending, and approving it again creates a duplicate live job.

**Fix:** Do both steps in a Postgres function (RPC) inside one transaction.

---

## 🟡 Low

### 16. Admin login doesn't validate the key
**File:** `app/admin/page.tsx` (`handleAuth`)

Any input sets `authed = true` and shows the dashboard. Every request then fails with 401, which is confusing. The APIs are still protected, so this is a UX issue, not a security hole.

**Fix:** Call a lightweight admin endpoint to verify the key before entering the dashboard.

### 17. Admin key exposure surface
**Files:** `app/admin/jobs/pending/page.tsx`, `next.config.mjs`

The pending page stores the master `ADMIN_SECRET` in `sessionStorage`, and the CSP allows `'unsafe-inline' 'unsafe-eval'` for scripts. Any XSS would be able to read the key, which is permanent and can't be revoked per session.

**Fix:** Move to a session cookie (httpOnly, SameSite=Strict) issued after login, or Supabase Auth with an admin role. Tighten the CSP with nonces.

### 18. Public unsigned Cloudinary preset
**File:** `components/ImageUpload.tsx`

`NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` is an **unsigned** preset shipped to the browser. Anyone can use it to upload files into your Cloudinary account, which consumes storage and bandwidth.

**Fix:** Use signed uploads, with the signature generated by an admin-only API route, or restrict the preset (allowed formats, max size, folder).

### 19. Raw request body written to the DB on admin routes
**Files:** `POST`/`PUT` in `app/api/jobs`, `app/api/tools`, `app/api/roadmaps`, `app/api/blogs` (`...body`)

The body is passed straight to `.insert(body)` or `.update(body)`, with only `id`/`updated_at` stripped on PUT. Only the admin can call these routes, but a typo or stale field silently writes unexpected columns, including `status`, `created_at` and `fts`-related columns.

**Fix:** Allowlist the writable fields, as `app/api/users/route.ts` already does, ideally with a schema validator such as zod.

### 20. Cron route secret comparison
**File:** `app/api/cron/fetch-jobs/route.ts`

The route compares both secrets with `!==`, which is not constant-time, and has no rate limit. Unlike every other admin route, it doesn't use `checkAdminAuth`.

### 21. Unbounded `limit` parameter
**Files:** `app/api/jobs/route.ts`, `app/api/tools/route.ts`

`query.limit(Number(limit))` accepts any value, including huge numbers or `NaN`.

**Fix:** Clamp the value, e.g. `Math.min(Math.max(1, n || 20), 100)`. `/api/admin/logs` already does this.

### 22. Error details leak to clients
Several routes return `error.message` or `detail: msg` straight from Supabase, for example `POST /api/jobs|tools|blogs|roadmaps` and the admin routes. Most are admin-only, but the pattern should be avoided: log details on the server and return generic messages.

### 23. Domain inconsistency
- Telegram approve link: `https://techwithshailu.com/admin` (`app/api/cron/fetch-jobs/route.ts`)
- Sitemap and README: `https://techwithshailu.in`

Read the URL from `NEXT_PUBLIC_APP_URL` instead of hard-coding it.

### 24. SQL / schema drift
**Directory:** `supabase/`

- The `increment_stat` RPC is called by `/api/visitors` and mentioned in comments, but **no SQL file defines it**. A fresh database can't be rebuilt from the repo.
- There are duplicate or overlapping files: `add-deadline-column.sql` vs `migration_add_deadline.sql`, and `rls_policies.sql` vs `migrations/20260915000000_enable_rls_policies.sql`. Only one file lives in `migrations/`; the rest are ad-hoc scripts.
- The cron route still says to "run ALTER TABLE ... in Supabase SQL Editor" for `deadline`, which suggests the schema is maintained by hand.

**Fix:** Consolidate everything into ordered files under `supabase/migrations/` (Supabase CLI) that rebuild the full schema, functions and policies.

### 25. Stale docs and unused dependency
- `README.md` and `package.json` say MongoDB Atlas / Mongoose and Next.js 14, and the README's env setup lists `MONGODB_URI`. The app actually uses **Supabase**, and the required env vars aren't documented: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `CRON_SECRET`, `ADZUNA_APP_ID`, `ADZUNA_APP_KEY`, `RAPIDAPI_KEY`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `NEXT_PUBLIC_CLOUDINARY_*`, `NEXT_PUBLIC_LOGO_DEV_TOKEN`.
- `mongoose` is in `dependencies` but nothing imports it. It adds install size and attack surface.

### 26. Missing tooling
- The `npm run lint` script exists, but `eslint` / `eslint-config-next` aren't installed and there is no ESLint config.
- There are no tests, no CI workflow (`.github/workflows`), and no `.env.example`.
- `lib/supabase.ts` throws at import time if env vars are missing, so `next build` fails without all secrets present.

### 27. Maintainability
- `app/admin/page.tsx` is about **3,700 lines** in one client component, with inline styles throughout.
- The pending-jobs review UI is duplicated between `app/admin/page.tsx` and `app/admin/jobs/pending/page.tsx`, which already store the admin key differently (in memory vs `sessionStorage`).

**Fix:** Split the page into per-view components under `app/admin/_components/` and share one pending-jobs component.

### 28. Dead route
`app/resources/[slug]/page.tsx` renders from an empty `roadmapData = {}` map, so every request 404s. Remove it, or redirect it to `/resources/roadmaps/[category]` (see #4).

### 29. Unvalidated `apply_link`
Third-party `apply_link` values (Unstop, JSearch) are rendered directly as `<a href>` without validation. React 19 blocks `javascript:` URLs, so the XSS risk is low. Still, validate that the value is an `https://` URL when fetching or approving, so broken or malicious links never reach the site.

---

## Suggested order of work

1. **#1, #2, #3, #4**: quick wins with the biggest user and security impact.
2. **#5, #6, #7, #13**: admin correctness and abuse protection.
3. **#9, #10, #11, #15**: harden the job pipeline.
4. **#24, #25, #26**: make the project reproducible (migrations, README, `.env.example`, lint/CI).
5. The rest as ongoing hardening and refactoring.

---

## Resolution log

### Pass 1: low-severity items (2026-11-24)

- **#16** — Added `GET /api/admin/verify`. The login screen now checks the key with the server and shows "Invalid admin key" or "Too many attempts" instead of opening a broken dashboard.
- **#17 (partial)** — Removed the duplicate `/admin/jobs/pending` page, which was the one that kept the admin key in `sessionStorage`. The CSP no longer sends `'unsafe-eval'` in production; it is dev-only for React Refresh. Still open: `'unsafe-inline'` (needs nonce middleware) and the shared-secret header model (a cookie session or Supabase Auth would replace it).
- **#18** — `components/ImageUpload.tsx` now does **signed** uploads through the new admin-only `POST /api/admin/cloudinary-sign`. `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` is no longer used.
  **Action needed:** set `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` in Vercel, then **delete or disable the old unsigned preset in the Cloudinary dashboard**. Its name already shipped in public JS, so anyone can still use it until it is disabled.
- **#19** — Admin `POST`/`PUT` routes for jobs, tools, blogs and roadmaps only write allow-listed columns (`lib/validate.ts`).
- **#20, and #1** — The cron route uses a constant-time compare, fails closed when `CRON_SECRET` is unset (`Bearer undefined` → 401), and falls back to the shared `checkAdminAuth`, which is rate-limited.
- **#21** — `?limit=` is clamped to 1–100 on `/api/jobs` and `/api/tools`.
- **#22** — API responses return generic error messages, including the public `/api/db-check`; details are only logged on the server.
- **#23** — New `lib/site.ts` `SITE_URL` (from `NEXT_PUBLIC_APP_URL`) is used by the sitemap, robots, layout metadata, share links and the Telegram alert.
- **#24** — New idempotent `supabase/migrations/20261124000000_schema_sync.sql` defines `increment_stat()` and adds the columns the code uses. The RPC is only executable by `service_role`, so the public anon key can no longer call it directly to bump the visitor counter. The three ad-hoc ALTER scripts were folded into it and removed. Build order is documented in `supabase/README.md`.
  **Action needed:** run the new migration against the production database.
- **#25** — The README now reflects Supabase, all env vars and the real structure. `mongoose` was removed from dependencies.
- **#26 (mostly)** — Added ESLint 9 (`next/core-web-vitals` + `next/typescript`, flat config) with 0 errors, `npm run typecheck`, `.env.example`, and a GitHub Actions CI workflow (lint, typecheck, build).
  **Also found and fixed: `next build` was failing on the base commit** because of 24 TypeScript errors (framer-motion `Variants` typing, an invalid `ringColor` style, a missing `tags` field on `RoadmapCategory`, a `??` precedence bug in `AnimatedBg`, and ref typing in `MagneticButton`). The build passes now.
- **#27 (partial)** — Removed the 828-line duplicate pending-jobs page; it now redirects to `/admin`. Splitting `app/admin/page.tsx` into per-view files is still to do.
- **#28** — `/resources/[slug]` now permanently redirects to `/resources/roadmaps/[slug]`, with true 308s for the known slugs in `next.config.mjs`. The unused `RoadmapProgress` and `RoadmapTrack` components were removed.
- **#29** — `apply_link` is validated as an http(s) URL when fetched by cron, on admin create and edit, and when rendered.

Side effects worth knowing:
- Home-page roadmap cards now show the real module count (`tags.length`) instead of always 6, because `tags` is now mapped from the DB.
- The company-logo ring on job detail pages now uses the intended `#080808` colour; the old inline `ringColor` style was ignored.

### Pass 2: remaining low items, then medium (2026-11-25)

- **#26** — Added Vitest (`npm test`) with 27 unit tests covering `lib/validate`, `lib/adminAuth` (constant-time compare, 401/500/429 paths), `lib/rateLimit`, `lib/sanitize` and `formatJobDescription` (no scripts or handlers in output). CI now runs lint, typecheck, test and build. The rate limiter's cleanup timer no longer keeps processes alive (`unref`).
- **#17** — The admin panel now logs in through `POST /api/admin/session`, which sets an 8-hour **httpOnly, SameSite=Strict, Secure** session cookie (HMAC-signed, `lib/adminSession.ts`). The key is no longer kept in page state or storage, and every `x-admin-key` header was removed from the panel. The session is restored on reload through `/api/admin/verify`, and Logout clears it. `checkAdminAuth` accepts the cookie or the header; cookie-authenticated non-GET requests from another origin get 403 (CSRF defence in depth). Only *failed* auth attempts count toward the 20/min limit, so a busy admin session can't lock itself out. Rotating `ADMIN_SECRET` invalidates all sessions. **CSP decision:** `'unsafe-inline'` stays. Removing it needs a per-request nonce, which would force every page, including today's static and ISR pages, to render dynamically on each request. With the key now unreadable by scripts, an XSS could no longer steal it, so the remaining risk didn't justify that cost. Covered by 6 new tests and a browser check (cookie not readable from JS, no key header sent, reload and logout work).
- **#6** — The Users view now authenticates with the admin session cookie, so `/api/users` returns 200 and the subscriber count loads. Confirmed in the browser check.
- **#27** — Split `app/admin/page.tsx` (about 3,700 lines) into a 360-line shell (auth, navigation, view switching) plus one module per view in `app/admin/_components/`: `LoginScreen`, `DashboardView`, `JobsView`, `ToolsView`, `DatabaseView`, `PendingJobsView`, `AutomationView`, `BlogView`, `MiscViews`, and `shared` (types, input style, small UI pieces). The code moved unchanged, apart from dropping an unused `SectionLabel` and stale lint disables. Verified with tsc, lint, build, and a browser pass that opens all 13 tabs with no runtime errors.
- **#5** — Added admin-only `GET /api/admin/jobs` (every status) and `GET /api/admin/blogs` (including drafts), both using the service-role client. The admin panel loads its lists from these instead of the RLS-filtered public endpoints, and ignores error payloads instead of crashing on a non-array. Non-live jobs get a "Draft · not on site" or "Expired · not on site" badge; blogs already showed Live/Draft.
- **#7** — New `lib/blogPublish.ts` `resolvePublishedAt()` sets `published_at` only on a post's **first** publish. Edits, re-uploads of the same `.md` (upload-md now reads the existing date) and unpublish/republish all keep the original date. `PUT /api/blogs/:id` only touches the column when `published` is in the request, and now returns 404 for a missing post. Covered by 4 tests.
- **#8** — `/api/cron/fetch-jobs` now reads the admin filters through `parseFetchFilters()` (`lib/jobPipeline.ts`). `source` skips the unselected APIs, saving quota; `type` and `location` filter the merged results; `max_days` is passed to Adzuna (`max_days_old`) and JSearch (`date_posted`). Unstop has no posted-date parameter but only returns listings still open for registration. Whether the rotating company queries run is now decided by the trigger (cron yes, manual no) instead of whether the query text contains "india". Unknown filter values are ignored. Covered by tests.
- **#11** — New `normalizeJobType()` maps every source onto the site's `Internship | Job | Full-time`: JSearch `FULLTIME`/`INTERN`/`PARTTIME`/`CONTRACTOR`, Adzuna `contract_time`, and Unstop. Anything with "intern" in the type or title is an Internship. Fetched jobs now match the public type filter without manual fixing at approval. Existing `pending_jobs` rows keep their old values until re-fetched or edited. Covered by 10 table tests.
- **#9** — The Telegram alert is now awaited, with a 5-second timeout, before the handler returns, so Vercel can't freeze the function first. It is sent as plain text: the old legacy-Markdown message had stray `[ok]`/`[stats]` brackets that Telegram can reject with "can't parse entities". Failures are logged, and the response includes `telegram: sent | failed | skipped`.
- **#10** — Cron dedupe and insert are batched: one `pending_jobs` lookup per 50 titles plus **one bulk insert**, instead of a SELECT and an INSERT per job. If the bulk insert fails, it retries row by row so good rows still land and bad ones are reported. Dedupe now ignores case and whitespace both within the batch and against the DB (`dedupeKey`). The zero-results response now has the same shape as a normal one. Covered by a route-level test with a fake Supabase client (one lookup, one insert, duplicates skipped, Telegram awaited, filters, 401s).
- **#12** — Pause/resume is real now. New `app_settings` table (`supabase/migrations/20261125000000_app_settings.sql`) and admin API `GET/PUT /api/admin/settings/automation`. The cron route skips **scheduled** runs while paused and logs them as `skipped`; manual admin searches still run. The toggle saves immediately to the server, and the panel shows the schedule actually deployed in `vercel.json` instead of a value from browser storage. The frequency picker stays, but is labelled as a `vercel.json` snippet generator that needs a redeploy, because Vercel Cron schedules are fixed at deploy time. If the migration hasn't been applied, the cron keeps running as before (fail-open). **Action needed:** run the new migration. Covered by route tests (paused → skipped, manual still runs, missing setting → runs).
- **#14** — Added a limiter shared across serverless instances: `rate_limits` table plus an atomic `rate_limit_hit()` Postgres function (`supabase/migrations/20261125000100_rate_limits.sql`, service-role only), wrapped by `lib/sharedRateLimit.ts`. It is used where abuse matters: failed admin auth (now `checkAdminAuth`/`checkAdminKey` are async), signups and the visitor counter. Clients are stored as HMAC hashes of the IP, never raw IPs (`RATE_LIMIT_SALT`, defaulting to `ADMIN_SECRET`). If the RPC is unavailable it falls back to the in-memory limiter rather than failing open or closed. Public read endpoints deliberately keep the per-instance limiter, to avoid a DB round-trip on every page load. **Action needed:** run the new migration. Covered by tests (allow/deny, Retry-After, hashed key, fallback).
- **#13** — `POST /api/visitors` is limited to 10/hour per IP and `POST /api/users` to 5/hour per IP, both through the shared limiter. The `increment_stat` RPC was already restricted to the service role (Pass 1, #24). Signup now returns the **same** `200 { ok, message }` whether the email is new or already subscribed, never echoes the stored row, treats a concurrent duplicate (Postgres 23505) as success, and validates that `email` is a string of at most 254 characters. Covered by route tests (same response, `role` cannot be set, 429 after 5).
- **#15** — Approval now runs through the new `approve_pending_job(p_id, p_overrides)` Postgres function (`supabase/migrations/20261125000200_approve_pending_job.sql`, service-role only). It locks the pending row (`FOR UPDATE`), inserts the live job and deletes the pending row in **one transaction**, so a failure can't leave a job both live and pending, and a double-click or retry can't publish it twice (the second call gets 404). The approve route validates the admin's edits first: a UUID `jobId`; allow-listed override fields only; http(s) `apply_link`; string-array `tags`; real dates; whole-number `batch_year`. The job's `source` now carries over instead of becoming `manual`. If the function isn't deployed yet, the route falls back to the old two-step path. Tested against a real PostgreSQL 16 database with all repo migrations applied (field merging, defaults, the second-approve error, rollback on a bad date, anon has no execute) and with route tests. **Action needed:** run the new migration.
- **Database check:** `schema.sql`, every file in `migrations/`, `rls_policies.sql` and `seed-roadmaps.sql` were applied to a fresh PostgreSQL 16 database (with Supabase's `auth` schema and roles stubbed), and every migration was then re-run to confirm it is idempotent. `increment_stat`, `rate_limit_hit` (limits, peek, window reset) and `approve_pending_job` were exercised directly, and anon was confirmed unable to execute any of them or read `app_settings`/`rate_limits`.

### Pass 3: high-severity items (2026-11-25)

- **#2** — Reviewed jobs are now **remembered instead of deleted**. Reject sets `status = 'rejected'` and returns 404 if the job was already reviewed; approve marks the pending row `approved` inside the same transaction that publishes it (`approve_pending_job()` redefined in `supabase/migrations/20261125000300_keep_reviewed_pending_jobs.sql`; the fallback path does the same). The pending list and badge only show `status = 'pending'`. The daily fetch de-duplicates against **every** `pending_jobs` row (pending, approved or rejected) **and** the live `jobs` table, so a listing whose title was edited at approval, or that was added manually, isn't queued again either. Reviewed rows are purged 120 days after they were fetched, and title/status indexes keep the lookups fast. Verified against PostgreSQL 16 (approved row kept, double approve and approving a rejected row both refused, migration re-runnable) and with route tests (no re-queue of approved/rejected/live listings, purge keeps pending rows, reject semantics). **Action needed:** run the new migration. Until then, approvals still go through the earlier function, which deletes the row.
- **#3** — Server Components no longer call this app's own API over HTTP. New `lib/data/public.ts` (`listLiveJobs`, `getLiveJob`, `listTools`, `featuredOrLatest`) queries Supabase directly with the anon client (RLS still applies, plus an explicit `status = 'live'` filter as a safeguard). The home page, `/jobs` and `/jobs/[id]` use it, and `GET /api/jobs`, `/api/jobs/:id` and `/api/tools` now call the same functions, so filter logic lives in one place. `getLiveJob` uses React `cache()`, so a job page's metadata and body share one query, and malformed ids return not-found instead of erroring. The home page sets `export const revalidate = 60` to keep its previous 1-minute ISR. Pages no longer depend on `NEXT_PUBLIC_APP_URL` pointing at the right deployment. **Verified end to end:** with a stub Supabase server and `NEXT_PUBLIC_APP_URL` aimed at a dead port, `/`, `/jobs` and `/jobs/[id]` rendered the stub job, and **150 consecutive `/jobs` renders all showed it**, with none empty or rate-limited (the old shared limit was 120/min). Plus 8 unit tests. Unrelated existing behaviour seen while testing: an unknown job id shows the not-found page with `noindex` but HTTP 200, because the route's `loading.tsx` starts streaming first.
- **#4** — `app/sitemap.ts` is now generated from data, with an hourly revalidate. It lists every static page, including all six resource sections (the old sitemap had none of them); every roadmap from the `roadmaps` table, falling back to the six known slugs if the table can't be read; each resume-hub category; every **published blog post**; and every **live job**, each with its own `lastModified`. Light queries (`listSitemapJobs`, `listSitemapBlogs` in `lib/data/public.ts`) select only ids/slugs and timestamps. Each source fails independently, so a database outage still produces the static part. Legacy `/resources/<slug>` redirect URLs are not listed. Verified with 3 unit tests and end to end: a production build against a stub Supabase produced 23 entries, all returning 200. (The stub had no roadmap rows, so for those six URLs that confirms routing only.)
