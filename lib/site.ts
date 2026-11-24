/**
 * lib/site.ts
 *
 * Canonical public origin of the site, without a trailing slash.
 * Set NEXT_PUBLIC_APP_URL per environment; defaults to the production domain.
 * Use this instead of hard-coding the domain anywhere.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL || 'https://techwithshailu.in').replace(/\/+$/, '');
