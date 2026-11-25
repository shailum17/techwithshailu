-- ═══════════════════════════════════════════════════════════════
-- techwithshailu — remember reviewed jobs
--
-- Approved and rejected jobs used to be deleted from pending_jobs, so
-- the daily fetch (which de-duplicates against pending_jobs) re-queued
-- them every day. They are now kept with status 'approved' / 'rejected'
-- and the fetch de-duplicates against every row. The cron purges
-- reviewed rows 120 days after they were fetched.
--
-- Redefines approve_pending_job() (from 20261125000200) to mark the
-- row approved instead of deleting it. Idempotent.
-- ═══════════════════════════════════════════════════════════════

create index if not exists pending_jobs_status_idx on pending_jobs(status);
create index if not exists pending_jobs_title_idx  on pending_jobs(title);
create index if not exists jobs_title_idx          on jobs(title);

drop function if exists public.approve_pending_job(uuid, jsonb);

create function public.approve_pending_job(p_id uuid, p_overrides jsonb default '{}'::jsonb)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  p      pending_jobs%rowtype;
  o      jsonb := coalesce(p_overrides, '{}'::jsonb);
  new_id uuid;
begin
  -- Only rows still awaiting review; lock so concurrent approvals can't both publish
  select * into p from pending_jobs where id = p_id and status = 'pending' for update;
  if not found then
    raise exception 'pending job not found' using errcode = 'P0002';
  end if;

  insert into jobs (
    title, company, location, type, salary, description, apply_link,
    tags, deadline, batch_year, is_featured, status, source
  ) values (
    case when jsonb_typeof(o->'title')       = 'string' then o->>'title'       else p.title end,
    case when jsonb_typeof(o->'company')     = 'string' then o->>'company'     else p.company end,
    case when jsonb_typeof(o->'location')    = 'string' then o->>'location'    else coalesce(p.location, 'Remote') end,
    case when jsonb_typeof(o->'type')        = 'string' then o->>'type'        else coalesce(p.type, 'Internship') end,
    case when jsonb_typeof(o->'salary')      = 'string' then o->>'salary'      else p.salary end,
    case when jsonb_typeof(o->'description') = 'string' then o->>'description' else coalesce(p.description, '') end,
    case when jsonb_typeof(o->'apply_link')  = 'string' then o->>'apply_link'  else coalesce(p.apply_link, '') end,
    case when jsonb_typeof(o->'tags') = 'array'
         then array(select jsonb_array_elements_text(o->'tags'))
         else '{}'::text[] end,
    case when jsonb_typeof(o->'deadline')    = 'string' then (o->>'deadline')::date else p.deadline end,
    case when jsonb_typeof(o->'batch_year')  = 'number' then (o->>'batch_year')::int else null end,
    case when jsonb_typeof(o->'is_featured') = 'boolean' then (o->>'is_featured')::boolean else false end,
    'live',
    coalesce(p.source, 'manual')
  )
  returning id into new_id;

  -- Keep the row (with its original title/company) so the fetch won't re-queue it
  update pending_jobs set status = 'approved' where id = p_id;

  return new_id;
end;
$$;

revoke all     on function public.approve_pending_job(uuid, jsonb) from public, anon, authenticated;
grant  execute on function public.approve_pending_job(uuid, jsonb) to service_role;
