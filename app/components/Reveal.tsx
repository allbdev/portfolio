'use client';

import { motion } from 'framer-motion';
import { EASE } from './motion/variants';

type RevealProps = {
  children: React.ReactNode;
  delay?: number;
  /** Fills the parent when the reveal wraps a grid/flex child. */
  fullHeight?: boolean;
};

/**
 * Scroll-triggered fade + rise. Plays once; framer-motion's MotionConfig in
 * AppContent turns it into a plain fade when the user prefers reduced motion.
 */
export default function Reveal({ children, delay = 0, fullHeight = false }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.8, ease: EASE, delay }}
      style={fullHeight ? { height: '100%' } : undefined}
    >
      {children}
    </motion.div>
  );
}
