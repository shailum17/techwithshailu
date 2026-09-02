import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import CopyLinkButton from '@/components/CopyLinkButton';
import { formatJobDescription } from '@/lib/formatJobDescription';

interface JobDetail {
  id: string; title: string; company: string; location: string; type: string;
  salary?: string; batch_year?: number; deadline?: string; description: string;
  apply_link: string; tags?: string[]; created_at?: string; createdAt?: string;
  logo_domain?: string; logo_url?: string; banner_url?: string;
}

/* ── Company logo: logo_url → Clearbit → fallback initials ─── */
function CompanyLogo({
  logoUrl,
  domain,
  company,
  size = 56,
  className = '',
}: {
  logoUrl?: string;
  domain?: string;
  company: string;
  size?: number;
  className?: string;
}) {
  const initials = company.slice(0, 2).toUpperCase();
  const imgSrc = logoUrl || (domain ? `https://logo.clearbit.com/${domain}` : null);

  if (imgSrc) {
    return (
      <div
        className={`flex-shrink-0 rounded-2xl overflow-hidden flex items-center justify-center ${className}`}
        style={{
          width: size, height: size,
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(168,230,61,0.25)',
        }}
      >
        <Image
          src={imgSrc}
          alt={`${company} logo`}
          width={size}
          height={size}
          className="object-contain w-full h-full"
          unoptimized
        />
      </div>
    );
  }

  return (
    <div
      className={`flex-shrink-0 rounded-2xl flex items-center justify-center text-lime font-bold font-poppins ${className}`}
      style={{
        width: size, height: size,
        fontSize: size * 0.32,
        background: 'rgba(168,230,61,0.1)',
        border: '1px solid rgba(168,230,61,0.25)',
      }}
    >
      {initials}
    </div>
  );
}

async function getJob(id: string): Promise<JobDetail | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/jobs/${id}`, {
      cache: 'no-store',
    });
    if (res.ok) return res.json();
  } catch { /* fall through */ }
  return null;
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

const perks: { label: string }[] = [];

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id }  = await params;
  const job     = await getJob(id);
  if (!job) notFound();

  const deadline      = job.deadline ? new Date(job.deadline) : null;
  const rawDate       = job.created_at ?? job.createdAt;
  const postedDaysAgo = rawDate
    ? Math.floor((Date.now() - new Date(rawDate).getTime()) / 86_400_000)
    : null;

  return (
    <div className="pt-20 min-h-screen pb-20" style={{ background: '#080808' }}>

      {/* Company banner */}
      <div className="w-full h-48 md:h-60 relative overflow-hidden"
           style={{ 
             background: job.banner_url 
               ? `url(${job.banner_url}) center/cover no-repeat` 
               : 'linear-gradient(135deg, #111111 0%, #1A1A1A 100%)', 
             borderBottom: '1px solid rgba(255,255,255,0.08)' 
           }}>
        {/* Dark overlay when banner exists */}
        {job.banner_url && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        )}
        {/* Decorative lines — only when no banner */}
        {!job.banner_url && (
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/3 left-1/4 w-80 h-px bg-lime rotate-6" />
            <div className="absolute top-1/2 right-1/3 w-60 h-px bg-purple-brand -rotate-3" />
          </div>
        )}
        {/* Subtle glow */}
        <div className="absolute inset-0 pointer-events-none"
             style={{ background: 'radial-gradient(ellipse 60% 80% at 30% 50%, rgba(168,230,61,0.05), transparent)' }} />

        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 pb-5 flex items-end gap-4 z-10">
          <CompanyLogo logoUrl={job.logo_url} domain={job.logo_domain} company={job.company} size={56} />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-ink font-poppins font-semibold text-base">{job.company}</p>
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
            {postedDaysAgo === null
              ? 'Recently posted'
              : postedDaysAgo === 0
              ? 'Posted today'
              : `Posted ${postedDaysAgo} day${postedDaysAgo !== 1 ? 's' : ''} ago`}
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
                 style={{ background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div
                className="prose prose-sm max-w-none prose-invert
                           prose-headings:font-poppins prose-headings:text-white
                           prose-headings:text-base prose-headings:font-semibold
                           prose-headings:mt-8 prose-headings:mb-3
                           prose-headings:pb-2 prose-headings:border-b
                           prose-headings:border-white/10
                           prose-p:text-white/60 prose-p:leading-relaxed prose-p:my-2
                           prose-li:text-white/60 prose-li:my-1 prose-li:leading-relaxed
                           prose-ul:my-3 prose-ul:pl-4
                           prose-ul:list-disc prose-ul:marker:text-lime
                           prose-strong:text-white
                           prose-a:text-lime prose-a:no-underline hover:prose-a:underline"
                dangerouslySetInnerHTML={{ __html: formatJobDescription(job.description) }}
              />

              {/* Tags */}
              {job.tags && job.tags.length > 0 && (
                <div className="mt-8 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <p className="text-sm font-semibold text-ink mb-3 font-poppins">Skills Required</p>
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map(tag => <span key={tag} className="tag-lime">{tag}</span>)}
                  </div>
                </div>
              )}

              {/* Share */}
              <div className="mt-6 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="text-sm font-medium text-ink-muted mb-3">Share this job</p>
                <div className="flex gap-2 flex-wrap">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`${job.title} at ${job.company} — ${process.env.NEXT_PUBLIC_APP_URL || 'https://techwithshailu.in'}/jobs/${job.id}`)}`}
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
                   style={{ background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="font-poppins font-semibold text-ink text-sm">Job Overview</p>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }} />
                {[
                  { label: 'Role',       value: job.title },
                  { label: 'Company',    value: job.company },
                  { label: 'Type',       value: job.type },
                  { label: 'Location',   value: job.location },
                  ...(job.batch_year ? [{ label: 'Batch',    value: `${job.batch_year} & beyond`, highlight: false }] : []),
                  ...(job.salary    ? [{ label: 'Stipend',   value: job.salary, highlight: true }] : []),
                  ...(job.deadline  ? [{ label: 'Deadline',  value: new Date(job.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }), highlight: false }] : []),
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
                   style={{ background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="font-poppins font-semibold text-ink text-sm mb-4">Perks & Benefits</p>
                <div className="grid grid-cols-2 gap-3">
                  {perks.map(({ label }) => (
                    <div key={label}
                      className="flex items-center gap-2 p-3 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <span className="w-2 h-2 rounded-full bg-lime flex-shrink-0" />
                      <span className="text-xs text-ink-muted leading-snug">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* How to apply */}
              <div className="rounded-2xl p-5"
                   style={{ background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.08)' }}>
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
