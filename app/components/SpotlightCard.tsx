'use client';

import Box from '@mui/material/Box';
import type { BoxProps } from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import { EASE } from './motion/variants';

type SpotlightCardProps = BoxProps & {
  /** Radius of the accent glow that follows the pointer. */
  glow?: number;
};

/**
 * Panel with a pointer-tracked accent glow, a lift on hover, and a slow zoom
 * applied to any image inside an element marked `.shot`.
 */
export default function SpotlightCard({ children, glow = 480, sx, ...rest }: SpotlightCardProps) {
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty('--my', `${event.clientY - rect.top}px`);
  };

  return (
    <Box
      onMouseMove={handleMouseMove}
      sx={[
        (theme) => ({
          position: 'relative',
          bgcolor: 'background.paper',
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: '20px',
          overflow: 'hidden',
          transition: `border-color 0.3s, transform 0.4s cubic-bezier(${EASE.join(
            ',',
          )}), box-shadow 0.4s`,
          '& .spotlight': { opacity: 0, transition: 'opacity 0.35s ease' },
          '& .shot img': { transition: 'transform 1s cubic-bezier(0.22,1,0.36,1)' },
          '&:hover': {
            borderColor: alpha(theme.palette.accent.main, 0.4),
            transform: 'translateY(-6px)',
            boxShadow: `0 24px 80px ${alpha(theme.palette.accent.main, 0.1)}`,
            '& .spotlight': { opacity: 1 },
            '& .shot img': { transform: 'scale(1.06) translateY(-2%)' },
          },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...rest}
    >
      <Box
        className="spotlight"
        aria-hidden
        sx={(theme) => ({
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(${glow}px circle at var(--mx, 60%) var(--my, 30%), ${alpha(
            theme.palette.accent.main,
            0.07,
          )}, transparent 60%)`,
          pointerEvents: 'none',
          zIndex: 1,
        })}
      />
      {children}
    </Box>
  );
}
