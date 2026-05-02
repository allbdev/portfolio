'use client';

import Box from '@mui/material/Box';
import { motion, useScroll, useSpring } from 'framer-motion';

const MotionBox = motion(Box);

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <MotionBox
      style={{ scaleX }}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        zIndex: 9999,
        background: (theme) =>
          `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
        transformOrigin: '0%',
        pointerEvents: 'none',
      }}
    />
  );
}
