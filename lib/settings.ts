/**
 * lib/settings.ts
 *
 * Runtime settings stored in the `app_settings` table
 * (supabase/migrations/20261125000000_app_settings.sql). Server-only.
 */

import { supabaseAdmin } from '@/lib/supabase';

const AUTO_FETCH_KEY = 'auto_fetch';

/**
 * Whether the scheduled (cron) job fetch should run.
 * Fails open (true) if the setting or table is missing, so a database that
 * hasn't had the migration applied keeps today's behaviour.
 */
export async function getAutoFetchEnabled(): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from('app_settings')
    .select('value')
    .eq('key', AUTO_FETCH_KEY)
    .maybeSingle();
  if (error) {
    console.warn('[settings] could not read auto_fetch, assuming enabled:', error.message);
    return true;
  }
  return (data?.value as { enabled?: unknown } | undefined)?.enabled !== false;
}

export async function setAutoFetchEnabled(enabled: boolean): Promise<void> {
  const { error } = await supabaseAdmin
    .from('app_settings')
    .upsert({ key: AUTO_FETCH_KEY, value: { enabled }, updated_at: new Date().toISOString() });
  if (error) throw error;
}

/* ── Admin session epoch ─────────────────────────────────────────────── */

const SESSION_KEY = 'admin_session';

/**
 * Current admin session epoch (see lib/adminSession.ts). 0 when unset.
 * If app_settings can't be read it also returns 0 — sessions then behave
 * as plain signed, expiring tokens (the pre-revocation behaviour) rather
 * than locking the admin out during a database hiccup.
 */
export async function getSessionEpoch(): Promise<number> {
  try {
    const { data, error } = await supabaseAdmin
      .from('app_settings')
      .select('value')
      .eq('key', SESSION_KEY)
      .maybeSingle();
    if (error) throw error;
    const epoch = (data?.value as { epoch?: unknown } | undefined)?.epoch;
    return Number.isInteger(epoch) && (epoch as number) >= 0 ? (epoch as number) : 0;
  } catch (err) {
    console.warn('[settings] could not read admin session epoch:', err instanceof Error ? err.message : err);
    return 0;
  }
}

/** Revokes every admin session by moving to a new epoch. Returns the new epoch. */
export async function bumpSessionEpoch(): Promise<number> {
  const next = (await getSessionEpoch()) + 1;
  const { error } = await supabaseAdmin
    .from('app_settings')
    .upsert({ key: SESSION_KEY, value: { epoch: next }, updated_at: new Date().toISOString() });
  if (error) throw error;
  return next;
}
