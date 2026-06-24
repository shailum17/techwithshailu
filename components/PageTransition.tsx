'use client';

import { motion } from 'framer-motion';

/**
 * Wraps page content with a smooth fade+slide entrance/exit.
 * Used in app/layout.tsx around {children}.
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
