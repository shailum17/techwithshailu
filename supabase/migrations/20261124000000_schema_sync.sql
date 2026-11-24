-- ═══════════════════════════════════════════════════════════════
-- techwithshailu — schema sync
--
-- Brings a database built from schema.sql up to what the app code
-- actually uses. Folds in the former ad-hoc scripts:
--   • add-deadline-column.sql / migration_add_deadline.sql
--   • migration_tools_add_logo_votes.sql
-- and adds the increment_stat() RPC, which /api/visitors calls but
-- which was never defined in the repo.
--
-- Idempotent: safe to run on an existing production database.
-- Apply with `supabase db push` or paste into the SQL Editor.
-- ═══════════════════════════════════════════════════════════════

-- ── pending_jobs.deadline (cron fetch-jobs writes it) ──────────
alter table pending_jobs add column if not exists deadline date;
create index if not exists pending_jobs_deadline_idx on pending_jobs(deadline);

-- ── tools.logo / tools.votes + unique name (seed-tools upserts on name)
alter table tools
  add column if not exists logo  text,
  add column if not exists votes int not null default 0;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'tools_name_key'
  ) then
    alter table tools add constraint tools_name_key unique (name);
  end if;
end $$;

-- ── blogs.category / blogs.read_time (admin form + upload-md) ───
alter table blogs
  add column if not exists category  text default 'General',
  add column if not exists read_time text default '';

-- ── increment_stat(stat_key) — atomic counter used by /api/visitors
-- SECURITY DEFINER so it can write site_stats despite RLS.
-- Execution is restricted to service_role: the public anon key must
-- not be able to call it directly through PostgREST (/rest/v1/rpc/…)
-- and inflate the counter.
drop function if exists public.increment_stat(text);

create function public.increment_stat(stat_key text)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  new_value bigint;
begin
  insert into site_stats (key, value)
  values (stat_key, 1)
  on conflict (key) do update
    set value      = site_stats.value + 1,
        updated_at = now()
  returning value into new_value;

  return new_value;
end;
$$;

revoke all     on function public.increment_stat(text) from public, anon, authenticated;
grant  execute on function public.increment_stat(text) to service_role;
