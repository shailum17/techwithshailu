-- ═══════════════════════════════════════════════════════════════
-- techwithshailu — Supabase Schema
-- Run this entire file in: Supabase Dashboard → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════════════

-- Enable UUID generation (already on by default in Supabase, but safe to include)
create extension if not exists "pgcrypto";


-- ───────────────────────────────────────────────────────────────
-- 1. JOBS  (live, approved jobs shown on the site)
-- ───────────────────────────────────────────────────────────────
create table if not exists jobs (
  id           uuid        primary key default gen_random_uuid(),

  -- Core fields
  title        text        not null,
  company      text        not null,
  location     text        not null default 'Remote',
  type         text        not null default 'Internship',   -- Internship | Job | Full-time
  salary       text,
  description  text,
  apply_link   text,
  deadline     date,
  batch_year   int,
  tags         text[]      default '{}',

  -- Images
  logo_url     text,
  banner_url   text,

  -- Flags
  is_featured  boolean     not null default false,
  status       text        not null default 'live',         -- live | draft | expired

  -- Source (set when approved from pending)
  source       text        default 'manual',
  approved_at  timestamptz default now(),

  -- Timestamps
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),

  -- Full-text search vector (auto-updated via trigger below)
  fts          tsvector    generated always as (
    to_tsvector('english',
      coalesce(title, '') || ' ' ||
      coalesce(company, '') || ' ' ||
      coalesce(location, '') || ' ' ||
      coalesce(description, '')
    )
  ) stored
);

create index if not exists jobs_fts_idx     on jobs using gin(fts);
create index if not exists jobs_type_idx    on jobs(type);
create index if not exists jobs_featured_idx on jobs(is_featured) where is_featured = true;
create index if not exists jobs_created_idx on jobs(created_at desc);


-- ───────────────────────────────────────────────────────────────
-- 2. PENDING_JOBS  (auto-fetched, waiting for admin approval)
-- ───────────────────────────────────────────────────────────────
create table if not exists pending_jobs (
  id           uuid        primary key default gen_random_uuid(),

  title        text        not null,
  company      text        not null,
  location     text        default 'Remote',
  type         text        default 'Internship',
  salary       text,
  description  text,
  apply_link   text,
  deadline     date,

  source       text        default 'rapidapi',
  status       text        not null default 'pending',

  fetched_at   timestamptz not null default now()
);

create index if not exists pending_jobs_fetched_idx on pending_jobs(fetched_at desc);


-- ───────────────────────────────────────────────────────────────
-- 3. TOOLS  (AI tools directory)
-- ───────────────────────────────────────────────────────────────
create table if not exists tools (
  id           uuid        primary key default gen_random_uuid(),

  name         text        not null,
  description  text,
  category     text        not null default 'Coding',  -- Coding | Writing | Image | Productivity | Research
  url          text        not null,
  icon_url     text,

  is_free      boolean     not null default true,
  is_featured  boolean     not null default false,

  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),

  fts          tsvector    generated always as (
    to_tsvector('english',
      coalesce(name, '') || ' ' ||
      coalesce(description, '') || ' ' ||
      coalesce(category, '')
    )
  ) stored
);

create index if not exists tools_fts_idx      on tools using gin(fts);
create index if not exists tools_category_idx on tools(category);
create index if not exists tools_featured_idx  on tools(is_featured) where is_featured = true;
create index if not exists tools_created_idx   on tools(created_at desc);


-- ───────────────────────────────────────────────────────────────
-- 4. BLOGS  (blog posts)
-- ───────────────────────────────────────────────────────────────
create table if not exists blogs (
  id           uuid        primary key default gen_random_uuid(),

  title        text        not null,
  slug         text        not null unique,
  excerpt      text,
  content      text,                           -- HTML / Markdown
  cover_url    text,
  author       text        default 'Shailu',
  tags         text[]      default '{}',

  published    boolean     not null default false,
  published_at timestamptz,

  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),

  fts          tsvector    generated always as (
    to_tsvector('english',
      coalesce(title, '') || ' ' ||
      coalesce(excerpt, '') || ' ' ||
      coalesce(content, '')
    )
  ) stored
);

create index if not exists blogs_slug_idx      on blogs(slug);
create index if not exists blogs_fts_idx       on blogs using gin(fts);
create index if not exists blogs_published_idx on blogs(published_at desc) where published = true;


-- ───────────────────────────────────────────────────────────────
-- 5. ROADMAPS  (learning roadmap entries)
-- ───────────────────────────────────────────────────────────────
create table if not exists roadmaps (
  id           uuid        primary key default gen_random_uuid(),

  title        text        not null,
  slug         text        not null unique,
  category     text        not null,           -- e.g. Frontend | DSA | Backend | DevOps
  description  text,
  cover_url    text,
  content      text,                           -- JSON or Markdown
  tags         text[]      default '{}',
  "order"      int         not null default 0, -- sort order within category

  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),

  fts          tsvector    generated always as (
    to_tsvector('english',
      coalesce(title, '') || ' ' ||
      coalesce(description, '') || ' ' ||
      coalesce(category, '')
    )
  ) stored
);

create index if not exists roadmaps_category_idx on roadmaps(category);
create index if not exists roadmaps_order_idx    on roadmaps("order");
create index if not exists roadmaps_fts_idx      on roadmaps using gin(fts);


-- ───────────────────────────────────────────────────────────────
-- 6. USERS  (newsletter subscribers / registered users)
-- ───────────────────────────────────────────────────────────────
create table if not exists users (
  id           uuid        primary key default gen_random_uuid(),

  email        text        not null unique,
  name         text,
  role         text        not null default 'user',   -- user | admin
  avatar_url   text,

  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists users_email_idx   on users(email);
create index if not exists users_created_idx on users(created_at desc);


-- ───────────────────────────────────────────────────────────────
-- auto-update updated_at on every row change
-- ───────────────────────────────────────────────────────────────
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- attach to each table that has updated_at
do $$ begin
  if not exists (select 1 from pg_trigger where tgname = 'trg_jobs_updated_at') then
    create trigger trg_jobs_updated_at
      before update on jobs
      for each row execute function update_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'trg_tools_updated_at') then
    create trigger trg_tools_updated_at
      before update on tools
      for each row execute function update_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'trg_blogs_updated_at') then
    create trigger trg_blogs_updated_at
      before update on blogs
      for each row execute function update_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'trg_roadmaps_updated_at') then
    create trigger trg_roadmaps_updated_at
      before update on roadmaps
      for each row execute function update_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'trg_users_updated_at') then
    create trigger trg_users_updated_at
      before update on users
      for each row execute function update_updated_at();
  end if;
end $$;


-- ───────────────────────────────────────────────────────────────
-- Row Level Security (RLS)
--
-- Access model:
--   anon (public)    — read-only on public content tables
--   authenticated    — can read/update their OWN row in users only
--   service_role     — full access everywhere (used by supabaseAdmin
--                      in Next.js API routes; never exposed to browser)
--
-- There is no Supabase Auth for end-users in this project, so
-- auth.uid() is not used. User identity is verified at the API layer
-- via the x-admin-key header before supabaseAdmin is called.
--
-- For the canonical, granular policy definitions see:
--   supabase/rls_policies.sql
-- The policies below are the initial bootstrap set. Run
-- rls_policies.sql to replace them with the full, per-operation
-- policies that also cover automation_logs and site_stats.
-- ───────────────────────────────────────────────────────────────

alter table jobs          enable row level security;
alter table pending_jobs  enable row level security;
alter table tools         enable row level security;
alter table blogs         enable row level security;
alter table roadmaps      enable row level security;
alter table users         enable row level security;

-- ── Public READ (anon + authenticated) ────────────────────────

-- All live jobs are publicly readable
create policy "public read jobs"
  on jobs for select using (true);

-- All tools are publicly readable
create policy "public read tools"
  on tools for select using (true);

-- Only published blog posts are visible to the public; drafts are hidden
create policy "public read published blogs"
  on blogs for select using (published = true);

-- All roadmaps are publicly readable
create policy "public read roadmaps"
  on roadmaps for select using (true);

-- ── Service-role WRITE (Next.js API layer only) ────────────────
-- Uses `for all` as a bootstrap shorthand. Run rls_policies.sql to
-- replace these with separate INSERT / UPDATE / DELETE policies for
-- stricter least-privilege enforcement.

create policy "service role all jobs"
  on jobs for all using (auth.role() = 'service_role');

create policy "service role all pending_jobs"
  on pending_jobs for all using (auth.role() = 'service_role');

create policy "service role all tools"
  on tools for all using (auth.role() = 'service_role');

-- service_role can read drafts too (admin panel needs them)
create policy "service role all blogs"
  on blogs for all using (auth.role() = 'service_role');

create policy "service role all roadmaps"
  on roadmaps for all using (auth.role() = 'service_role');

-- ── Users table — sensitive; no public read ───────────────────
-- Anon users cannot enumerate subscribers.
-- Authenticated users (future Supabase Auth) see only their own row.
-- service_role has full access for the registration API.

create policy "users: owner or service_role select"
  on users for select
  using (
    auth.role() = 'service_role'
    or (
      auth.role() = 'authenticated'
      and lower(email) = lower(auth.jwt() ->> 'email')
    )
  );

create policy "service role all users"
  on users for all using (auth.role() = 'service_role');


-- ───────────────────────────────────────────────────────────────
-- 7. AUTOMATION_LOGS  (every fetch-jobs run, manual or cron)
-- Append-only internal log. No public access — service_role only.
-- Run in Supabase SQL Editor after the main schema.
-- ───────────────────────────────────────────────────────────────
create table if not exists automation_logs (
  id                 uuid        primary key default gen_random_uuid(),

  trigger_type       text        not null,   -- 'manual' | 'cron'
  query              text        not null,
  status             text        not null,   -- 'success' | 'error'

  -- Results
  fetched            int         not null default 0,
  added_to_pending   int         not null default 0,
  skipped_duplicates int         not null default 0,

  -- Error details (null on success)
  error_message      text,
  error_detail       text,

  -- Raw API response snapshot (first 2000 chars for debugging)
  raw_response       text,

  ran_at             timestamptz not null default now()
);

create index if not exists automation_logs_ran_at_idx on automation_logs(ran_at desc);
create index if not exists automation_logs_status_idx on automation_logs(status);

-- Service role access only (append-only — no updates/deletes for data integrity)
alter table automation_logs enable row level security;

create policy "automation_logs: service_role select"
  on automation_logs for select using (auth.role() = 'service_role');

create policy "automation_logs: service_role insert"
  on automation_logs for insert with check (auth.role() = 'service_role');


-- ───────────────────────────────────────────────────────────────
-- 8. SITE_STATS  (aggregate key-value counters, e.g. visitor_count)
-- Public read (used by the visitor-count widget).
-- Writes go through the increment_stat() RPC or service_role only.
-- ───────────────────────────────────────────────────────────────
create table if not exists site_stats (
  key        text        primary key,
  value      bigint      not null default 0,
  updated_at timestamptz not null default now()
);

-- Seed the visitor counter row
insert into site_stats (key, value)
values ('visitor_count', 0)
on conflict (key) do nothing;

alter table site_stats enable row level security;

-- Anyone can read site-wide counters (visitor count widget)
create policy "site_stats: public select"
  on site_stats for select using (true);

-- Only service_role can write (direct DML or via increment_stat RPC)
create policy "site_stats: service_role insert"
  on site_stats for insert with check (auth.role() = 'service_role');

create policy "site_stats: service_role update"
  on site_stats
  for update
  using  (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "site_stats: service_role delete"
  on site_stats for delete using (auth.role() = 'service_role');
