/**
 * lib/supabase.ts
 *
 * Two Supabase clients:
 *
 *  supabase       — anon/public client (read-only for public pages, respects RLS)
 *  supabaseAdmin  — service-role client (bypasses RLS, used ONLY in API routes)
 *
 * IMPORTANT: Never import supabaseAdmin in client components or pages —
 * only use it inside app/api/** route handlers.
 *
 * Tables: jobs | tools | roadmaps | blogs | users | pending_jobs |
 *         automation_logs | site_stats
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL         = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY    = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Missing required env vars: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set.',
  );
}

// Fail loudly at startup if the service key is absent — a missing key
// previously caused supabaseAdmin to silently fall back to the anon key,
// which would let unprivileged requests bypass RLS checks.
if (!SUPABASE_SERVICE_KEY) {
  throw new Error(
    'Missing required env var: SUPABASE_SERVICE_ROLE_KEY must be set. ' +
    'Never allow supabaseAdmin to fall back to the anon key.',
  );
}

/** Public (anon) client — safe to use in browser / Server Components. Respects RLS. */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Admin client — uses the service-role key. Bypasses ALL RLS policies.
 * ONLY import this in API routes (server-side). Never expose to the browser.
 */
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

export default supabaseAdmin;
