'use client';

import { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DownloadIcon from '@mui/icons-material/Download';
import { alpha } from '@mui/material/styles';
import { motion, useScroll, useTransform } from 'framer-motion';
import CommitSkyline from './skyline/CommitSkyline';
import CountUp from './CountUp';
import { EASE } from './motion/variants';
import { fontFamilies } from '../fonts';
import { site } from '../site';
import { useFineMotion } from '../hooks/useFineMotion';
import { useMagnetic } from '../hooks/useMagnetic';
import type { Dictionary } from '../get-dictionary';
import type { Locale } from '../../i18n-config';

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

export default function Hero({ dictionary, lang }: { dictionary: Dictionary; lang: Locale }) {
  const { hero } = dictionary;
  const nameRef = useRef<HTMLHeadingElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
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

  const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--gx', `${event.clientX - rect.left}px`);
    el.style.setProperty('--gy', `${event.clientY - rect.top}px`);
  };

  return (
    <Box
      ref={sectionRef}
      id="home"
      component="section"
      onPointerMove={onPointerMove}
      sx={{
        minHeight: { xs: 'auto', md: '100vh' },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        px: { xs: 3, sm: 5, lg: 8 },
        pt: { xs: 10, md: 10 },
        pb: { xs: 6, md: 4 },
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Dotted grid: faint everywhere, lit up around the pointer. */}
      <Box
        aria-hidden
        sx={(theme) => {
          const dot = `radial-gradient(${alpha(theme.palette.text.primary, 0.13)} 1px, transparent 1.2px)`;
          return {
            position: 'absolute',
            inset: 0,
            backgroundImage: dot,
            backgroundSize: '26px 26px',
            maskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, #000 30%, transparent 85%)',
            pointerEvents: 'none',
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: 0,
              backgroundImage: `radial-gradient(${theme.palette.accent.main} 1.2px, transparent 1.4px)`,
              backgroundSize: '26px 26px',
              maskImage: 'radial-gradient(220px circle at var(--gx, -999px) var(--gy, -999px), #000, transparent 75%)',
              opacity: 0.7,
            },
          };
        }}
      />
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

      <Box
        sx={{
          position: 'relative',
          display: 'grid',
          // Stacked: name, skyline, then the pitch. Desktop: text left, skyline right.
          gridTemplateColumns: { xs: '1fr', lg: '1.05fr 1fr' },
          gridTemplateRows: { lg: '1fr auto auto 1fr' },
          gridTemplateAreas: {
            xs: '"head" "stage" "body"',
            lg: '". stage" "head stage" "body stage" ". stage"',
          },
          columnGap: { lg: 4 },
          flex: 1,
          // Text sits above the canvas but lets pointer events through to it.
          '& > .hero-text': {
            position: 'relative',
            zIndex: 2,
            pointerEvents: 'none',
            '& a, & button': { pointerEvents: 'auto' },
          },
        }}
      >
        <Box className="hero-text" sx={{ gridArea: 'head' }}>
            <motion.div {...heroItem(0)}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75, mb: { xs: 3.5, md: 4 } }}>
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
                  // down to the narrowest phones, and beside the skyline on desktop.
                  fontSize: { xs: 'clamp(34px, 10.5vw, 96px)', lg: 'clamp(48px, 5.2vw, 96px)' },
                  lineHeight: 0.95,
                  textTransform: 'uppercase',
                }}
              >
                <KineticWord word={site.firstName} />
                <KineticWord word={site.lastName} accent />
              </Typography>
            </motion.div>
        </Box>

        <Box className="hero-text" sx={{ gridArea: 'body' }}>
          <motion.div {...heroItem(0.16)}>
            <Typography sx={{ mt: { xs: 3.5, md: 4 }, maxWidth: 520, fontSize: '1.1rem', lineHeight: 1.7, color: 'text.secondary' }}>
              {hero.intro}
            </Typography>
          </motion.div>

          <motion.div {...heroItem(0.24)}>
            <Box sx={{ display: 'flex', gap: 2, mt: 4, flexWrap: 'wrap', alignItems: 'center' }}>
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
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                mt: 2.5,
                fontFamily: fontFamilies.mono,
                fontSize: '0.68rem',
                color: 'text.secondary',
              }}
            >
              <Box component="span" className="live-dot" aria-hidden />
              {hero.status}
            </Box>
          </motion.div>
        </Box>

        {/* The 3D commit skyline. */}
        <Box
          sx={{
            gridArea: 'stage',
            alignSelf: 'center',
            position: 'relative',
            height: { xs: 300, sm: 380, lg: 'min(620px, 66vh)' },
            my: { xs: 2, lg: 0 },
            mx: { xs: -1, sm: 0 },
            // Bleeds left under the text column (which lets pointer events
            // through) so the slab has room to breathe.
            ml: { lg: '-30%' },
            mr: { lg: -4 },
            zIndex: 1,
          }}
        >
          <CommitSkyline dictionary={dictionary} lang={lang} />
        </Box>
      </Box>

      <motion.div {...heroItem(0.36)}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            mt: { xs: 5, lg: 3 },
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          {hero.stats.map((stat, index) => (
            <Box
              key={stat.label}
              sx={{
                py: { xs: 2.25, md: 2.75 },
                pl: { xs: index % 2 === 0 ? 0 : 2.5, md: index === 0 ? 0 : 3 },
                // Longhands: a responsive `borderLeft` shorthand would reset the colour.
                borderStyle: 'solid',
                borderWidth: 0,
                borderLeftWidth: { xs: index % 2 === 0 ? 0 : 1, md: index === 0 ? 0 : 1 },
                borderTopWidth: { xs: index > 1 ? 1 : 0, md: 0 },
                borderColor: 'divider',
              }}
            >
              <Box sx={{ fontFamily: fontFamilies.display, fontSize: { xs: '1.6rem', sm: '2rem' }, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                <CountUp value={stat.value} />
              </Box>
              <Box
                sx={{
                  fontFamily: fontFamilies.mono,
                  fontSize: '0.62rem',
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
  );
}
