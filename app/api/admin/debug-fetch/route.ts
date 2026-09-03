/**
 * app/api/admin/debug-fetch/route.ts
 *
 * GET /api/admin/debug-fetch?source=unstop|adzuna|rapidapi&q=...
 *
 * Returns raw response from a single source so you can diagnose
 * why jobs aren't being added to pending.
 * Admin-only.
 */

import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/adminAuth';

export async function GET(req: NextRequest) {
  const authError = checkAdminAuth(req);
  if (authError) return authError;

  const { searchParams } = new URL(req.url);
  const source = searchParams.get('source') ?? 'unstop';
  const query  = searchParams.get('q')      ?? 'software developer internship india';

  // ── Unstop ──────────────────────────────────────────────
  if (source === 'unstop') {
    const url = new URL('https://unstop.com/api/public/opportunity/search');
    url.searchParams.set('per_page',   '10');
    url.searchParams.set('page',       '1');
    url.searchParams.set('oppstatus',  'recent');
    url.searchParams.set('searchTerm', query);

    const res  = await fetch(url.toString(), {
      headers: { 'Accept': 'application/json', 'Referer': 'https://unstop.com/', 'User-Agent': 'Mozilla/5.0' },
      cache: 'no-store',
    });
    const text = await res.text();
    let parsed;
    try { parsed = JSON.parse(text); } catch { parsed = { raw: text.slice(0, 1000) }; }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items: any[] = parsed?.data?.data ?? [];
    const now = Date.now();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const analysis = items.map((i: any) => ({
      id:         i.id,
      title:      i.title,
      subtype:    i.subtype,
      status:     i.status,
      regn_open:  i.regn_open,
      paid:       i.paid,
      end_regn_dt: i.regnRequirements?.end_regn_dt,
      prizes:     i.prizes,        // ← salary source
      salary_raw: i.salary,        // ← plain string fallback
      expired:    i.regnRequirements?.end_regn_dt
        ? new Date(i.regnRequirements.end_regn_dt).getTime() < now
        : false,
      // Why it passes/fails filter
      pass: ['internships','jobs'].includes(i.subtype ?? '')
        && i.status === 'LIVE'
        && i.regn_open === 1
        && i.paid === 0
        && (!i.regnRequirements?.end_regn_dt || new Date(i.regnRequirements.end_regn_dt).getTime() > now),
    }));

    return NextResponse.json({
      source: 'unstop',
      http_status: res.status,
      total_returned: items.length,
      passing_filter: analysis.filter(a => a.pass).length,
      items: analysis,
    });
  }

  // ── RapidAPI ─────────────────────────────────────────────
  if (source === 'rapidapi') {
    const key = process.env.RAPIDAPI_KEY;
    if (!key) return NextResponse.json({ error: 'RAPIDAPI_KEY not set' }, { status: 500 });

    const res = await fetch(
      `https://jsearch.p.rapidapi.com/search-v2?query=${encodeURIComponent(query)}&num_pages=1&date_posted=all`,
      { headers: { 'x-rapidapi-key': key, 'x-rapidapi-host': 'jsearch.p.rapidapi.com' }, cache: 'no-store' }
    );
    const text = await res.text();
    let parsed;
    try { parsed = JSON.parse(text); } catch { return NextResponse.json({ error: 'invalid JSON', raw: text.slice(0, 500) }); }

    const raw = parsed?.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let items: any[] = [];
    if (Array.isArray(raw)) items = raw;
    else if (raw && typeof raw === 'object') items = raw.jobs ?? raw.results ?? [];

    return NextResponse.json({
      source: 'rapidapi',
      http_status: res.status,
      total_returned: items.length,
      response_keys: Object.keys(parsed ?? {}),
      data_keys: raw && typeof raw === 'object' && !Array.isArray(raw) ? Object.keys(raw) : 'array',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sample: items.slice(0, 3).map((j: any) => ({
        title:            j.job_title,
        company:          j.employer_name,
        link:             j.job_apply_link,
        salary_currency:  j.job_salary_currency,
        salary_period:    j.job_salary_period,
        salary_min:       j.job_min_salary,
        salary_max:       j.job_max_salary,
        // First 300 chars of description to check text-based extraction
        description_peek: (j.job_description ?? '').slice(0, 300),
      })),
    });
  }

  // ── Adzuna ───────────────────────────────────────────────
  if (source === 'adzuna') {
    const appId  = process.env.ADZUNA_APP_ID;
    const appKey = process.env.ADZUNA_APP_KEY;
    if (!appId || !appKey) return NextResponse.json({ error: 'ADZUNA_APP_ID or ADZUNA_APP_KEY not set' }, { status: 500 });

    const url = new URL('https://api.adzuna.com/v1/api/jobs/in/search/1');
    url.searchParams.set('app_id',           appId);
    url.searchParams.set('app_key',          appKey);
    url.searchParams.set('results_per_page', '10');
    url.searchParams.set('what',             query);
    url.searchParams.set('sort_by',          'date');
    url.searchParams.set('content-type',     'application/json');

    const res  = await fetch(url.toString(), { cache: 'no-store' });
    const text = await res.text();
    let parsed;
    try { parsed = JSON.parse(text); } catch { return NextResponse.json({ error: 'invalid JSON', raw: text.slice(0, 500) }); }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const results: any[] = parsed?.results ?? [];
    return NextResponse.json({
      source: 'adzuna',
      http_status: res.status,
      total_returned: results.length,
      count: parsed?.count,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sample: results.slice(0, 3).map((j: any) => ({
        title:            j.title,
        company:          j.company?.display_name,
        url:              j.redirect_url,
        salary_min:       j.salary_min,
        salary_max:       j.salary_max,
        description_peek: (j.description ?? '').slice(0, 300),
      })),
    });
  }

  return NextResponse.json({ error: 'source must be unstop | rapidapi | adzuna' }, { status: 400 });
}
