'use client';

import { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import { useFineMotion } from '../hooks/useFineMotion';

/**
 * Accent dot that tracks the pointer exactly, plus a ring that eases behind it
 * and swells over links and buttons. Only mounts for precise pointers when the
 * user has not requested reduced motion.
 */
export default function CustomCursor() {
  const active = useFineMotion();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;

    const root = document.documentElement;
    root.classList.add('has-custom-cursor');

    let x = -100;
    let y = -100;
    let ringX = -100;
    let ringY = -100;
    let hovering = false;
    let frame = 0;

    const onMove = (event: MouseEvent) => {
      x = event.clientX;
      y = event.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${x - 4}px, ${y - 4}px)`;
      }
    };

    const onOver = (event: MouseEvent) => {
      const target = event.target as Element | null;
      hovering = Boolean(target?.closest?.('a, button, [role="button"]'));
    };

    const tick = () => {
      ringX += (x - ringX) * 0.14;
      ringY += (y - ringY) * 0.14;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px) scale(${
          hovering ? 1.7 : 1
        })`;
      }
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    frame = requestAnimationFrame(tick);

    return () => {
      root.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      cancelAnimationFrame(frame);
    };
  }, [active]);

  if (!active) return null;

  return (
    <Box aria-hidden sx={{ '& > *': { pointerEvents: 'none' } }}>
      <Box
        ref={dotRef}
        sx={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: 8,
          height: 8,
          borderRadius: '50%',
          bgcolor: 'accent.main',
          zIndex: 9998,
          transform: 'translate(-100px, -100px)',
        }}
      />
      <Box
        ref={ringRef}
        sx={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: 36,
          height: 36,
          borderRadius: '50%',
          border: (theme) => `1px solid ${alpha(theme.palette.accent.main, 0.6)}`,
          zIndex: 9998,
          transform: 'translate(-100px, -100px)',
        }}
      />
    </Box>
  );
}
