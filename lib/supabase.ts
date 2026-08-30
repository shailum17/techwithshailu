/**
 * lib/supabase.ts
 *
 * Two Supabase clients:
 *
 *  supabase  — anon/public client (read-only for public pages, respects RLS)
 *  supabaseAdmin — service-role client (bypasses RLS, used only in API routes)
 *
 * Flow:  Next.js API Route → supabaseAdmin → Supabase (PostgreSQL)
 *
 * Tables:  jobs | tools | roadmaps | blogs | users
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL          = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY     = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SUPABASE_SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('Supabase env vars missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
}

/** Public (anon) client — safe to use in browser / Server Components */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Admin client — uses the service-role key.
 * ONLY import this in API routes (server-side). Never expose to the browser.
 */
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY ?? SUPABASE_ANON_KEY);

export default supabaseAdmin;
