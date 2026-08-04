'use client';

import { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DownloadIcon from '@mui/icons-material/Download';
import SouthIcon from '@mui/icons-material/South';
import { alpha } from '@mui/material/styles';
import { motion, useScroll, useTransform } from 'framer-motion';
import { EASE } from './motion/variants';
import { fontFamilies } from '../fonts';
import { site } from '../site';
import { useFineMotion } from '../hooks/useFineMotion';
import { useMagnetic } from '../hooks/useMagnetic';
import type { Dictionary } from '../get-dictionary';

const MotionBox = motion.create(Box);

/** Splits a word into per-letter spans so each glyph can carry its own weight. */
function KineticWord({ word, accent = false }: { word: string; accent?: boolean }) {
  return (
    <Box component="div" sx={accent ? { color: 'accent.text' } : undefined}>
      {Array.from(word).map((letter, index) => (
        <Box
          key={`${letter}-${index}`}
          component="span"
          className="kinetic-letter"
          sx={{ display: 'inline-block' }}
        >
          {letter}
        </Box>
      ))}
    </Box>
  );
}

function heroItem(delay: number) {
  return {
    initial: { opacity: 0, y: 26 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: EASE, delay },
  };
}

export default function Hero({ dictionary }: { dictionary: Dictionary }) {
  const { hero } = dictionary;
  const nameRef = useRef<HTMLHeadingElement>(null);
  const fineMotion = useFineMotion();
  const primaryRef = useMagnetic<HTMLAnchorElement>();
  const secondaryRef = useMagnetic<HTMLAnchorElement>();

  const { scrollY } = useScroll();
  const glowA = useTransform(scrollY, (value) => value * 0.18);
  const glowB = useTransform(scrollY, (value) => value * -0.1);

  // Letters closest to the pointer thicken, tapering off over ~320px.
  useEffect(() => {
    const heading = nameRef.current;
    if (!heading) return;

    const letters = Array.from(
      heading.querySelectorAll<HTMLElement>('.kinetic-letter'),
    );

    if (!fineMotion) {
      letters.forEach((letter) => {
        letter.style.fontVariationSettings = '';
      });
      return;
    }

    let frame = 0;
    const onMove = (event: MouseEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const bounds = heading.getBoundingClientRect();
        if (event.clientY < bounds.top - 200 || event.clientY > bounds.bottom + 200) return;

        letters.forEach((letter) => {
          const rect = letter.getBoundingClientRect();
          const distance = Math.hypot(
            event.clientX - (rect.left + rect.width / 2),
            event.clientY - (rect.top + rect.height / 2),
          );
          const weight = 700 - Math.min(distance / 320, 1) * 300;
          letter.style.fontVariationSettings = `'wght' ${Math.round(weight)}`;
        });
      });
    };

    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(frame);
      letters.forEach((letter) => {
        letter.style.fontVariationSettings = '';
      });
    };
  }, [fineMotion]);

  return (
    <Box
      id="home"
      component="section"
      sx={{
        minHeight: { xs: 'auto', md: '100vh' },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        px: { xs: 3, sm: 5, lg: 8 },
        pt: { xs: 14, md: 12 },
        pb: { xs: 10, md: 8 },
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      <MotionBox
        aria-hidden
        style={{ y: glowA }}
        sx={(theme) => ({
          position: 'absolute',
          width: 640,
          height: 640,
          borderRadius: '50%',
          right: -160,
          top: -120,
          background: `radial-gradient(circle at 40% 40%, ${alpha(
            theme.palette.accent.main,
            0.13,
          )}, transparent 62%)`,
          pointerEvents: 'none',
        })}
      />
      <MotionBox
        aria-hidden
        style={{ y: glowB }}
        sx={(theme) => ({
          position: 'absolute',
          width: 480,
          height: 480,
          borderRadius: '50%',
          left: -140,
          bottom: -160,
          background: `radial-gradient(circle at 60% 40%, ${alpha(
            theme.palette.accent.main,
            0.08,
          )}, transparent 65%)`,
          pointerEvents: 'none',
        })}
      />

      <Box sx={{ position: 'relative' }}>
        <motion.div {...heroItem(0)}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75, mb: 4.5 }}>
            <Box aria-hidden sx={{ width: 40, height: '1px', bgcolor: 'accent.main' }} />
            <Box
              component="span"
              sx={{
                fontFamily: fontFamilies.mono,
                fontSize: { xs: '0.62rem', sm: '0.72rem' },
                letterSpacing: { xs: '0.16em', sm: '0.22em' },
                color: 'accent.text',
                textTransform: 'uppercase',
              }}
            >
              {hero.eyebrow}
            </Box>
          </Box>
        </motion.div>

        <motion.div {...heroItem(0.08)}>
          <Typography
            ref={nameRef}
            component="h1"
            variant="h1"
            sx={{
              m: 0,
              // Scales off the viewport so "ALBUQUERQUE" stays on one line
              // down to the narrowest phones.
              fontSize: 'clamp(34px, 10.5vw, 124px)',
              lineHeight: 0.95,
              textTransform: 'uppercase',
            }}
          >
            <KineticWord word={site.firstName} />
            <KineticWord word={site.lastName} accent />
          </Typography>
        </motion.div>

        <motion.div {...heroItem(0.16)}>
          <Typography
            sx={{
              mt: 5,
              maxWidth: 560,
              fontSize: '1.125rem',
              lineHeight: 1.7,
              color: 'text.secondary',
            }}
          >
            {hero.intro}
          </Typography>
        </motion.div>

        <motion.div {...heroItem(0.24)}>
          <Box sx={{ display: 'flex', gap: 2, mt: 5.5, flexWrap: 'wrap' }}>
            <Button
              ref={primaryRef}
              href="#projects"
              variant="contained"
              endIcon={<ArrowDownwardIcon sx={{ fontSize: 18 }} />}
              sx={{
                px: 3.75,
                py: 1.75,
                fontSize: '0.95rem',
                bgcolor: 'accent.main',
                color: 'accent.ink',
                transition: 'box-shadow 0.3s',
                '&:hover': {
                  bgcolor: 'accent.main',
                  boxShadow: (theme) => `0 8px 40px ${alpha(theme.palette.accent.main, 0.45)}`,
                },
              }}
            >
              {hero.cta}
            </Button>
            <Button
              ref={secondaryRef}
              href={site.cv}
              download
              target="_blank"
              variant="outlined"
              endIcon={<DownloadIcon sx={{ fontSize: 18 }} />}
              sx={{
                px: 3.625,
                py: 1.625,
                fontSize: '0.95rem',
                color: 'text.primary',
                borderColor: 'divider',
                transition: 'border-color 0.25s, color 0.25s',
                '&:hover': { borderColor: 'accent.main', color: 'accent.text' },
              }}
            >
              {hero.downloadCv}
            </Button>
          </Box>
        </motion.div>

        <motion.div {...heroItem(0.32)}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 9 }}>
            {hero.stats.map((stat, index) => (
              <Box
                key={stat.label}
                sx={{
                  pl: index === 0 ? 0 : { xs: 2.5, sm: 5 },
                  pr: { xs: 2.5, sm: 5 },
                  py: { xs: 1, sm: 0 },
                  borderLeft: index === 0 ? 0 : 1,
                  borderColor: 'divider',
                }}
              >
                <Box
                  sx={{
                    fontFamily: fontFamilies.display,
                    fontSize: '2rem',
                    fontWeight: 600,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {stat.value}
                </Box>
                <Box
                  sx={{
                    fontFamily: fontFamilies.mono,
                    fontSize: '0.65rem',
                    letterSpacing: '0.14em',
                    color: 'text.secondary',
                    textTransform: 'uppercase',
                    mt: 0.75,
                  }}
                >
                  {stat.label}
                </Box>
              </Box>
            ))}
          </Box>
        </motion.div>
      </Box>

      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          bottom: 28,
          left: { xs: 24, sm: 40, lg: 64 },
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          gap: 1.25,
          animation: 'scroll-cue 2s ease-in-out infinite',
        }}
      >
        <SouthIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
        <Box
          component="span"
          sx={{
            fontFamily: fontFamilies.mono,
            fontSize: '0.6rem',
            letterSpacing: '0.2em',
            color: 'text.secondary',
          }}
        >
          SCROLL
        </Box>
      </Box>
    </Box>
  );
}
