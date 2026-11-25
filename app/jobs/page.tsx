import type { Metadata } from 'next';
import { Suspense } from 'react';
import JobsClient, { type Job } from './JobsClient';
import { listLiveJobs } from '@/lib/data/public';

export const metadata: Metadata = {
  title: 'Tech Jobs & Internships for CS Freshers 2026',
  description: 'Browse curated software engineering jobs and internships for CS students and freshers in India. Filter by location, type, batch year and more.',
};

export default function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; location?: string; batch_year?: string; sort?: string }>;
}) {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: '#080808' }} />}>
      <JobsContent searchParams={searchParams} />
    </Suspense>
  );
}

async function JobsContent({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; location?: string; batch_year?: string; sort?: string }>;
}) {
  const params = await searchParams;

  // Query Supabase directly (lib/data/public.ts). Calling our own /api/jobs from
  // the server made every visitor share one rate-limit bucket (issue #3).
  let jobs: Job[] = [];
  try {
    const rows = await listLiveJobs({
      q:         params.q || undefined,
      type:      params.type || undefined,
      location:  params.location || undefined,
      batchYear: params.batch_year ? Number(params.batch_year) : undefined,
      sort:      params.sort === 'deadline' ? 'deadline' : 'newest',
    });
    // Rows come from the jobs table (schema matches JobsClient's Job shape)
    jobs = rows.map(j => ({
      ...j,
      createdAt: j.created_at ?? j.createdAt ?? new Date().toISOString(),
    })) as unknown as Job[];
  } catch (err) {
    console.error('[jobs page]', err instanceof Error ? err.message : err);
    jobs = [];
  }

  return <JobsClient initialJobs={jobs} initialParams={params} />;
}
