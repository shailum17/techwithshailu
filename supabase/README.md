# Supabase database

All tables live in the Supabase Postgres project referenced by
`NEXT_PUBLIC_SUPABASE_URL`. The app reads with the anon key (RLS applies) and
writes only from API routes with the service-role key.

## Building a fresh database

Run these files in order (SQL Editor, or `psql`):

1. `schema.sql` — tables, indexes, `updated_at` triggers, `site_stats`.
2. `migrations/*.sql` — in filename (timestamp) order:
   - `20260915000000_enable_rls_policies.sql` — RLS on every table, public read policies.
   - `20261124000000_schema_sync.sql` — columns the code relies on (`pending_jobs.deadline`,
     `tools.logo` / `votes` / unique `name`, `blogs.category` / `read_time`) and the
     `increment_stat()` RPC used by `/api/visitors`.
   - `20261125000000_app_settings.sql` — `app_settings` key/value table (admin pause/resume of the
     scheduled job fetch).
   - `20261125000100_rate_limits.sql` — `rate_limits` table and `rate_limit_hit()` RPC used for
     rate limits shared across serverless instances (admin auth failures, signups, visitor counter).
   - `20261125000200_approve_pending_job.sql` — `approve_pending_job()` moves a pending job to `jobs`
     in one transaction (used by the admin Approve button).
   - `20261125000300_keep_reviewed_pending_jobs.sql` — approved/rejected jobs stay in `pending_jobs`
     (status `approved` / `rejected`) so the daily fetch doesn't re-queue them; redefines
     `approve_pending_job()` accordingly and adds title/status indexes.
   - `20261126000000_jobs_value_checks.sql` — `check` constraints for `jobs.type` and `jobs.status`
     (added `NOT VALID`, so existing rows don't block it; see the file for how to validate them).
   - `20261126000100_job_dedupe_key.sql` — generated `dedupe_key` on `pending_jobs` / `jobs` and a unique
     index on `pending_jobs.dedupe_key`, so the fetch can't queue the same listing twice. **Deletes duplicate
     `pending_jobs` rows first** (keeps approved → rejected → oldest pending); `jobs` is not touched.
   - `20261126000200_jobs_live_only_policy.sql` — drops the old `using (true)` read policies on `jobs`
     so the public anon key can read **live** jobs only (drafts/expired were readable before).
   - `20261126000300_blog_first_image.sql` — generated `blogs.first_image_url` (first `<img>` in the post), so
     the blog list and sidebar don't have to load every post's full HTML for thumbnails.
3. `seed-roadmaps.sql` — optional roadmap content (safe to re-run).

`rls_policies.sql` is an older, more detailed version of the RLS setup and overlaps with
`migrations/20260915000000_enable_rls_policies.sql`. Running both is safe (each drops
policies before recreating them), but the migration is the source of truth.

## Updating an existing database

Every migration is idempotent.

After applying, check that no public policy is wider than intended:

```sql
select tablename, policyname, roles, cmd, qual
from pg_policies
where schemaname = 'public'
order by tablename, cmd;
```

On `jobs` the only `SELECT` policy for `anon`/`authenticated` should be `status = 'live'`, and on `blogs`
`published = true`. Policies of the same command are OR-ed, so one `using (true)` cancels a stricter one. Run any file in `migrations/` that hasn't been applied
yet, or use `supabase db push` if the project is linked with the Supabase CLI.

## Adding changes

Don't edit the database by hand in the dashboard. Add a new file
`migrations/<YYYYMMDDHHMMSS>_<what>.sql` that is safe to re-run
(`if not exists`, `drop … if exists`), and keep `lib/validate.ts` field allow-lists in
sync with any new writable columns.
