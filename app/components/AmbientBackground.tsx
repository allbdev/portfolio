'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import { motion, useReducedMotion } from 'framer-motion';
import { alpha, useTheme } from '@mui/material/styles';

const MotionBox = motion(Box);

export default function AmbientBackground() {
  const theme = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const mode = theme.palette.mode;

  const primaryGlow = alpha(theme.palette.primary.main, mode === 'light' ? 0.22 : 0.35);
  const secondaryGlow = alpha(theme.palette.secondary.main, mode === 'light' ? 0.2 : 0.28);
  const wash = alpha(theme.palette.background.default, mode === 'light' ? 0.2 : 0.15);

  const orbCommon = {
    position: 'absolute' as const,
    borderRadius: '50%',
    filter: mode === 'light' ? 'blur(72px)' : 'blur(88px)',
    pointerEvents: 'none' as const,
  };

  return (
    <Box
      aria-hidden
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        background:
          mode === 'light'
            ? `radial-gradient(1200px 600px at 10% -10%, ${alpha(theme.palette.primary.main, 0.12)}, transparent 55%),
               radial-gradient(900px 500px at 90% 0%, ${alpha(theme.palette.secondary.main, 0.1)}, transparent 50%),
               ${theme.palette.background.default}`
            : `radial-gradient(1000px 520px at 15% -5%, ${alpha(theme.palette.primary.main, 0.18)}, transparent 55%),
               radial-gradient(800px 480px at 85% 5%, ${alpha(theme.palette.secondary.main, 0.14)}, transparent 50%),
               ${theme.palette.background.default}`,
      }}
    >
      {!prefersReducedMotion ? (
        <>
          <MotionBox
            sx={{
              ...orbCommon,
              width: { xs: 280, md: 420 },
              height: { xs: 280, md: 420 },
              left: { xs: '-8%', md: '2%' },
              top: { xs: '8%', md: '12%' },
              background: `radial-gradient(circle at 30% 30%, ${primaryGlow}, transparent 65%)`,
              opacity: 0.85,
            }}
            animate={{
              x: [0, 24, -12, 0],
              y: [0, -18, 10, 0],
              opacity: [0.65, 0.9, 0.7, 0.65],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <MotionBox
            sx={{
              ...orbCommon,
              width: { xs: 320, md: 520 },
              height: { xs: 320, md: 520 },
              right: { xs: '-15%', md: '-5%' },
              top: { xs: '22%', md: '18%' },
              background: `radial-gradient(circle at 70% 40%, ${secondaryGlow}, transparent 62%)`,
              opacity: 0.75,
            }}
            animate={{
              x: [0, -28, 16, 0],
              y: [0, 22, -14, 0],
              opacity: [0.55, 0.82, 0.6, 0.55],
            }}
            transition={{
              duration: 26,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1.5,
            }}
          />
          <MotionBox
            sx={{
              ...orbCommon,
              width: { xs: 260, md: 400 },
              height: { xs: 260, md: 400 },
              left: { xs: '20%', md: '35%' },
              bottom: { xs: '-5%', md: '5%' },
              background: `radial-gradient(circle at 50% 50%, ${wash}, transparent 70%)`,
              opacity: 0.5,
            }}
            animate={{
              scale: [1, 1.06, 0.98, 1],
              opacity: [0.35, 0.55, 0.4, 0.35],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.8,
            }}
          />
        </>
      ) : (
        <>
          <Box
            sx={{
              ...orbCommon,
              width: 380,
              height: 380,
              left: '5%',
              top: '10%',
              background: `radial-gradient(circle at 30% 30%, ${primaryGlow}, transparent 65%)`,
              opacity: 0.55,
            }}
          />
          <Box
            sx={{
              ...orbCommon,
              width: 440,
              height: 440,
              right: '0%',
              top: '20%',
              background: `radial-gradient(circle at 70% 40%, ${secondaryGlow}, transparent 62%)`,
              opacity: 0.45,
            }}
          />
        </>
      )}
    </Box>
  );
}
