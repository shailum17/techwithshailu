/**
 * Runs the real /api/cron/fetch-jobs handler against an in-memory fake of the
 * Supabase client and stubbed source/Telegram HTTP calls.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { NextRequest } from 'next/server';

type Row = Record<string, unknown>;
const db: Record<string, Row[]> = {};
const calls: { table: string; op: string; arg?: unknown }[] = [];

function table(name: string) {
  db[name] ??= [];
  return {
    select(_cols: string) {
      return {
        in(col: string, vals: unknown[]) {
          calls.push({ table: name, op: 'select-in', arg: vals.length });
          return Promise.resolve({ data: db[name].filter(r => vals.includes(r[col])), error: null });
        },
        eq(col: string, val: unknown) {
          return {
            maybeSingle: () => Promise.resolve({ data: db[name].find(r => r[col] === val) ?? null, error: null }),
          };
        },
      };
    },
    delete() {
      const conds: ((r: Row) => boolean)[] = [];
      const q = {
        in(col: string, vals: unknown[]) { conds.push(r => vals.includes(r[col])); return q; },
        lt(col: string, val: string) {
          conds.push(r => String(r[col]) < val);
          const before = db[name].length;
          db[name] = db[name].filter(r => !conds.every(c => c(r)));
          calls.push({ table: name, op: 'delete', arg: before - db[name].length });
          return Promise.resolve({ error: null });
        },
      };
      return q;
    },
    insert(rows: Row | Row[]) {
      const list = Array.isArray(rows) ? rows : [rows];
      calls.push({ table: name, op: 'insert', arg: list.length });
      db[name].push(...list);
      return Promise.resolve({ error: null });
    },
  };
}

vi.mock('@/lib/supabase', () => ({
  supabaseAdmin: { from: (t: string) => table(t) },
  supabase:      { from: (t: string) => table(t) },
}));

function unstopItem(title: string, company: string, extra: Row = {}) {
  return {
    id: Math.floor(Math.random() * 1e6), title, subtype: 'internships', status: 'LIVE',
    regn_open: 1, paid: 0, region: 'online', organisation: { name: company },
    details: '<p>Build things</p>', seo_url: `https://unstop.com/${encodeURIComponent(title)}`,
    ...extra,
  };
}

const telegramCalls: string[] = [];

beforeEach(() => {
  for (const k of Object.keys(db)) delete db[k];
  calls.length = 0;
  telegramCalls.length = 0;
  process.env.CRON_SECRET = 'cron-secret';
  process.env.ADMIN_SECRET = 'admin-secret';
  process.env.TELEGRAM_BOT_TOKEN = 'tg-token';
  process.env.TELEGRAM_CHAT_ID = '123';
  delete process.env.ADZUNA_APP_ID;
  delete process.env.ADZUNA_APP_KEY;
  delete process.env.RAPIDAPI_KEY;

  vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    if (url.startsWith('https://unstop.com/api/public/opportunity/search')) {
      return new Response(JSON.stringify({ data: { data: [
        unstopItem('Frontend Intern', 'Acme'),
        unstopItem('Backend Intern', 'Globex', { region: 'Pune' }),
        unstopItem('Frontend Intern', 'ACME '),                 // in-batch duplicate (case/space)
        unstopItem('Data Intern', 'Initech'),                   // already pending in DB
      ] } }), { status: 200 });
    }
    if (url.startsWith('https://api.telegram.org/')) {
      telegramCalls.push(String(init?.body));
      return new Response('{"ok":true}', { status: 200 });
    }
    throw new Error(`unexpected fetch ${url}`);
  }));
});

afterEach(() => { vi.unstubAllGlobals(); });

async function run(query = '', headers: Record<string, string> = { authorization: 'Bearer cron-secret' }) {
  const { GET } = await import('@/app/api/cron/fetch-jobs/route');
  const res = await GET(new NextRequest(`http://localhost/api/cron/fetch-jobs${query}`, {
    headers: { 'x-forwarded-for': `198.51.100.${Math.floor(Math.random() * 250)}`, ...headers },
  }));
  return { status: res.status, body: await res.json() };
}

describe('GET /api/cron/fetch-jobs', () => {
  it('rejects requests without valid credentials', async () => {
    expect((await run('', {})).status).toBe(401);
    expect((await run('', { authorization: 'Bearer undefined' })).status).toBe(401);
  });

  it('dedupes in-batch and against pending_jobs, bulk-inserts once, and awaits Telegram', async () => {
    db.pending_jobs = [{ title: 'Data Intern', company: 'Initech' }];

    const { status, body } = await run();
    expect(status).toBe(200);
    expect(body.added_to_pending).toBe(2);
    expect(body.skipped_duplicates).toBe(1);
    expect(body.telegram).toBe('sent');

    const inserts = calls.filter(c => c.table === 'pending_jobs' && c.op === 'insert');
    expect(inserts).toEqual([{ table: 'pending_jobs', op: 'insert', arg: 2 }]);   // one bulk insert
    // one lookup per table (pending_jobs + live jobs) for this batch of titles
    expect(calls.filter(c => c.op === 'select-in').map(c => c.table)).toEqual(['pending_jobs', 'jobs']);

    expect(db.pending_jobs.map(r => r.title).sort()).toEqual(['Backend Intern', 'Data Intern', 'Frontend Intern']);
    expect(db.pending_jobs.every(r => r.type === 'Internship' || r.title === 'Data Intern')).toBe(true);
    expect(db.automation_logs).toHaveLength(1);
    expect(telegramCalls[0]).toContain('2 new opportunities');
  });

  it('does not re-queue listings that were approved, rejected or are already live (#2)', async () => {
    db.pending_jobs = [
      { title: 'Frontend Intern', company: 'Acme',    status: 'approved', fetched_at: new Date().toISOString() },
      { title: 'Backend Intern',  company: 'Globex',  status: 'rejected', fetched_at: new Date().toISOString() },
    ];
    db.jobs = [{ title: 'Data Intern', company: 'Initech', status: 'live' }];

    const { body } = await run();
    expect(body.added_to_pending).toBe(0);
    expect(body.skipped_duplicates).toBe(3);
    expect(telegramCalls).toHaveLength(0);
  });

  it('purges reviewed rows older than the retention window, keeping pending ones', async () => {
    const old = new Date(Date.now() - 200 * 86_400_000).toISOString();
    const recent = new Date().toISOString();
    db.pending_jobs = [
      { title: 'Old approved', company: 'A', status: 'approved', fetched_at: old },
      { title: 'Old rejected', company: 'B', status: 'rejected', fetched_at: old },
      { title: 'Old pending',  company: 'C', status: 'pending',  fetched_at: old },
      { title: 'New rejected', company: 'D', status: 'rejected', fetched_at: recent },
    ];
    await run();
    const titles = db.pending_jobs.map(r => r.title);
    expect(titles).not.toContain('Old approved');
    expect(titles).not.toContain('Old rejected');
    expect(titles).toEqual(expect.arrayContaining(['Old pending', 'New rejected']));
  });

  it('applies admin filters (location) on a manual run', async () => {
    const { body } = await run('?location=pune&source=unstop', { 'x-admin-key': 'admin-secret' });
    expect(body.trigger).toBe('manual');
    expect(body.added_to_pending).toBe(1);
    expect(db.pending_jobs.map(r => r.title)).toEqual(['Backend Intern']);
  });

  it('skips scheduled runs while auto-fetch is paused, but manual runs still work', async () => {
    db.app_settings = [{ key: 'auto_fetch', value: { enabled: false } }];

    const cron = await run();
    expect(cron.body.skipped).toBe(true);
    expect(db.pending_jobs ?? []).toHaveLength(0);
    expect(db.automation_logs[0].status).toBe('skipped');

    const manual = await run('', { 'x-admin-key': 'admin-secret' });
    expect(manual.body.added_to_pending).toBe(3);   // 4 listings, 1 in-batch duplicate
  });

  it('runs when the setting is missing (migration not applied yet)', async () => {
    const { body } = await run();
    expect(body.skipped).toBeUndefined();
    expect(body.added_to_pending).toBe(3);
  });

  it('skips unselected sources entirely', async () => {
    const { body } = await run('?source=adzuna', { 'x-admin-key': 'admin-secret' });
    expect(body.sources.unstop).toBe(0);
    expect(body.added_to_pending ?? 0).toBe(0);
    expect(telegramCalls).toHaveLength(0);
  });
});
