'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface SectionRevealProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Wraps a page section with:
 * - FadeUp entrance when scrolled into view
 * - Subtle parallax Y shift while scrolling through
 * - Faint left accent line that grows as section enters
 */
export default function SectionReveal({ children, className = '' }: SectionRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'end 0.1'],
  });

  const rawY = useTransform(scrollYProgress, [0, 1], [12, -12]);
  const y = useSpring(rawY, { stiffness: 120, damping: 40 });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{ y }}
      className={`relative ${className}`}
    >
      {children}
    </motion.section>
  );
}
