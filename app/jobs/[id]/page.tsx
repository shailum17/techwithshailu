import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import CopyLinkButton from '@/components/CopyLinkButton';

interface JobDetail {
  _id: string; title: string; company: string; location: string; type: string;
  salary?: string; batch_year?: number; deadline?: string; description: string;
  apply_link: string; tags?: string[]; createdAt?: string;
}

const placeholderJobs: JobDetail[] = [
  {
    _id: 'j1', title: 'Software Engineering Intern', company: 'Google',
    location: 'Remote', type: 'Internship', salary: '₹50K–₹80K/mo',
    batch_year: 2026, apply_link: 'https://careers.google.com',
    tags: ['Python','ML','GCP'],
    description: `
      <h2>About the Company</h2>
      <p>Google LLC is a global technology company specialising in search, online advertising, cloud computing, AI, and consumer electronics.</p>
      <h2>Responsibilities</h2>
      <ul>
        <li>Work on live projects that impact millions of users globally.</li>
        <li>Write clean, maintainable, and well-tested code.</li>
        <li>Participate in code reviews and technical design discussions.</li>
        <li>Collaborate with senior engineers and product managers.</li>
      </ul>
      <h2>Requirements</h2>
      <ul>
        <li>Pursuing B.Tech / B.E. in Computer Science or a related field.</li>
        <li>Strong fundamentals in Data Structures and Algorithms.</li>
        <li>Proficiency in Python, Java, C++, or Go.</li>
        <li>Familiarity with version control (Git).</li>
      </ul>
    `,
  },
  {
    _id: 'j5', title: 'Backend Developer Intern', company: 'Razorpay',
    location: 'Remote', type: 'Internship', salary: '₹60K–₹90K/mo',
    batch_year: 2026, apply_link: 'https://razorpay.com/jobs',
    tags: ['Node.js','GraphQL','AWS'],
    description: `
      <h2>About the Company</h2>
      <p>Razorpay is India's leading payment solutions company, powering transactions for 8 million businesses.</p>
      <h2>Responsibilities</h2>
      <ul>
        <li>Build and maintain high-performance backend APIs serving millions of transactions.</li>
        <li>Design scalable microservices with Node.js and GraphQL.</li>
        <li>Work on AWS infrastructure — Lambda, SQS, RDS.</li>
        <li>Write unit and integration tests for critical payment flows.</li>
      </ul>
      <h2>Requirements</h2>
      <ul>
        <li>B.Tech / B.E. / MCA — 2025 or 2026 batch.</li>
        <li>Strong understanding of REST APIs and GraphQL.</li>
        <li>Familiarity with Node.js, Express, or similar frameworks.</li>
        <li>Basic knowledge of AWS services is a plus.</li>
      </ul>
    `,
  },
];

async function getJob(id: string): Promise<JobDetail | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/jobs/${id}`, { next: { revalidate: 1800 } });
    if (res.ok) return res.json();
  } catch { /* fall through */ }
  return placeholderJobs.find(j => j._id === id) || placeholderJobs[0];
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const job = await getJob(id);
  if (!job) return { title: 'Job Not Found' };
  return {
    title: `${job.title} at ${job.company} | ${job.location}`,
    description: `Apply for ${job.title} at ${job.company}. ${job.location} — ${job.type}${job.salary ? ` — ${job.salary}` : ''}.`,
  };
}

const perks = [
  { label: 'Flexible Work Hours' },
  { label: 'Learning & Mentorship' },
  { label: 'Certificate of Internship' },
  { label: 'Pre-Placement Opportunity' },
];

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id }  = await params;
  const job     = await getJob(id);
  if (!job) notFound();

  const deadline      = job.deadline ? new Date(job.deadline) : null;
  const postedDaysAgo = job.createdAt
    ? Math.floor((Date.now() - new Date(job.createdAt).getTime()) / 86_400_000)
    : 2;

  return (
    <div className="pt-20 min-h-screen pb-20" style={{ background: '#0A0A0A' }}>

      {/* Company banner */}
      <div className="w-full h-48 md:h-60 relative overflow-hidden"
           style={{ background: 'linear-gradient(135deg, #111111 0%, #1A1A1A 100%)', borderBottom: '1px solid #2A2A2A' }}>
        {/* Decorative lines */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/3 left-1/4 w-80 h-px bg-lime rotate-6" />
          <div className="absolute top-1/2 right-1/3 w-60 h-px bg-purple-brand -rotate-3" />
        </div>
        {/* Subtle glow */}
        <div className="absolute inset-0 pointer-events-none"
             style={{ background: 'radial-gradient(ellipse 60% 80% at 30% 50%, rgba(168,230,61,0.05), transparent)' }} />

        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 pb-5 flex items-end gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center
                          text-lime font-bold text-lg font-poppins flex-shrink-0"
               style={{ background: 'rgba(168,230,61,0.1)', border: '1px solid rgba(168,230,61,0.25)' }}>
            {job.company.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-ink font-poppins font-semibold text-base">{job.company}</p>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium text-amber-400 border border-amber-400/30"
                    style={{ background: 'rgba(251,191,36,0.1)' }}>
                4.6 ★
              </span>
            </div>
            <h1 className="font-poppins font-bold text-xl md:text-3xl text-ink">{job.title}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">

        {/* Breadcrumb */}
        <nav className="text-sm text-ink-muted mb-5 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-lime transition-colors">Home</Link>
          <span className="text-ink-faint">/</span>
          <Link href="/jobs" className="hover:text-lime transition-colors">Jobs</Link>
          <span className="text-ink-faint">/</span>
          <span className="text-ink truncate">{job.title}</span>
        </nav>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <span className="flex items-center gap-1 text-ink-muted text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
            </svg>
            {job.location}
          </span>
          <span className="tag-lime">{job.type}</span>
          {job.location.toLowerCase().includes('remote') && <span className="tag-lime">Remote</span>}
          <span className="text-xs px-2.5 py-1 rounded-full text-purple-brand border border-purple-brand/30"
                style={{ background: 'rgba(155,127,232,0.1)' }}>
            Posted {postedDaysAgo} day{postedDaysAgo !== 1 ? 's' : ''} ago
          </span>
          {deadline && (
            <span className="text-ink-muted text-xs flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Deadline: {deadline.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left panel */}
          <div className="flex-1 min-w-0">
            <div className="rounded-2xl p-6 md:p-8"
                 style={{ background: '#111111', border: '1px solid #2A2A2A' }}>
              <div
                className="prose prose-sm max-w-none prose-invert
                           prose-headings:font-poppins prose-headings:text-ink prose-headings:mt-6
                           prose-headings:pb-2 prose-headings:mb-4
                           prose-p:text-ink-muted prose-li:text-ink-muted prose-strong:text-ink
                           prose-a:text-lime prose-a:no-underline hover:prose-a:underline"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />

              {/* Tags */}
              {job.tags && job.tags.length > 0 && (
                <div className="mt-8 pt-6" style={{ borderTop: '1px solid #2A2A2A' }}>
                  <p className="text-sm font-semibold text-ink mb-3 font-poppins">Skills Required</p>
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map(tag => <span key={tag} className="tag-lime">{tag}</span>)}
                  </div>
                </div>
              )}

              {/* Share */}
              <div className="mt-6 pt-6" style={{ borderTop: '1px solid #2A2A2A' }}>
                <p className="text-sm font-medium text-ink-muted mb-3">Share this job</p>
                <div className="flex gap-2 flex-wrap">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`${job.title} at ${job.company} — ${process.env.NEXT_PUBLIC_APP_URL || 'https://techwithshailu.in'}/jobs/${job._id}`)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-green-400 hover:bg-green-400/10
                               px-3 py-2 rounded-lg transition-colors"
                    style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.25)' }}>
                    WhatsApp
                  </a>
                  <CopyLinkButton />
                </div>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="space-y-4 sticky top-24">

              {/* Apply CTA */}
              <a href={job.apply_link} target="_blank" rel="noopener noreferrer"
                 className="flex items-center justify-center gap-2 w-full btn-lime text-base py-4">
                Apply Now
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <button className="flex items-center justify-center gap-2 w-full btn-purple-outline py-3 text-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                Save Job
              </button>

              {/* Job Overview */}
              <div className="rounded-2xl p-5 space-y-3"
                   style={{ background: '#111111', border: '1px solid #2A2A2A' }}>
                <p className="font-poppins font-semibold text-ink text-sm">Job Overview</p>
                <div style={{ borderTop: '1px solid #2A2A2A' }} />
                {[
                  { label: 'Role',       value: job.title },
                  { label: 'Company',    value: job.company },
                  { label: 'Type',       value: job.type },
                  { label: 'Location',   value: job.location },
                  ...(job.batch_year ? [{ label: 'Batch',   value: `${job.batch_year} & beyond`, highlight: false }] : []),
                  { label: 'Duration',   value: '3–6 Months' },
                  ...(job.salary ? [{ label: 'Stipend', value: job.salary, highlight: true }] : []),
                  { label: 'Start Date', value: 'Immediate / Flexible' },
                ].map(({ label, value, highlight }) => (
                  <div key={label} className="flex items-start justify-between gap-2 text-sm">
                    <span className="text-ink-muted flex-shrink-0">{label}</span>
                    {highlight ? (
                      <span className="text-xs font-semibold text-purple-brand px-2 py-0.5 rounded-lg"
                            style={{ background: 'rgba(155,127,232,0.12)', border: '1px solid rgba(155,127,232,0.25)' }}>
                        {value}
                      </span>
                    ) : (
                      <span className="text-right font-medium text-ink">{value}</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Perks */}
              <div className="rounded-2xl p-5"
                   style={{ background: '#111111', border: '1px solid #2A2A2A' }}>
                <p className="font-poppins font-semibold text-ink text-sm mb-4">Perks & Benefits</p>
                <div className="grid grid-cols-2 gap-3">
                  {perks.map(({ label }) => (
                    <div key={label}
                      className="flex items-center gap-2 p-3 rounded-xl"
                      style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}>
                      <span className="w-2 h-2 rounded-full bg-lime flex-shrink-0" />
                      <span className="text-xs text-ink-muted leading-snug">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* How to apply */}
              <div className="rounded-2xl p-5"
                   style={{ background: '#111111', border: '1px solid #2A2A2A' }}>
                <p className="font-poppins font-semibold text-ink text-sm mb-2">How to Apply</p>
                <p className="text-ink-muted text-xs leading-relaxed">
                  Click &ldquo;Apply Now&rdquo; to visit the official company careers page. Ensure
                  your resume is updated and tailored to this role before applying.
                </p>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
