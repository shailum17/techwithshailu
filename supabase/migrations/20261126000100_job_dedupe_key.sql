-- ═══════════════════════════════════════════════════════════════
-- techwithshailu — reliable job de-duplication
--
-- The daily fetch compared normalised title+company keys in JS but looked
-- rows up by exact title, so case/whitespace variants slipped through, and
-- nothing stopped two overlapping runs inserting the same listing.
--
-- Adds a generated `dedupe_key` column to pending_jobs and jobs using the
-- same normalisation as dedupeKey() in lib/jobPipeline.ts:
--   lower-case → collapse whitespace → trim → first 60 chars (title)
--   / 40 chars (company), joined by '||'
-- and a UNIQUE index on pending_jobs.dedupe_key, which the fetch uses
-- with ON CONFLICT DO NOTHING.
--
-- ⚠ Before creating the unique index this DELETES duplicate pending_jobs
-- rows that share a key, keeping one per key: an approved row first,
-- then rejected, then the oldest pending. pending_jobs is only the review
-- queue / fetch history; live jobs are in `jobs` and are not touched.
--
-- Idempotent.
-- ═══════════════════════════════════════════════════════════════

alter table pending_jobs add column if not exists dedupe_key text
  generated always as (
    left(btrim(regexp_replace(lower(coalesce(title,   '')), '\s+', ' ', 'g')), 60) || '||' ||
    left(btrim(regexp_replace(lower(coalesce(company, '')), '\s+', ' ', 'g')), 40)
  ) stored;

alter table jobs add column if not exists dedupe_key text
  generated always as (
    left(btrim(regexp_replace(lower(coalesce(title,   '')), '\s+', ' ', 'g')), 60) || '||' ||
    left(btrim(regexp_replace(lower(coalesce(company, '')), '\s+', ' ', 'g')), 40)
  ) stored;

-- Remove existing duplicates so the unique index can be built
delete from pending_jobs p
using (
  select id,
         row_number() over (
           partition by dedupe_key
           order by case status when 'approved' then 0 when 'rejected' then 1 else 2 end,
                    fetched_at
         ) as rn
  from pending_jobs
) d
where p.id = d.id and d.rn > 1;

create unique index if not exists pending_jobs_dedupe_key_key on pending_jobs(dedupe_key);
create index        if not exists jobs_dedupe_key_idx         on jobs(dedupe_key);
