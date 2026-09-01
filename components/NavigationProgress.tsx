'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Slim top-of-page progress bar (YouTube / GitHub style).
 * Shows immediately when the route starts changing, disappears once the new
 * page has rendered.
 */
export default function NavigationProgress() {
  const pathname      = usePathname();
  const searchParams  = useSearchParams();

  const [loading, setLoading]   = useState(false);
  const [progress, setProgress] = useState(0);

  // Track the current route so we can detect a change
  const currentRoute = useRef(`${pathname}?${searchParams}`);

  // Tick the bar forward while loading
  const tickRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function startProgress() {
    setLoading(true);
    setProgress(10);

    // Stagger incremental bumps: fast at first, slow as it approaches 90%
    const steps = [20, 40, 60, 75, 85, 92];
    steps.forEach((target, i) => {
      tickRef.current = setTimeout(() => setProgress(target), (i + 1) * 220);
    });
  }

  function finishProgress() {
    // Clear any pending ticks
    if (tickRef.current) clearTimeout(tickRef.current);
    setProgress(100);
    // Hide bar after the fill animation completes
    setTimeout(() => {
      setLoading(false);
      setProgress(0);
    }, 400);
  }

  // Detect navigation start by intercepting link clicks
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (!href) return;

      // Only intercept same-origin, non-hash, non-external links
      const isExternal = href.startsWith('http') || href.startsWith('//');
      const isHash     = href.startsWith('#');
      const isSameRoute = href === pathname || href === currentRoute.current;

      if (!isExternal && !isHash && !isSameRoute) {
        startProgress();
      }
    }

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [pathname]);

  // Detect navigation completion (pathname changed → new page rendered)
  useEffect(() => {
    const newRoute = `${pathname}?${searchParams}`;
    if (newRoute !== currentRoute.current) {
      currentRoute.current = newRoute;
      finishProgress();
    }
  }, [pathname, searchParams]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="nav-progress"
          className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* Track */}
          <div className="w-full h-[3px]" style={{ background: 'rgba(168,230,61,0.12)' }} />

          {/* Fill */}
          <motion.div
            className="absolute top-0 left-0 h-[3px] rounded-r-full"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #A8E63D 0%, #c5f565 100%)',
              boxShadow: '0 0 10px rgba(168,230,61,0.7), 0 0 4px rgba(168,230,61,0.4)',
            }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />

          {/* Glowing tip */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
            style={{
              left: `${progress}%`,
              transform: 'translateX(-50%) translateY(-50%)',
              background: '#A8E63D',
              boxShadow: '0 0 8px 2px rgba(168,230,61,0.8)',
            }}
            animate={{ left: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
