-- ═══════════════════════════════════════════════════════════════
-- Migration: add `logo` and `votes` columns to the tools table
-- Run in: Supabase Dashboard → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════════════

-- Add logo column (replaces icon_url for favicon-domain lookups)
alter table tools
  add column if not exists logo   text,
  add column if not exists votes  int not null default 0;

-- Add unique constraint on name so upsert works correctly
alter table tools
  drop constraint if exists tools_name_key;

alter table tools
  add constraint tools_name_key unique (name);
