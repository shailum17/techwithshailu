-- Add deadline column to pending_jobs table
-- Run this in Supabase Dashboard → SQL Editor → New Query

ALTER TABLE pending_jobs ADD COLUMN IF NOT EXISTS deadline date;
