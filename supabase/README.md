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
3. `seed-roadmaps.sql` — optional roadmap content (safe to re-run).

`rls_policies.sql` is an older, more detailed version of the RLS setup and overlaps with
`migrations/20260915000000_enable_rls_policies.sql`. Running both is safe (each drops
policies before recreating them), but the migration is the source of truth.

## Updating an existing database

Every migration is idempotent. Run any file in `migrations/` that hasn't been applied
yet, or use `supabase db push` if the project is linked with the Supabase CLI.

## Adding changes

Don't edit the database by hand in the dashboard. Add a new file
`migrations/<YYYYMMDDHHMMSS>_<what>.sql` that is safe to re-run
(`if not exists`, `drop … if exists`), and keep `lib/validate.ts` field allow-lists in
sync with any new writable columns.
