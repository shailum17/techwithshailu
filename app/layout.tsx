import type { Metadata } from 'next';
import { Poppins, Outfit } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CursorGlow from '@/components/CursorGlow';
import BackToTop from '@/components/BackToTop';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});
const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-outfit',
  display: 'swap',
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://techwithshailu.in'),
  openGraph: {
    type: 'website', locale: 'en_IN',
    url: 'https://techwithshailu.in',
    siteName: 'techwithshailu',
    title: 'techwithshailu — Jobs, AI Tools & CS Resources',
    description: 'Curated tech jobs, AI tools, and study roadmaps for CS students in India.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${outfit.variable}`}>
      <body className="bg-surface-secondary text-ink font-outfit antialiased">
        <CursorGlow />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
