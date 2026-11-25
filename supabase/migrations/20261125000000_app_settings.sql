-- ═══════════════════════════════════════════════════════════════
-- techwithshailu — app_settings
--
-- Small key/value store for settings the admin panel changes at
-- runtime. First use: `auto_fetch` → { "enabled": true|false },
-- which pauses/resumes the daily Vercel Cron job fetch
-- (the schedule itself lives in vercel.json).
--
-- Service-role only: RLS on, no anon/authenticated policies.
-- Idempotent.
-- ═══════════════════════════════════════════════════════════════

create table if not exists app_settings (
  key        text        primary key,
  value      jsonb       not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table app_settings enable row level security;

insert into app_settings (key, value)
values ('auto_fetch', '{"enabled": true}'::jsonb)
on conflict (key) do nothing;
