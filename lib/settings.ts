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
