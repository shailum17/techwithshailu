'use client';

import { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import CursorGlow from './CursorGlow';
import BackToTop from './BackToTop';
import NavigationProgress from './NavigationProgress';
import PageTransition from './PageTransition';

export default function RootShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Suspense required because NavigationProgress reads useSearchParams */}
      <Suspense fallback={null}>
        <NavigationProgress />
      </Suspense>
      <CursorGlow />
      <Navbar />
      <main>
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
