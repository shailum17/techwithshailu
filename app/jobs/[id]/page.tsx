import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import CopyLinkButton from '@/components/CopyLinkButton';
import { formatJobDescription } from '@/lib/formatJobDescription';
import { safeHttpUrl } from '@/lib/validate';
import { SITE_URL } from '@/lib/site';

interface JobDetail {
  id: string; title: string; company: string; location: string; type: string;
  salary?: string; batch_year?: number; deadline?: string; description: string;
  apply_link: string; tags?: string[]; created_at?: string; createdAt?: string;
  logo_domain?: string; logo_url?: string; banner_url?: string;
}

/* ── Company logo ─────────────────────────────────────────── */
function CompanyLogo({
  logoUrl, domain, company, size = 56,
}: {
  logoUrl?: string; domain?: string; company: string; size?: number;
}) {
  const initials = company.slice(0, 2).toUpperCase();
  const imgSrc   = logoUrl || (domain ? `https://logo.clearbit.com/${domain}` : null);

  if (imgSrc) {
    return (
      <div
        className="flex-shrink-0 rounded-2xl overflow-hidden flex items-center justify-center"
        style={{ width: size, height: size, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(168,230,61,0.25)' }}
      >
        <Image src={imgSrc} alt={`${company} logo`} width={size} height={size}
               className="object-contain w-full h-full" unoptimized />
      </div>
    );
  }
  return (
    <div
      className="flex-shrink-0 rounded-2xl flex items-center justify-center text-lime font-bold font-poppins"
      style={{ width: size, height: size, fontSize: size * 0.32,
               background: 'rgba(168,230,61,0.1)', border: '1px solid rgba(168,230,61,0.25)' }}
    >
      {initials}
    </div>
  );
}

async function getJob(id: string): Promise<JobDetail | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/jobs/${id}`, { cache: 'no-store' });
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

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id }  = await params;
  const job     = await getJob(id);
  if (!job) notFound();
  // Only render absolute http(s) apply links (third-party data is untrusted)
  const applyHref = safeHttpUrl(job.apply_link) ?? '#';

  const deadline      = job.deadline ? new Date(job.deadline) : null;
  const rawDate       = job.created_at ?? job.createdAt;
  const postedDaysAgo = rawDate
    ? Math.floor((Date.now() - new Date(rawDate).getTime()) / 86_400_000)
    : null;
  const postedLabel   = postedDaysAgo === null
    ? 'Recently posted'
    : postedDaysAgo === 0
    ? 'Posted today'
    : `Posted ${postedDaysAgo}d ago`;

  const isRemote  = job.location.toLowerCase().includes('remote');

  /* quick-info pills for the overview card */
  const overviewItems = [
    { icon: '🏢', label: 'Company',   value: job.company },
    { icon: '📍', label: 'Location',  value: job.location },
    { icon: '💼', label: 'Type',      value: job.type },
    ...(job.salary     ? [{ icon: '💰', label: 'Stipend',  value: job.salary }]                                                   : []),
    ...(job.batch_year ? [{ icon: '🎓', label: 'Batch',    value: `${job.batch_year} & beyond` }]                                 : []),
    ...(deadline       ? [{ icon: '📅', label: 'Deadline', value: deadline.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) }] : []),
    { icon: '🕐', label: 'Posted',    value: postedLabel },
  ];

  return (
    <div className="min-h-screen pb-24" style={{ background: '#080808' }}>

      {/* ── Hero banner ─────────────────────────────────── */}
      <div
        className="w-full relative overflow-hidden"
        style={{
          height: 220,
          background: job.banner_url
            ? `url(${job.banner_url}) center/cover no-repeat`
            : 'linear-gradient(135deg,#0F0F0F 0%,#161616 50%,#0F0F0F 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        {job.banner_url && <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />}
        {/* decorative grid lines when no banner */}
        {!job.banner_url && (
          <div className="absolute inset-0 opacity-20 pointer-events-none"
               style={{ backgroundImage: 'linear-gradient(rgba(168,230,61,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(168,230,61,0.07) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
        )}
        {/* lime radial */}
        <div className="absolute inset-0 pointer-events-none"
             style={{ background: 'radial-gradient(ellipse 55% 100% at 20% 100%,rgba(168,230,61,0.07),transparent)' }} />
      </div>

      {/* ── Page shell ──────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Identity bar — overlaps banner */}
        <div className="relative -mt-12 mb-6 flex items-end gap-4">
          <div className="ring-4 ring-[#080808] rounded-2xl flex-shrink-0">
            <CompanyLogo logoUrl={job.logo_url} domain={job.logo_domain} company={job.company} size={72} />
          </div>
          <div className="pb-1">
            <h1 className="font-poppins font-bold text-xl md:text-2xl text-white leading-tight">
              {job.title}
            </h1>
            <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{job.company}</p>
          </div>
        </div>

        {/* Breadcrumb */}
        <nav className="text-xs mb-5 flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
          <Link href="/" className="hover:text-lime transition-colors">Home</Link>
          <span>/</span>
          <Link href="/jobs" className="hover:text-lime transition-colors">Jobs</Link>
          <span>/</span>
          <span className="truncate" style={{ color: 'rgba(255,255,255,0.55)' }}>{job.title}</span>
        </nav>

        {/* Quick chips */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(168,230,61,0.1)', color: '#A8E63D', border: '1px solid rgba(168,230,61,0.22)' }}>
            {job.type}
          </span>
          {isRemote && (
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full"
                  style={{ background: 'rgba(96,165,250,0.09)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.2)' }}>
              Remote
            </span>
          )}
          {job.salary && (
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full"
                  style={{ background: 'rgba(155,127,232,0.1)', color: '#B49EF0', border: '1px solid rgba(155,127,232,0.22)' }}>
              {job.salary}
            </span>
          )}
          <span className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.38)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
            </svg>
            {job.location}
          </span>
          {deadline && (
            <span className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full"
                  style={{ background: 'rgba(251,146,60,0.08)', color: '#fb923c', border: '1px solid rgba(251,146,60,0.2)' }}>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Deadline: {deadline.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          )}
          <span className="text-xs px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.28)', border: '1px solid rgba(255,255,255,0.07)' }}>
            {postedLabel}
          </span>
        </div>

        {/* ── Two-column layout ─────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Left: description ────────────────────────── */}
          <div className="flex-1 min-w-0 space-y-6">

            {/* Description card */}
            <div className="rounded-2xl p-6 md:p-8"
                 style={{ background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center gap-2 mb-6">
                <span className="w-1 h-5 rounded-full" style={{ background: '#A8E63D' }} />
                <h2 className="font-poppins font-bold text-white text-base">Job Description</h2>
              </div>
              <div
                className="prose prose-sm max-w-none prose-invert
                           prose-headings:font-poppins prose-headings:text-white
                           prose-headings:text-sm prose-headings:font-semibold
                           prose-headings:mt-6 prose-headings:mb-2
                           prose-headings:pb-2 prose-headings:border-b prose-headings:border-white/10
                           prose-p:text-white/55 prose-p:leading-relaxed prose-p:my-2
                           prose-li:text-white/55 prose-li:my-1
                           prose-ul:my-3 prose-ul:pl-4 prose-ul:list-disc prose-ul:marker:text-lime
                           prose-strong:text-white/80
                           prose-a:text-lime prose-a:no-underline hover:prose-a:underline"
                dangerouslySetInnerHTML={{ __html: formatJobDescription(job.description) }}
              />
            </div>

            {/* Skills card */}
            {job.tags && job.tags.length > 0 && (
              <div className="rounded-2xl p-6"
                   style={{ background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-1 h-5 rounded-full" style={{ background: '#A8E63D' }} />
                  <h2 className="font-poppins font-bold text-white text-base">Skills Required</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map(tag => (
                    <span key={tag}
                          className="text-xs font-medium px-3 py-1.5 rounded-full transition-colors"
                          style={{ background: 'rgba(168,230,61,0.07)', color: '#A8E63D', border: '1px solid rgba(168,230,61,0.18)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* How to apply */}
            <div className="rounded-2xl p-6"
                 style={{ background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1 h-5 rounded-full" style={{ background: '#A8E63D' }} />
                <h2 className="font-poppins font-bold text-white text-base">How to Apply</h2>
              </div>
              <ol className="space-y-3">
                {[
                  'Click "Apply Now" below to open the official application page.',
                  'Update your resume and tailor it to match this role\'s requirements.',
                  'Fill in the application form carefully — double-check contact details.',
                  'Keep an eye on your email for an interview or test invite.',
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-poppins"
                          style={{ background: 'rgba(168,230,61,0.1)', color: '#A8E63D', border: '1px solid rgba(168,230,61,0.2)' }}>
                      {i + 1}
                    </span>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{step}</p>
                  </li>
                ))}
              </ol>
            </div>

            {/* Share */}
            <div className="rounded-2xl p-6"
                 style={{ background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1 h-5 rounded-full" style={{ background: '#A8E63D' }} />
                <h2 className="font-poppins font-bold text-white text-base">Share this Job</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <a href={`https://wa.me/?text=${encodeURIComponent(`${job.title} at ${job.company} — ${SITE_URL}/jobs/${job.id}`)}`}
                   target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 hover:brightness-110"
                   style={{ background: 'rgba(37,211,102,0.1)', color: '#25D366', border: '1px solid rgba(37,211,102,0.25)' }}>
                  {/* WhatsApp icon */}
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </a>
                <a href={`https://t.me/share/url?url=${encodeURIComponent(`${SITE_URL}/jobs/${job.id}`)}&text=${encodeURIComponent(`${job.title} at ${job.company}`)}`}
                   target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 hover:brightness-110"
                   style={{ background: 'rgba(40,168,224,0.1)', color: '#29A8E0', border: '1px solid rgba(40,168,224,0.25)' }}>
                  {/* Telegram icon */}
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.17 14.51l-2.95-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.836.076z"/>
                  </svg>
                  Telegram
                </a>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${SITE_URL}/jobs/${job.id}`)}`}
                   target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 hover:brightness-110"
                   style={{ background: 'rgba(10,102,194,0.1)', color: '#0a66c2', border: '1px solid rgba(10,102,194,0.25)' }}>
                  {/* LinkedIn icon */}
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </a>
                <CopyLinkButton />
              </div>
            </div>

          </div>

          {/* ── Right sidebar ─────────────────────────────── */}
          <aside className="w-full lg:w-[300px] flex-shrink-0">
            <div className="sticky top-24 space-y-4">

              {/* Apply CTA card */}
              <div className="rounded-2xl p-5 space-y-3"
                   style={{ background: '#0E0E0E', border: '1px solid rgba(168,230,61,0.18)',
                            boxShadow: '0 0 32px rgba(168,230,61,0.06)' }}>
                {/* Heading */}
                <div>
                  <p className="font-poppins font-bold text-white text-sm">Ready to apply?</p>
                  <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    Tap below to go to the official application page.
                  </p>
                </div>

                {/* Apply Now */}
                <a href={applyHref} target="_blank" rel="noopener noreferrer"
                   className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl
                              font-bold text-sm transition-all duration-200
                              hover:brightness-110 active:scale-95"
                   style={{ background: '#A8E63D', color: '#000' }}>
                  Apply Now
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>

                {/* Deadline warning */}
                {deadline && (
                  <p className="text-xs text-center" style={{ color: 'rgba(251,146,60,0.8)' }}>
                    ⏳ Deadline: {deadline.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                )}
              </div>

              {/* Job Overview card */}
              <div className="rounded-2xl overflow-hidden"
                   style={{ background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-4 rounded-full" style={{ background: '#A8E63D' }} />
                    <p className="font-poppins font-bold text-white text-sm">Job Overview</p>
                  </div>
                </div>
                <div className="divide-y" style={{ '--tw-divide-opacity': 1, borderColor: 'rgba(255,255,255,0.05)' } as React.CSSProperties}>
                  {overviewItems.map(({ icon, label, value }) => (
                    <div key={label} className="flex items-start justify-between gap-3 px-5 py-3.5">
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-sm">{icon}</span>
                        <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</span>
                      </div>
                      <span className="text-xs font-semibold text-right"
                            style={{ color: label === 'Stipend' ? '#B49EF0' : 'rgba(255,255,255,0.75)' }}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips card */}
              <div className="rounded-2xl p-5 space-y-3"
                   style={{ background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-center gap-2">
                  <span className="w-1 h-4 rounded-full" style={{ background: '#A8E63D' }} />
                  <p className="font-poppins font-bold text-white text-sm">Pro Tips</p>
                </div>
                {[
                  { emoji: '📄', tip: 'Tailor your resume to the job description keywords.' },
                  { emoji: '🔗', tip: 'Add the job to LinkedIn and update your profile.' },
                  { emoji: '⚡', tip: 'Apply early — applications reviewed as they come in.' },
                ].map(({ emoji, tip }) => (
                  <div key={tip} className="flex items-start gap-2.5">
                    <span className="text-sm mt-0.5">{emoji}</span>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>{tip}</p>
                  </div>
                ))}
              </div>

              {/* Telegram CTA */}
              <a href="https://t.me/techwithshailu" target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-3 rounded-2xl p-4 transition-all duration-200 hover:brightness-110 group"
                 style={{ background: 'rgba(168,230,61,0.06)', border: '1px solid rgba(168,230,61,0.15)' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                     style={{ background: 'rgba(168,230,61,0.12)', border: '1px solid rgba(168,230,61,0.2)' }}>
                  <svg className="w-5 h-5 text-lime" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.17 14.51l-2.95-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.836.076z"/>
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white leading-tight">Get daily job alerts</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Join Telegram → techwithshailu</p>
                </div>
                <svg className="w-4 h-4 text-lime ml-auto flex-shrink-0 group-hover:translate-x-0.5 transition-transform"
                     fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>

            </div>
          </aside>
        </div>
      </div>

      {/* ── Mobile sticky Apply bar ──────────────────────── */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 px-4 pb-4 pt-3"
           style={{ background: 'linear-gradient(to top,#080808 60%,transparent)', backdropFilter: 'blur(8px)' }}>
        <a href={applyHref} target="_blank" rel="noopener noreferrer"
           className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl
                      font-bold text-sm transition-all duration-200 hover:brightness-110 active:scale-95"
           style={{ background: '#A8E63D', color: '#000', boxShadow: '0 4px 24px rgba(168,230,61,0.4)' }}>
          Apply Now
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>

    </div>
  );
}
