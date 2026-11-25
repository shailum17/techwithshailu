-- ═══════════════════════════════════════════════════════════════
-- techwithshailu — shared rate limiting
--
-- Serverless instances don't share memory, so per-instance counters
-- are unreliable. This keeps fixed-window counters in Postgres for the
-- endpoints where abuse matters (admin auth failures, visitor counter,
-- newsletter signup). Keys are HMAC hashes of the client IP — no raw
-- IPs are stored.
--
-- Service-role only. Idempotent.
-- ═══════════════════════════════════════════════════════════════

create table if not exists rate_limits (
  key      text        primary key,
  count    int         not null,
  reset_at timestamptz not null
);

alter table rate_limits enable row level security;

drop function if exists public.rate_limit_hit(text, int, int, boolean);

-- Counts a hit (or, with p_peek, only checks) and reports whether the
-- caller is within p_limit hits per p_window_seconds.
create function public.rate_limit_hit(
  p_key            text,
  p_limit          int,
  p_window_seconds int,
  p_peek           boolean default false
)
returns table (allowed boolean, remaining int, reset_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  r      rate_limits%rowtype;
  now_ts timestamptz := now();
begin
  -- Opportunistic cleanup of long-expired windows (~1% of calls)
  if random() < 0.01 then
    delete from rate_limits where rate_limits.reset_at < now_ts - interval '1 day';
  end if;

  if p_peek then
    select * into r from rate_limits where rate_limits.key = p_key;
    if not found or r.reset_at <= now_ts then
      return query select true, p_limit, now_ts + make_interval(secs => p_window_seconds);
    else
      return query select r.count < p_limit, greatest(p_limit - r.count, 0), r.reset_at;
    end if;
    return;
  end if;

  insert into rate_limits as rl (key, count, reset_at)
  values (p_key, 1, now_ts + make_interval(secs => p_window_seconds))
  on conflict (key) do update set
    count    = case when rl.reset_at <= now_ts then 1 else rl.count + 1 end,
    reset_at = case when rl.reset_at <= now_ts
                    then now_ts + make_interval(secs => p_window_seconds)
                    else rl.reset_at end
  returning * into r;

  return query select r.count <= p_limit, greatest(p_limit - r.count, 0), r.reset_at;
end;
$$;

revoke all     on function public.rate_limit_hit(text, int, int, boolean) from public, anon, authenticated;
grant  execute on function public.rate_limit_hit(text, int, int, boolean) to service_role;
