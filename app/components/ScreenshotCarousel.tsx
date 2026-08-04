'use client';

import { useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { alpha } from '@mui/material/styles';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE } from './motion/variants';

export type Screenshot = { src: string; alt: string };

type ScreenshotCarouselProps = {
  screenshots: Screenshot[];
  /** Accessible label for the carousel region. */
  label?: string;
};

const swipeConfidenceThreshold = 60;

const slideVariants = {
  enter: (direction: number) => ({ opacity: 0, x: direction > 0 ? 48 : -48 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.45, ease: EASE } },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -48 : 48,
    transition: { duration: 0.3, ease: EASE },
  }),
};

const arrowSx = {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  width: 42,
  height: 42,
  border: 1,
  borderColor: 'divider',
  bgcolor: 'background.default',
  color: 'text.primary',
  transition: 'border-color 0.2s, color 0.2s',
  '&:hover': { bgcolor: 'background.default', borderColor: 'accent.main', color: 'accent.text' },
} as const;

export default function ScreenshotCarousel({
  screenshots,
  label = 'Screenshots',
}: ScreenshotCarouselProps) {
  // [index, direction] — direction drives the slide animation.
  const [[index, direction], setState] = useState<[number, number]>([0, 0]);

  const total = screenshots.length;

  const paginate = useCallback(
    (dir: number) => {
      if (total <= 1) return;
      setState(([current]) => [(current + dir + total) % total, dir]);
    },
    [total],
  );

  const goTo = useCallback((target: number) => {
    setState(([current]) => [target, target > current ? 1 : -1]);
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        paginate(-1);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        paginate(1);
      }
    },
    [paginate],
  );

  if (total === 0) return null;

  const hasControls = total > 1;
  const current = screenshots[Math.min(index, total - 1)];

  return (
    <Box
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      sx={{
        position: 'relative',
        width: '100%',
        borderRadius: '20px',
        overflow: 'hidden',
        border: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        outline: 'none',
        '&:focus-visible': {
          borderColor: 'accent.main',
          boxShadow: (theme) => `0 0 0 3px ${alpha(theme.palette.accent.main, 0.35)}`,
        },
      }}
    >
      <Box sx={{ position: 'relative', width: '100%', aspectRatio: '16 / 9' }}>
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={index}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            drag={hasControls ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragEnd={(_, info) => {
              if (info.offset.x < -swipeConfidenceThreshold) paginate(1);
              else if (info.offset.x > swipeConfidenceThreshold) paginate(-1);
            }}
            style={{ position: 'absolute', inset: 0 }}
            aria-roledescription="slide"
            aria-label={`${index + 1} / ${total}`}
          >
            <Image
              src={current.src}
              alt={current.alt}
              fill
              sizes="(max-width: 1100px) 100vw, 1040px"
              style={{ objectFit: 'cover', pointerEvents: 'none' }}
              priority={index === 0}
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>
      </Box>

      {hasControls ? (
        <>
          <IconButton
            aria-label="Previous screenshot"
            onClick={() => paginate(-1)}
            sx={{ ...arrowSx, left: 16 }}
          >
            <ChevronLeftIcon sx={{ fontSize: 22 }} />
          </IconButton>
          <IconButton
            aria-label="Next screenshot"
            onClick={() => paginate(1)}
            sx={{ ...arrowSx, right: 16 }}
          >
            <ChevronRightIcon sx={{ fontSize: 22 }} />
          </IconButton>

          <Box
            sx={{
              position: 'absolute',
              bottom: 16,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              gap: 1,
            }}
          >
            {screenshots.map((screenshot, dotIndex) => (
              <Box
                key={screenshot.src}
                component="button"
                type="button"
                aria-label={`Go to screenshot ${dotIndex + 1}`}
                aria-current={dotIndex === index}
                onClick={() => goTo(dotIndex)}
                sx={{
                  width: dotIndex === index ? 22 : 8,
                  height: 8,
                  p: 0,
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: 999,
                  bgcolor: (theme) =>
                    dotIndex === index
                      ? theme.palette.accent.main
                      : alpha(theme.palette.accent.main, 0.3),
                  transition: 'width 0.3s ease, background-color 0.3s ease',
                }}
              />
            ))}
          </Box>
        </>
      ) : null}
    </Box>
  );
}
