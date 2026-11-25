import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import RootShell from '@/components/RootShell';
import { SpeedInsights } from '@vercel/speed-insights/next';
import VisitorPing from '@/components/VisitorPing';
import { SITE_URL } from '@/lib/site';

// Fonts are self-hosted (app/fonts/, SIL Open Font License) instead of
// next/font/google, so `next build` never downloads from Google Fonts. Builds on
// CI runners failed when Google returned font URLs the loader can't parse.
const poppins = localFont({
  src: [
    { path: './fonts/poppins-400-latin.woff2', weight: '400', style: 'normal' },
    { path: './fonts/poppins-500-latin.woff2', weight: '500', style: 'normal' },
    { path: './fonts/poppins-600-latin.woff2', weight: '600', style: 'normal' },
    { path: './fonts/poppins-700-latin.woff2', weight: '700', style: 'normal' },
    { path: './fonts/poppins-800-latin.woff2', weight: '800', style: 'normal' },
  ],
  variable: '--font-poppins',
  display: 'swap',
  fallback: ['system-ui', 'Arial', 'sans-serif'],
});
const outfit = localFont({
  // Outfit is a variable font: one file covers every weight we use (300–600)
  src: [{ path: './fonts/outfit-variable-latin.woff2', weight: '300 600', style: 'normal' }],
  variable: '--font-outfit',
  display: 'swap',
  fallback: ['system-ui', 'Arial', 'sans-serif'],
});

export const metadata: Metadata = {
  title: {
    default: 'techwithshailu — Jobs, AI Tools & CS Resources for Students',
    template: '%s | techwithshailu',
  },
  description:
    'One-stop destination for CS students and freshers in India. Curated tech job listings, AI tools directory, study roadmaps and blog.',
  keywords: ['tech jobs India freshers', 'CS internships 2026', 'AI tools students', 'DSA roadmap', 'techwithshailu'],
  authors: [{ name: 'techwithshailu' }],
  creator: 'techwithshailu',
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: 'website', locale: 'en_IN',
    url: SITE_URL,
    siteName: 'techwithshailu',
    title: 'techwithshailu — Jobs, AI Tools & CS Resources',
    description: 'Curated tech jobs, AI tools, and study roadmaps for CS students in India.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body className="bg-[#080808] text-ink font-outfit antialiased min-h-screen">
        <RootShell>{children}</RootShell>
        <VisitorPing />
        <SpeedInsights />
      </body>
    </html>
  );
}
