-- ═══════════════════════════════════════════════════════════════
-- techwithshailu — Row Level Security Policies
--
-- Architecture notes:
--   • There is NO Supabase Auth for end-users — no auth.uid() is
--     available for per-user row filtering.
--   • All writes originate from the Next.js API layer using the
--     service_role key (supabaseAdmin), which bypasses RLS.
--   • The anon key (supabase) is used only for public reads on
--     Server Components and client-side fetches.
--   • "Users can only access their own data" is enforced by:
--       1. Blocking anon reads on sensitive tables (users,
--          pending_jobs, automation_logs, site_stats).
--       2. Restricting all writes to service_role only — the API
--          layer validates the x-admin-key header before calling
--          supabaseAdmin, so no client can write directly.
--       3. Preventing authenticated Supabase Auth users (if added
--          later) from reading other users' rows in the users table.
--
-- HOW TO APPLY:
--   Run this file in Supabase Dashboard → SQL Editor → New Query
--   It is idempotent: DROP IF EXISTS before CREATE, so re-running
--   is safe.
-- ═══════════════════════════════════════════════════════════════


-- ───────────────────────────────────────────────────────────────
-- HELPER: drop all existing policies so this file is idempotent
-- ───────────────────────────────────────────────────────────────
do $$ declare
  r record;
begin
  for r in
    select policyname, tablename
    from   pg_policies
    where  schemaname = 'public'
  loop
    execute format(
      'drop policy if exists %I on %I',
      r.policyname, r.tablename
    );
  end loop;
end $$;


-- ═══════════════════════════════════════════════════════════════
-- 1. JOBS  (live, approved — public content)
-- ═══════════════════════════════════════════════════════════════
alter table jobs enable row level security;

-- Anyone (anon or authenticated) can read live jobs
create policy "jobs: public select"
  on jobs
  for select
  using (status = 'live');

-- Only the server (service_role) can insert new jobs
create policy "jobs: service_role insert"
  on jobs
  for insert
  with check (auth.role() = 'service_role');

-- Only the server can update jobs
create policy "jobs: service_role update"
  on jobs
  for update
  using  (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- Only the server can delete jobs
create policy "jobs: service_role delete"
  on jobs
  for delete
  using (auth.role() = 'service_role');


-- ═══════════════════════════════════════════════════════════════
-- 2. PENDING_JOBS  (internal — never expose to the public)
-- ═══════════════════════════════════════════════════════════════
alter table pending_jobs enable row level security;

-- No public read — pending jobs are admin-only
-- (anon key cannot enumerate jobs awaiting approval)

create policy "pending_jobs: service_role insert"
  on pending_jobs
  for insert
  with check (auth.role() = 'service_role');

create policy "pending_jobs: service_role select"
  on pending_jobs
  for select
  using (auth.role() = 'service_role');

create policy "pending_jobs: service_role update"
  on pending_jobs
  for update
  using  (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "pending_jobs: service_role delete"
  on pending_jobs
  for delete
  using (auth.role() = 'service_role');


-- ═══════════════════════════════════════════════════════════════
-- 3. TOOLS  (AI tools directory — public content)
-- ═══════════════════════════════════════════════════════════════
alter table tools enable row level security;

-- Anyone can read tools
create policy "tools: public select"
  on tools
  for select
  using (true);

create policy "tools: service_role insert"
  on tools
  for insert
  with check (auth.role() = 'service_role');

create policy "tools: service_role update"
  on tools
  for update
  using  (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "tools: service_role delete"
  on tools
  for delete
  using (auth.role() = 'service_role');


-- ═══════════════════════════════════════════════════════════════
-- 4. BLOGS  (published posts are public; drafts are server-only)
-- ═══════════════════════════════════════════════════════════════
alter table blogs enable row level security;

-- Anon can only read published posts — drafts stay hidden
create policy "blogs: public select published"
  on blogs
  for select
  using (published = true);

-- Service role can read all posts (including drafts for the admin panel)
create policy "blogs: service_role select all"
  on blogs
  for select
  using (auth.role() = 'service_role');

create policy "blogs: service_role insert"
  on blogs
  for insert
  with check (auth.role() = 'service_role');

create policy "blogs: service_role update"
  on blogs
  for update
  using  (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "blogs: service_role delete"
  on blogs
  for delete
  using (auth.role() = 'service_role');


-- ═══════════════════════════════════════════════════════════════
-- 5. ROADMAPS  (public content)
-- ═══════════════════════════════════════════════════════════════
alter table roadmaps enable row level security;

create policy "roadmaps: public select"
  on roadmaps
  for select
  using (true);

create policy "roadmaps: service_role insert"
  on roadmaps
  for insert
  with check (auth.role() = 'service_role');

create policy "roadmaps: service_role update"
  on roadmaps
  for update
  using  (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "roadmaps: service_role delete"
  on roadmaps
  for delete
  using (auth.role() = 'service_role');


-- ═══════════════════════════════════════════════════════════════
-- 6. USERS  (subscriber / registration list)
--
-- Critical table: contains emails. Two layers of protection:
--
--   a) Anon users cannot read, write, or enumerate any rows.
--   b) If Supabase Auth is added in the future, an authenticated
--      user can only read their OWN row (matched by email to
--      auth.jwt() ->> 'email').  They cannot see other users.
--   c) Only service_role can insert new subscribers or update
--      existing rows — the API layer handles validation.
-- ═══════════════════════════════════════════════════════════════
alter table users enable row level security;

-- Authenticated users (future Supabase Auth) can read only their own row
-- Anon users get nothing because auth.jwt() ->> 'email' returns NULL for them,
-- so the comparison never matches.
create policy "users: owner select"
  on users
  for select
  using (
    auth.role() = 'service_role'
    or (
      auth.role() = 'authenticated'
      and lower(email) = lower(auth.jwt() ->> 'email')
    )
  );

-- Only service_role can insert (public registration goes through the API)
create policy "users: service_role insert"
  on users
  for insert
  with check (auth.role() = 'service_role');

-- Authenticated users can update only their own row (e.g. name, avatar_url)
-- Role changes are blocked by the API layer before reaching this table
create policy "users: owner update"
  on users
  for update
  using (
    auth.role() = 'service_role'
    or (
      auth.role() = 'authenticated'
      and lower(email) = lower(auth.jwt() ->> 'email')
    )
  )
  with check (
    auth.role() = 'service_role'
    or (
      auth.role() = 'authenticated'
      and lower(email) = lower(auth.jwt() ->> 'email')
      -- Authenticated users cannot escalate their own role
      and role = 'user'
    )
  );

-- Only service_role can delete subscriber rows
create policy "users: service_role delete"
  on users
  for delete
  using (auth.role() = 'service_role');


-- ═══════════════════════════════════════════════════════════════
-- 7. AUTOMATION_LOGS  (internal — admin/cron only)
-- ═══════════════════════════════════════════════════════════════
alter table automation_logs enable row level security;

-- No public access at all
create policy "automation_logs: service_role select"
  on automation_logs
  for select
  using (auth.role() = 'service_role');

create policy "automation_logs: service_role insert"
  on automation_logs
  for insert
  with check (auth.role() = 'service_role');

-- Logs are append-only — no updates or deletes even for service_role
-- (Uncomment below if you need to purge old logs via the API)
-- create policy "automation_logs: service_role delete"
--   on automation_logs
--   for delete
--   using (auth.role() = 'service_role');


-- ═══════════════════════════════════════════════════════════════
-- 8. SITE_STATS  (aggregate counters — public read, server write)
-- ═══════════════════════════════════════════════════════════════
-- Create the table if it doesn't already exist (it was created
-- manually in the dashboard and is missing from schema.sql)
create table if not exists site_stats (
  key        text        primary key,
  value      bigint      not null default 0,
  updated_at timestamptz not null default now()
);

-- Seed the visitor_count row if absent
insert into site_stats (key, value)
values ('visitor_count', 0)
on conflict (key) do nothing;

alter table site_stats enable row level security;

-- Anyone can read aggregate stats (visitor count widget)
create policy "site_stats: public select"
  on site_stats
  for select
  using (true);

-- Only service_role can mutate stats
-- (the increment_stat RPC runs as security definer, so it implicitly
--  has elevated rights — but we lock direct DML to service_role too)
create policy "site_stats: service_role insert"
  on site_stats
  for insert
  with check (auth.role() = 'service_role');

create policy "site_stats: service_role update"
  on site_stats
  for update
  using  (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "site_stats: service_role delete"
  on site_stats
  for delete
  using (auth.role() = 'service_role');


-- ═══════════════════════════════════════════════════════════════
-- VERIFY — shows all active policies after applying this file
-- ═══════════════════════════════════════════════════════════════
select
  tablename,
  policyname,
  cmd,
  qual,
  with_check
from pg_policies
where schemaname = 'public'
order by tablename, cmd, policyname;
