-- ═══════════════════════════════════════════════════════════════
-- techwithshailu — atomic job approval
--
-- approve_pending_job(p_id, p_overrides) moves one row from
-- pending_jobs to jobs in a single transaction: the insert and the
-- delete either both happen or neither does, so a failure can no
-- longer leave a job both live and still pending (and a retry can't
-- publish it twice).
--
-- p_overrides is the admin's edited fields (jsonb). A key that is
-- absent or JSON null keeps the pending row's value, matching the
-- previous `overrides?.x ?? job.x` behaviour.
--
-- Raises 'pending job not found' (SQLSTATE P0002) for an unknown or
-- already-approved id. Service-role only. Idempotent.
-- ═══════════════════════════════════════════════════════════════

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
  -- Lock the pending row so two concurrent approvals can't both publish it
  select * into p from pending_jobs where id = p_id for update;
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

  delete from pending_jobs where id = p_id;

  return new_id;
end;
$$;

revoke all     on function public.approve_pending_job(uuid, jsonb) from public, anon, authenticated;
grant  execute on function public.approve_pending_job(uuid, jsonb) to service_role;
