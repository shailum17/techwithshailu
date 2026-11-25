-- ═══════════════════════════════════════════════════════════════
-- techwithshailu — public can read LIVE jobs only
--
-- schema.sql created "public read jobs" and rls_policies.sql created
-- "jobs: public select", both `using (true)`. The 20260915 migration added
-- "jobs_public_read" (status = 'live') but never dropped those two, and
-- permissive policies are OR-ed together — so draft and expired jobs were
-- readable by anyone with the public anon key via the REST API.
--
-- This drops every SELECT policy on jobs that applies to anon/authenticated
-- and recreates the single live-only one. The service role bypasses RLS,
-- so the admin API is unaffected. Idempotent.
--
-- Verify afterwards:
--   select policyname, roles, cmd, qual from pg_policies where tablename = 'jobs';
--   -- expect one SELECT policy for anon/authenticated with qual (status = 'live')
-- ═══════════════════════════════════════════════════════════════

alter table jobs enable row level security;

drop policy if exists "public read jobs"    on jobs;   -- schema.sql
drop policy if exists "jobs: public select" on jobs;   -- rls_policies.sql
drop policy if exists "jobs_public_read"    on jobs;   -- 20260915 migration (recreated below)
drop policy if exists "allow all"           on jobs;
drop policy if exists "Enable read access"  on jobs;
drop policy if exists "public read"         on jobs;

create policy "jobs_public_read" on jobs
  for select
  to anon, authenticated
  using (status = 'live');
