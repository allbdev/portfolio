'use client';

import { useEffect } from 'react';
import Box from '@mui/material/Box';
import { alpha, useTheme } from '@mui/material/styles';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const MotionBox = motion(Box);

export default function CursorGlow() {
  const theme = useTheme();
  const cursorX = useMotionValue(-600);
  const cursorY = useMotionValue(-600);

  const springX = useSpring(cursorX, { stiffness: 80, damping: 22, restDelta: 0.5 });
  const springY = useSpring(cursorY, { stiffness: 80, damping: 22, restDelta: 0.5 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      cursorX.set(e.clientX - 300);
      cursorY.set(e.clientY - 300);
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, [cursorX, cursorY]);

  const intensity = theme.palette.mode === 'dark' ? 0.09 : 0.06;

  return (
    <MotionBox
      aria-hidden
      style={{ x: springX, y: springY }}
      sx={{
        position: 'fixed',
        zIndex: 0,
        pointerEvents: 'none',
        width: 600,
        height: 600,
        borderRadius: '50%',
        background: `radial-gradient(circle at center, ${alpha(theme.palette.primary.main, intensity)}, transparent 65%)`,
        display: { xs: 'none', md: 'block' },
      }}
    />
  );
}
