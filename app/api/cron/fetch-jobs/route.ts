/**
 * app/api/cron/fetch-jobs/route.ts
 *
 * Automation system — fetches from 3 verified sources in parallel:
 *
 *   SOURCE 1 — Unstop        (India, no key, public API)
 *   SOURCE 2 — Adzuna        (India aggregator, free key: developer.adzuna.com)
 *   SOURCE 3 — RapidAPI JSearch (covers Naukri, Internshala, LinkedIn, Indeed,
 *                                Glassdoor, company career portals via Google Jobs)
 *
 * All 3 sources run simultaneously. Results are merged, deduplicated,
 * and inserted into pending_jobs for admin review.
 *
 * Auth:
 *   Vercel Cron : Authorization: Bearer <CRON_SECRET>
 *   Admin manual: x-admin-key: <ADMIN_SECRET>
 *
 * Every run is logged to automation_logs table.
 */

import { supabaseAdmin } from '@/lib/supabase';
import { formatJobDescription } from '@/lib/formatJobDescription';

export const dynamic  = 'force-dynamic';
export const maxDuration = 60; // allow up to 60s on Vercel Pro / increase if needed

/* ─────────────────────────────────────────────────────────────
   Shared type
───────────────────────────────────────────────────────────── */
interface Job {
  title:       string;
  company:     string;
  location:    string;
  type:        string;
  description: string;
  apply_link:  string;
  salary:      string | null;
  deadline:    string | null;
  source:      string;
}

/* ─────────────────────────────────────────────────────────────
   Helper — fetch with timeout so one slow source
   never blocks the whole run
───────────────────────────────────────────────────────────── */
async function fetchWithTimeout(input: RequestInfo, init: RequestInit, ms = 8000): Promise<Response> {
  const controller = new AbortController();
  const timer      = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/* ─────────────────────────────────────────────────────────────
   Salary extractor — parses salary from job description text
   when the API's structured salary fields are empty.
   Handles common Indian formats found in job descriptions:
     ₹15,000/month · ₹15k/mo · ₹5-8 LPA · 15000 per month
     INR 15000 · Rs. 15,000 · CTC 5L · Stipend: ₹10k
───────────────────────────────────────────────────────────── */
function extractSalaryFromText(text: string): string | null {
  if (!text) return null;
  // Strip HTML tags first
  const plain = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

  const patterns: RegExp[] = [
    // ₹15,000 - ₹20,000 per month | ₹15000/month
    /₹\s*[\d,]+(?:\s*[-–to]+\s*₹?\s*[\d,]+)?\s*(?:per\s+)?(?:month|mo|\/mo|monthly)/i,
    // ₹5 LPA | ₹5-8 LPA | ₹5L - ₹8L
    /₹\s*[\d.]+\s*[-–to]*\s*₹?\s*[\d.]*\s*(?:LPA|L\.?P\.?A|lakhs?\s*p\.?a|lakh\s*per\s*annum)/i,
    // ₹5L | ₹5k per month
    /₹\s*[\d.]+\s*[Lk]\s*(?:[-–]\s*₹?\s*[\d.]+\s*[Lk])?\s*(?:per\s+(?:month|year|annum)|\/mo|\/yr|PA)?/i,
    // Stipend: 15000 | Stipend of ₹15,000
    /stipend[:\s]+(?:of\s+)?(?:₹|Rs\.?\s*|INR\s*)?\s*[\d,]+(?:\s*[-–]\s*[\d,]+)?(?:\s*(?:per\s+)?(?:month|mo))?/i,
    // INR 15,000 | Rs 15000 | Rs. 15,000
    /(?:INR|Rs\.?)\s*[\d,]+(?:\s*[-–]\s*[\d,]+)?(?:\s*(?:per\s+)?(?:month|year|annum|LPA))?/i,
    // CTC: 5 LPA | CTC of 6-8 LPA
    /CTC[:\s]+(?:of\s+)?[\d.]+\s*[-–to]*\s*[\d.]*\s*(?:LPA|L\.?P\.?A|lakhs?)/i,
    // 15,000 per month | 15000/month (plain number + period)
    /\b[\d,]{4,}\s*(?:[-–]\s*[\d,]+)?\s*(?:per\s+month|\/month|per\s*mo|\/mo)\b/i,
  ];

  for (const pattern of patterns) {
    const match = plain.match(pattern);
    if (match) {
      // Clean up and normalise
      let s = match[0].trim()
        .replace(/\s+/g, ' ')
        .replace(/Rs\.\s*/i, '₹')
        .replace(/INR\s*/i, '₹')
        .replace(/per month/i, '/mo')
        .replace(/per annum/i, 'PA')
        .replace(/per year/i, 'PA')
        .replace(/lakhs? per annum/i, 'LPA')
        .replace(/L\.P\.A\.?/i, 'LPA');
      // Trim to 40 chars so it fits the card
      if (s.length > 40) s = s.slice(0, 38) + '…';
      return s;
    }
  }
  return null;
}
async function saveLog(entry: {
  trigger_type:        string;
  query:               string;
  status:              string;
  fetched?:            number;
  added_to_pending?:   number;
  skipped_duplicates?: number;
  error_message?:      string;
  raw_response?:       string;
}) {
  const { error } = await supabaseAdmin.from('automation_logs').insert({
    trigger_type:       entry.trigger_type,
    query:              entry.query,
    status:             entry.status,
    fetched:            entry.fetched            ?? 0,
    added_to_pending:   entry.added_to_pending   ?? 0,
    skipped_duplicates: entry.skipped_duplicates ?? 0,
    error_message:      entry.error_message      ?? null,
    raw_response:       entry.raw_response       ?? null,
  });
  if (error) console.error('[cron] log save failed:', error.message);
}

/* ═════════════════════════════════════════════════════════════
   SOURCE 1 — UNSTOP
   Public API — no key required
   Filters: LIVE + regn open + free + deadline in future
   URL: unstop.com/api/public/opportunity/search
═════════════════════════════════════════════════════════════ */
async function fetchUnstop(query: string): Promise<Job[]> {
  try {
    const url = new URL('https://unstop.com/api/public/opportunity/search');
    url.searchParams.set('per_page',   '40');
    url.searchParams.set('page',       '1');
    url.searchParams.set('oppstatus',  'recent');
    url.searchParams.set('searchTerm', query);

    const res = await fetchWithTimeout(url.toString(), {
      headers: {
        'Accept':          'application/json',
        'Accept-Language': 'en-IN,en;q=0.9',
        'Referer':         'https://unstop.com/',
        'User-Agent':      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!res.ok) { console.warn(`[Unstop] HTTP ${res.status}`); return []; }

    const text = await res.text();
    if (!text.trim()) return [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parsed: any = JSON.parse(text);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items: any[] = parsed?.data?.data ?? [];
    const now = Date.now();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const valid = items.filter((i: any) => {
      if (!['internships', 'jobs'].includes(i.subtype ?? '')) return false;
      if (i.status    !== 'LIVE') return false;
      if (i.regn_open !== 1)      return false;
      if (i.paid      !== 0)      return false;
      const end = i.regnRequirements?.end_regn_dt;
      if (end && new Date(end).getTime() < now) return false;
      return true;
    });

    console.log(`[Unstop] total=${items.length} valid=${valid.length}`);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return valid.map((i: any): Job => {
      // Unstop returns stipend in i.prizes (for internships) or i.salary_details
      let salary: string | null = null;
      const stipend = i.prizes?.[0];   // e.g. { type: 'cash', min: 5000, max: 15000, unit: 'month' }
      if (stipend?.min) {
        const unit = (stipend.unit ?? '').toLowerCase().includes('month') ? '/mo' :
                     (stipend.unit ?? '').toLowerCase().includes('year')  ? ' PA' : '';
        if (stipend.max && stipend.max !== stipend.min) {
          salary = `₹${(stipend.min / 1000).toFixed(0)}k–₹${(stipend.max / 1000).toFixed(0)}k${unit}`;
        } else {
          salary = `₹${(stipend.min / 1000).toFixed(0)}k${unit}`;
        }
      } else if (i.salary) {
        salary = i.salary; // plain string fallback
      }
      // Last resort: extract salary from description text
      if (!salary) salary = extractSalaryFromText(i.details ?? '');
      return {
        title:       (i.title ?? '').trim(),
        company:     (i.organisation?.name ?? 'Unknown').trim(),
        location:    i.region === 'online' ? 'Remote' : (i.region ?? 'India'),
        type:        i.subtype === 'internships' ? 'Internship' : 'Job',
        description: formatJobDescription(i.details ?? ''),
        apply_link:  i.seo_url ?? `https://unstop.com/${i.type ?? 'internships'}/${i.id}`,
        salary,
        deadline:    i.regnRequirements?.end_regn_dt ?? null,
        source:      'unstop',
      };
    });
  } catch (err) {
    console.error('[Unstop]', err instanceof Error ? err.message : err);
    return [];
  }
}

/* ═════════════════════════════════════════════════════════════
   SOURCE 2 — ADZUNA INDIA
   Free API key from: https://developer.adzuna.com
   Aggregates: Naukri, TimesJobs, Shine, Monster India, company pages
   Env vars: ADZUNA_APP_ID, ADZUNA_APP_KEY
═════════════════════════════════════════════════════════════ */
async function fetchAdzuna(query: string): Promise<Job[]> {
  const appId  = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;
  if (!appId || !appKey) {
    console.warn('[Adzuna] keys not set — sign up free at developer.adzuna.com');
    return [];
  }

  try {
    const url = new URL('https://api.adzuna.com/v1/api/jobs/in/search/1');
    url.searchParams.set('app_id',           appId);
    url.searchParams.set('app_key',          appKey);
    url.searchParams.set('results_per_page', '20');
    url.searchParams.set('what',             query);
    url.searchParams.set('what_or',          'fresher intern internship graduate entry-level');
    url.searchParams.set('sort_by',          'date');
    url.searchParams.set('max_days_old',     '30');
    url.searchParams.set('content-type',     'application/json');

    const res = await fetchWithTimeout(url.toString(), {});
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.warn(`[Adzuna] HTTP ${res.status}: ${body.slice(0, 150)}`);
      return [];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any  = await res.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const list: any[] = data?.results ?? [];
    console.log(`[Adzuna] found ${list.length}`);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return list.map((j: any): Job => {
      const title = (j.title ?? '').trim();
      const loc   = [j.location?.display_name, j.location?.area?.slice(-2, -1)?.[0]]
        .filter(Boolean).join(', ') || 'India';
      const type  = title.toLowerCase().includes('intern')
        || (j.category?.label ?? '').toLowerCase().includes('intern')
        ? 'Internship' : 'Job';
      let salary: string | null = null;
      if (j.salary_min) {
        const min = Number(j.salary_min);
        const max = j.salary_max ? Number(j.salary_max) : null;
        // Adzuna India returns annual INR values
        const fmtInr = (v: number) => v >= 100000
          ? `₹${(v / 100000).toFixed(1).replace(/\.0$/, '')}L`
          : v >= 1000
          ? `₹${(v / 1000).toFixed(0)}k`
          : `₹${v}`;
        salary = (max && max !== min)
          ? `${fmtInr(min)}–${fmtInr(max)} PA`
          : `${fmtInr(min)} PA`;
      }
      // Fallback: extract from description text
      if (!salary) salary = extractSalaryFromText(j.description ?? '');
      return {
        title,
        company:     (j.company?.display_name ?? 'Unknown').trim(),
        location:    loc,
        type,
        description: formatJobDescription(j.description ?? ''),
        apply_link:  j.redirect_url ?? '',
        salary,
        deadline:    null,
        source:      'adzuna',
      };
    });
  } catch (err) {
    console.error('[Adzuna]', err instanceof Error ? err.message : err);
    return [];
  }
}

/* ═════════════════════════════════════════════════════════════
   SOURCE 3 — RAPIDAPI JSEARCH
   Aggregates via Google Jobs index:
     • Naukri.com          (site:naukri.com query)
     • Internshala         (site:internshala.com query)
     • LinkedIn Jobs       (site:linkedin.com query)
     • Indeed India        (base query)
     • Glassdoor           (base query)
     • Freshersworld       (base query)
     • Shine / Monster     (base query)
     • Company career pages — Google, Amazon, TCS, Infosys,
       Wipro, Cognizant, Flipkart, Razorpay etc.
       (rotating daily company-specific queries)
   Env var: RAPIDAPI_KEY
═════════════════════════════════════════════════════════════ */

// Full list of company-specific queries covering all portals from the document
const COMPANY_QUERIES = [
  // MNC Tech (careers.google.com, amazon.jobs, microsoft.com/careers etc.)
  'software developer intern Google India 2026',
  'software developer intern Amazon India 2026',
  'software developer intern Microsoft India 2026',
  'software engineer fresher IBM India',
  'software intern Adobe India',
  'software intern Oracle India',
  'software intern SAP India',
  'software intern Salesforce India',
  'software intern Meta India',
  'software intern Apple India',
  // Indian IT Services — mass fresher hiring
  'TCS NQT fresher hiring 2026',
  'Infosys fresher hiring 2026',
  'Wipro fresher hiring 2026',
  'Capgemini fresher hiring India 2026',
  'HCLTech fresher hiring India 2026',
  'Cognizant fresher hiring India 2026',
  'Accenture fresher hiring India 2026',
  'Tech Mahindra fresher hiring India 2026',
  // Indian Product / Startup
  'Flipkart software intern 2026',
  'Razorpay software intern India',
  'Freshworks software intern India',
  'Zoho fresher developer India',
  'PhonePe software engineer fresher India',
  'Zomato software intern India',
  'Swiggy software intern India',
  'Groww software intern India',
  'CRED software engineer intern India',
  'Paytm software engineer fresher India',
];

async function fetchOneRapidQuery(query: string, key: string): Promise<Job[]> {
  try {
    const res = await fetchWithTimeout(
      `https://jsearch.p.rapidapi.com/search-v2?query=${encodeURIComponent(query)}&num_pages=1&date_posted=all`,
      {
        method:  'GET',
        headers: { 'x-rapidapi-key': key, 'x-rapidapi-host': 'jsearch.p.rapidapi.com' },
      },
      9000
    );

    if (!res.ok) { console.warn(`[RapidAPI] HTTP ${res.status} for "${query}"`); return []; }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parsed: any = await res.json();
    const raw = parsed?.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let items: any[] = [];
    if (Array.isArray(raw))                                items = raw;
    else if (raw && typeof raw === 'object')               items = raw.jobs ?? raw.results ?? [];

    console.log(`[RapidAPI] "${query}" → ${items.length} jobs`);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return items.map((j: any): Job => {
      let salary: string | null = null;
      if (j.job_min_salary) {
        const currency = (j.job_salary_currency ?? '').toUpperCase();
        const period   = (j.job_salary_period   ?? '').toUpperCase();
        const min      = Number(j.job_min_salary);
        const max      = j.job_max_salary ? Number(j.job_max_salary) : null;

        // Format period label
        const periodLabel = period === 'MONTH'  ? '/mo'
                          : period === 'YEAR'   ? ' PA'
                          : period === 'HOUR'   ? '/hr'
                          : period === 'WEEK'   ? '/wk'
                          : '';

        if (currency === 'INR') {
          // Convert to lakhs if ≥ 1L
          const fmtInr = (v: number) => v >= 100000
            ? `₹${(v / 100000).toFixed(1).replace(/\.0$/, '')}L`
            : `₹${(v / 1000).toFixed(0)}k`;
          salary = max && max !== min
            ? `${fmtInr(min)}–${fmtInr(max)}${periodLabel}`
            : `${fmtInr(min)}${periodLabel}`;
        } else {
          // USD or other — show as-is with currency symbol
          const sym = currency === 'USD' ? '$' : currency + ' ';
          const fmtAmt = (v: number) => v >= 1000
            ? `${sym}${(v / 1000).toFixed(0)}k`
            : `${sym}${v}`;
          salary = max && max !== min
            ? `${fmtAmt(min)}–${fmtAmt(max)}${periodLabel}`
            : `${fmtAmt(min)}${periodLabel}`;
        }
      }
      // Fallback: extract from description text
      if (!salary) salary = extractSalaryFromText(j.job_description ?? '');
      return {
        title:       (j.job_title ?? '').trim(),
        company:     (j.employer_name ?? 'Unknown').trim(),
        location:    j.job_city ?? j.job_country ?? 'Remote',
        type:        j.job_employment_type ?? 'Internship',
        description: formatJobDescription(j.job_description ?? ''),
        apply_link:  j.job_apply_link ?? '',
        salary,
        deadline:    null,
        source:      'rapidapi',
      };
    });
  } catch (err) {
    console.error(`[RapidAPI] "${query}" error:`, err instanceof Error ? err.message : err);
    return [];
  }
}

async function fetchRapidAPI(query: string): Promise<Job[]> {
  const key = process.env.RAPIDAPI_KEY;
  if (!key) { console.warn('[RapidAPI] RAPIDAPI_KEY not set'); return []; }

  // ── Base queries — always run (cover all major Indian job boards) ──
  const baseQueries = [
    query,                              // Indeed, Glassdoor, Freshersworld, Shine, Monster
    `${query} site:naukri.com`,         // Naukri.com
    `${query} site:internshala.com`,    // Internshala
    `${query} site:linkedin.com`,       // LinkedIn Jobs
  ];

  // ── Company queries — rotate 5 per day (covers all 28 companies weekly) ──
  const dayIdx   = Math.floor(Date.now() / 86_400_000);
  const batchSz  = 5;
  const start    = (dayIdx * batchSz) % COMPANY_QUERIES.length;
  const todaySet = [
    ...COMPANY_QUERIES.slice(start, start + batchSz),
    ...COMPANY_QUERIES.slice(0, Math.max(0, (start + batchSz) - COMPANY_QUERIES.length)),
  ];

  // Manual search: only run base queries to save quota
  const isManual = !query.toLowerCase().includes('india');
  const toRun    = isManual ? baseQueries : [...baseQueries, ...todaySet];

  console.log(`[RapidAPI] ${toRun.length} queries (${baseQueries.length} base + ${isManual ? 0 : todaySet.length} company)`);

  // Run base queries in parallel, company queries in parallel separately
  const [baseResults, companyResults] = await Promise.all([
    Promise.all(baseQueries.map(q => fetchOneRapidQuery(q, key))),
    isManual ? Promise.resolve([]) : Promise.all(todaySet.map(q => fetchOneRapidQuery(q, key))),
  ]);

  const all = [...baseResults.flat(), ...(Array.isArray(companyResults) ? companyResults.flat() : [])];
  console.log(`[RapidAPI] total: ${all.length}`);
  return all;
}

/* ═════════════════════════════════════════════════════════════
   MAIN HANDLER
═════════════════════════════════════════════════════════════ */
export async function GET(req: Request) {

  // Auth check
  const authHeader = req.headers.get('authorization') ?? '';
  const adminKey   = req.headers.get('x-admin-key')   ?? '';
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && adminKey !== process.env.ADMIN_SECRET) {
    return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const trigger  = authHeader === `Bearer ${process.env.CRON_SECRET}` ? 'cron' : 'manual';
  const rawQuery = new URL(req.url).searchParams.get('q') ?? 'software developer internship india';

  console.log(`[cron] START trigger=${trigger} query="${rawQuery}"`);

  // ── Fetch all sources in parallel ────────────────────────
  const [unstopJobs, adzunaJobs, rapidJobs] = await Promise.all([
    fetchUnstop(rawQuery),
    fetchAdzuna(rawQuery),
    fetchRapidAPI(rawQuery),
  ]);

  // ── Merge + global dedupe by title+company ────────────────
  const seen    = new Set<string>();
  const allJobs: Job[] = [];
  for (const job of [...unstopJobs, ...adzunaJobs, ...rapidJobs]) {
    if (!job.title.trim() || !job.company.trim()) continue;
    const key = `${job.title.toLowerCase().slice(0, 60)}||${job.company.toLowerCase().slice(0, 40)}`;
    if (!seen.has(key)) { seen.add(key); allJobs.push(job); }
  }

  const summary = {
    unstop:   unstopJobs.length,
    adzuna:   adzunaJobs.length,
    rapidapi: rapidJobs.length,
    merged:   allJobs.length,
  };
  console.log(`[cron] merged:`, summary);

  if (allJobs.length === 0) {
    await saveLog({ trigger_type: trigger, query: rawQuery, status: 'success',
                    fetched: 0, raw_response: JSON.stringify(summary) });
    return Response.json({ success: true, ...summary,
      note: 'No results. RapidAPI & Unstop have no new listings, or check env vars.' });
  }

  // ── Insert non-duplicates into pending_jobs ───────────────
  let newCount  = 0;
  let dupeCount = 0;
  const errors: string[] = [];

  for (const job of allJobs) {
    const { data: existing, error: checkErr } = await supabaseAdmin
      .from('pending_jobs')
      .select('id')
      .eq('title',   job.title)
      .eq('company', job.company)
      .maybeSingle();

    if (checkErr)  { errors.push(`check: ${checkErr.message}`); continue; }
    if (existing)  { dupeCount++; continue; }

    // Build insert — only include deadline if the column exists
    // (run: ALTER TABLE pending_jobs ADD COLUMN IF NOT EXISTS deadline date;  in Supabase SQL Editor)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const insertRow: Record<string, any> = {
      title:       job.title,
      company:     job.company,
      location:    job.location,
      type:        job.type,
      description: job.description,
      apply_link:  job.apply_link,
      salary:      job.salary,
      source:      job.source,
    };
    if (job.deadline) insertRow.deadline = job.deadline;

    const { error: insertErr } = await supabaseAdmin.from('pending_jobs').insert(insertRow);

    if (insertErr) errors.push(insertErr.message);
    else           newCount++;
  }

  // ── Log to DB ─────────────────────────────────────────────
  await saveLog({
    trigger_type:       trigger,
    query:              rawQuery,
    status:             errors.length > 0 && newCount === 0 ? 'error' : 'success',
    fetched:            allJobs.length,
    added_to_pending:   newCount,
    skipped_duplicates: dupeCount,
    error_message:      errors.length > 0 ? errors.slice(0, 5).join('; ') : undefined,
    raw_response:       JSON.stringify(summary),
  });

  // ── Telegram notification ─────────────────────────────────
  if (newCount > 0 && process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
    fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id:    process.env.TELEGRAM_CHAT_ID,
        text: `[techwithshailu] *techwithshailu*\n\n` +
              `[ok] *${newCount}* new opportunities added!\n` +
              `[stats] Sources: Unstop(${unstopJobs.length}) Adzuna(${adzunaJobs.length}) RapidAPI(${rapidJobs.length})\n` +
              `Approve: https://techwithshailu.com/admin`,
        parse_mode: 'Markdown',
      }),
    }).catch(() => {/* non-fatal */});
  }

  console.log(`[cron] DONE added=${newCount} dupes=${dupeCount} errors=${errors.length}`);

  return Response.json({
    success:            true,
    query:              rawQuery,
    trigger,
    sources:            summary,
    fetched:            allJobs.length,       // total before DB dedupe
    added_to_pending:   newCount,
    skipped_duplicates: dupeCount,
    insert_errors:      errors.length > 0 ? errors : undefined,
  });
}
