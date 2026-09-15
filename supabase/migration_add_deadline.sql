-- ═══════════════════════════════════════════════════════════════
-- techwithshailu — Add deadline column to pending_jobs
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════════════

-- Add deadline column to pending_jobs (safe — runs only if column doesn't exist)
alter table pending_jobs add column if not exists deadline date;

-- Create index for fast filtering
create index if not exists pending_jobs_deadline_idx on pending_jobs(deadline);
