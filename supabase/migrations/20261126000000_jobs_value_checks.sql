-- ═══════════════════════════════════════════════════════════════
-- techwithshailu — enforce allowed values for jobs.type / jobs.status
--
-- The API validates these (lib/validate.ts), but a typo written directly
-- to the DB ("Fulltime", "Live") silently hides a job from the site.
--
-- NOT VALID: enforced for every new insert/update, but existing rows are
-- not checked, so this applies even if old data has odd values. To find
-- and fix those, then validate the constraints:
--
--   select id, type, status from jobs
--   where type not in ('Internship','Job','Full-time')
--      or status not in ('live','draft','expired');
--   alter table jobs validate constraint jobs_type_check;
--   alter table jobs validate constraint jobs_status_check;
--
-- Idempotent.
-- ═══════════════════════════════════════════════════════════════

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'jobs_type_check') then
    alter table jobs add constraint jobs_type_check
      check (type in ('Internship', 'Job', 'Full-time')) not valid;
  end if;

  if not exists (select 1 from pg_constraint where conname = 'jobs_status_check') then
    alter table jobs add constraint jobs_status_check
      check (status in ('live', 'draft', 'expired')) not valid;
  end if;
end $$;
