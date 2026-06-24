'use client';

import { useRef } from 'react';
import { motion, useMotionValue } from 'framer-motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
}

/**
 * Button that subtly moves toward the cursor on hover.
 * Renders as <a> if href is provided, otherwise <button>.
 */
export default function MagneticButton({
  children,
  className = '',
  href,
  target,
  rel,
  onClick,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.3);
    y.set((e.clientY - cy) * 0.3);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  const props = {
    ref,
    style: { x, y },
    onMouseMove: handleMove,
    onMouseLeave: handleLeave,
    transition: { type: 'spring' as const, stiffness: 200, damping: 15 },
    className,
    onClick,
  };

  if (href) {
    return (
      <motion.a {...props} href={href} target={target} rel={rel}>
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button {...props}>
      {children}
    </motion.button>
  );
}
