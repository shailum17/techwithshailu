import type { Metadata } from 'next';
import { Suspense } from 'react';
import JobsClient from './JobsClient';

export const metadata: Metadata = {
  title: 'Tech Jobs & Internships for CS Freshers 2026',
  description: 'Browse 128+ curated software engineering jobs and internships for CS students and freshers in India. Filter by location, type, batch year and more.',
};

export default function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; location?: string; batch_year?: string; sort?: string }>;
}) {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
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

  // Fetch from API
  const qs = new URLSearchParams();
  if (params.q)          qs.set('q', params.q);
  if (params.type)       qs.set('type', params.type);
  if (params.location)   qs.set('location', params.location);
  if (params.batch_year) qs.set('batch_year', params.batch_year);
  if (params.sort)       qs.set('sort', params.sort);

  let jobs = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/jobs?${qs.toString()}`, { next: { revalidate: 600 } });
    if (res.ok) jobs = await res.json();
  } catch { /* use placeholder */ }

  return <JobsClient initialJobs={jobs} initialParams={params} />;
}
