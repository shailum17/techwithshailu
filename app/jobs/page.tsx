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
    <Suspense fallback={<div className="min-h-screen" style={{ background: '#0A0A0A' }} />}>
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

  const DUMMY_JOBS = [
    {
      _id: 'dummy-j1',
      title: 'Software Engineering Intern',
      company: 'Google',
      location: 'Remote',
      type: 'Internship' as const,
      salary: '₹50K–₹80K/mo',
      batch_year: 2026,
      tags: ['Python', 'ML', 'GCP'],
      logo_domain: 'google.com',
      is_featured: true,
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'dummy-j2',
      title: 'Frontend Developer',
      company: 'Microsoft',
      location: 'Hyderabad',
      type: 'Full-time' as const,
      salary: '₹12–18 LPA',
      batch_year: 2025,
      tags: ['React', 'TypeScript', 'Azure'],
      logo_domain: 'microsoft.com',
      is_featured: false,
      createdAt: new Date(Date.now() - 2 * 86_400_000).toISOString(),
    },
    {
      _id: 'dummy-j3',
      title: 'Backend Engineer',
      company: 'Razorpay',
      location: 'Remote',
      type: 'Full-time' as const,
      salary: '₹15–22 LPA',
      batch_year: 2025,
      tags: ['Node.js', 'GraphQL', 'AWS'],
      logo_domain: 'razorpay.com',
      is_featured: false,
      createdAt: new Date(Date.now() - 3 * 86_400_000).toISOString(),
    },
    {
      _id: 'dummy-j4',
      title: 'SDE Intern',
      company: 'Amazon',
      location: 'Bengaluru',
      type: 'Internship' as const,
      salary: '₹60K–₹90K/mo',
      batch_year: 2026,
      tags: ['Java', 'AWS', 'System Design'],
      logo_domain: 'amazon.com',
      is_featured: false,
      createdAt: new Date(Date.now() - 1 * 86_400_000).toISOString(),
    },
    {
      _id: 'dummy-j5',
      title: 'Data Science Intern',
      company: 'Flipkart',
      location: 'Bengaluru',
      type: 'Internship' as const,
      salary: '₹40K–₹60K/mo',
      batch_year: 2026,
      tags: ['Python', 'Pandas', 'SQL', 'ML'],
      logo_domain: 'flipkart.com',
      is_featured: false,
      createdAt: new Date(Date.now() - 5 * 86_400_000).toISOString(),
    },
    {
      _id: 'dummy-j6',
      title: 'DevOps Engineer',
      company: 'Infosys',
      location: 'Pune',
      type: 'Job' as const,
      salary: '₹6–9 LPA',
      batch_year: 2025,
      tags: ['Docker', 'Kubernetes', 'CI/CD'],
      logo_domain: 'infosys.com',
      is_featured: false,
      createdAt: new Date(Date.now() - 4 * 86_400_000).toISOString(),
    },
  ];

  let jobs = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/jobs?${qs.toString()}`, { next: { revalidate: 600 } });
    if (res.ok) {
      const apiJobs = await res.json();
      jobs = apiJobs.length > 0 ? apiJobs : DUMMY_JOBS;
    } else {
      jobs = DUMMY_JOBS;
    }
  } catch { jobs = DUMMY_JOBS; }

  return <JobsClient initialJobs={jobs} initialParams={params} />;
}
