'use client';

import Box from '@mui/material/Box';
import { motion, useScroll, useSpring } from 'framer-motion';

const MotionBox = motion.create(Box);

/** Two-pixel accent rule pinned to the top edge, scaled by page progress. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <MotionBox
      style={{ scaleX }}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        zIndex: 9999,
        bgcolor: 'accent.main',
        transformOrigin: '0% 50%',
        pointerEvents: 'none',
      }}
    />
  );
}
