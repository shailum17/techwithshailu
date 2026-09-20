-- =============================================================
-- Migration: Enable RLS on every table with real policies
-- Generated: 2026-09-15
-- Run in Supabase SQL Editor or via `supabase db push`
-- =============================================================

-- ─────────────────────────────────────────────────────────────
-- 1. JOBS  (public read of live jobs; all writes via service role)
-- ─────────────────────────────────────────────────────────────
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Drop any broad "allow all" policy that may have been created
DROP POLICY IF EXISTS "allow all"          ON jobs;
DROP POLICY IF EXISTS "Enable read access" ON jobs;
DROP POLICY IF EXISTS "public read"        ON jobs;

-- Anyone can read rows where status = 'live'
CREATE POLICY "jobs_public_read" ON jobs
  FOR SELECT
  TO anon, authenticated
  USING (status = 'live');

-- Only the service-role (bypasses RLS) may insert/update/delete.
-- No policy needed for those verbs on anon/authenticated — absence = deny.


-- ─────────────────────────────────────────────────────────────
-- 2. TOOLS  (public read; all writes via service role)
-- ─────────────────────────────────────────────────────────────
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow all"          ON tools;
DROP POLICY IF EXISTS "Enable read access" ON tools;
DROP POLICY IF EXISTS "public read"        ON tools;

CREATE POLICY "tools_public_read" ON tools
  FOR SELECT
  TO anon, authenticated
  USING (true);


-- ─────────────────────────────────────────────────────────────
-- 3. ROADMAPS  (public read; all writes via service role)
-- ─────────────────────────────────────────────────────────────
ALTER TABLE roadmaps ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow all"          ON roadmaps;
DROP POLICY IF EXISTS "Enable read access" ON roadmaps;
DROP POLICY IF EXISTS "public read"        ON roadmaps;

CREATE POLICY "roadmaps_public_read" ON roadmaps
  FOR SELECT
  TO anon, authenticated
  USING (true);


-- ─────────────────────────────────────────────────────────────
-- 4. BLOGS  (public read of published posts only; drafts hidden)
-- ─────────────────────────────────────────────────────────────
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow all"          ON blogs;
DROP POLICY IF EXISTS "Enable read access" ON blogs;
DROP POLICY IF EXISTS "public read"        ON blogs;

CREATE POLICY "blogs_public_read" ON blogs
  FOR SELECT
  TO anon, authenticated
  USING (published = true);


-- ─────────────────────────────────────────────────────────────
-- 5. USERS  (no anon access; service role only)
-- ─────────────────────────────────────────────────────────────
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow all"          ON users;
DROP POLICY IF EXISTS "Enable read access" ON users;
DROP POLICY IF EXISTS "public read"        ON users;

-- No SELECT / INSERT / UPDATE / DELETE policies for anon or authenticated.
-- All access goes through the service-role client (bypasses RLS).


-- ─────────────────────────────────────────────────────────────
-- 6. PENDING_JOBS  (no anon access; service role only)
-- ─────────────────────────────────────────────────────────────
ALTER TABLE pending_jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow all"          ON pending_jobs;
DROP POLICY IF EXISTS "Enable read access" ON pending_jobs;
DROP POLICY IF EXISTS "public read"        ON pending_jobs;

-- No policies — only the service-role client may access this table.


-- ─────────────────────────────────────────────────────────────
-- 7. AUTOMATION_LOGS  (no anon access; service role only)
-- ─────────────────────────────────────────────────────────────
ALTER TABLE automation_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow all"          ON automation_logs;
DROP POLICY IF EXISTS "Enable read access" ON automation_logs;
DROP POLICY IF EXISTS "public read"        ON automation_logs;

-- No policies — only the service-role client may access this table.


-- ─────────────────────────────────────────────────────────────
-- 8. SITE_STATS  (public read; writes via service role / RPC only)
-- ─────────────────────────────────────────────────────────────
ALTER TABLE site_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow all"          ON site_stats;
DROP POLICY IF EXISTS "Enable read access" ON site_stats;
DROP POLICY IF EXISTS "public read"        ON site_stats;

CREATE POLICY "site_stats_public_read" ON site_stats
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- The increment_stat RPC runs as SECURITY DEFINER so it uses
-- the function owner's role (postgres/service) and bypasses RLS.
-- No UPDATE/INSERT policy needed for anon.


-- ─────────────────────────────────────────────────────────────
-- VERIFY — run this to confirm RLS is on for all tables:
-- ─────────────────────────────────────────────────────────────
-- SELECT tablename, rowsecurity
-- FROM   pg_tables
-- WHERE  schemaname = 'public'
-- ORDER  BY tablename;
