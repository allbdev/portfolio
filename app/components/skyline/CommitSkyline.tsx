'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';
import { alpha, useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import commits from '../../data/commits.json';
import { fontFamilies } from '../../fonts';
import type { Dictionary } from '../../get-dictionary';
import type { Locale } from '../../../i18n-config';

const SkylineScene = dynamic(() => import('./SkylineScene'), { ssr: false });

const DAY = 86_400_000;
const startMs = new Date(`${commits.start}T00:00:00Z`).getTime();

type Tip = { day: number; x: number; y: number } | null;

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return reduced;
}

/**
 * The hero centrepiece: a year of real commits (from `pnpm commits`) rendered
 * as a rotatable 3D skyline. Hover a bar for the day, drag to spin it.
 */
export default function CommitSkyline({ dictionary, lang }: { dictionary: Dictionary; lang: Locale }) {
  const t = dictionary.hero.skyline;
  const theme = useTheme();
  const dark = theme.palette.mode === 'dark';
  const reducedMotion = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [running, setRunning] = useState(true);
  const [tip, setTip] = useState<Tip>(null);

  // Stop rendering frames once the hero scrolls away.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setRunning(entry.isIntersecting), {
      threshold: 0,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const onHover = useCallback((day: number | null, x: number, y: number) => {
    const bounds = wrapRef.current?.getBoundingClientRect();
    if (day === null || !bounds) {
      setTip(null);
      return;
    }
    setTip({ day, x: x - bounds.left, y: y - bounds.top });
  }, []);

  const number = new Intl.NumberFormat(lang === 'pt' ? 'pt-BR' : 'en-US');
  const dateFormat = new Intl.DateTimeFormat(lang === 'pt' ? 'pt-BR' : 'en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });

  const tipCount = tip ? commits.counts[tip.day] : 0;
  const tipRepo = tip && commits.topRepo[tip.day] >= 0 ? commits.labels[commits.topRepo[tip.day]] : null;

  return (
    <Box ref={wrapRef} sx={{ position: 'relative', width: '100%', height: '100%' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        style={{ position: 'absolute', inset: 0, cursor: 'grab' }}
      >
        <SkylineScene
          counts={commits.counts}
          accent={theme.palette.accent.main}
          idle={dark ? '#1a222c' : '#d5dce3'}
          base={dark ? '#0d1218' : '#e6ebf0'}
          dark={dark}
          reducedMotion={reducedMotion}
          running={running}
          onHover={onHover}
        />
      </motion.div>

      {tip && (
        <Box
          role="status"
          sx={{
            position: 'absolute',
            left: tip.x,
            top: tip.y,
            transform: 'translate(-50%, calc(-100% - 18px))',
            pointerEvents: 'none',
            bgcolor: alpha(theme.palette.background.paper, 0.92),
            backdropFilter: 'blur(8px)',
            border: 1,
            borderColor: alpha(theme.palette.accent.main, 0.4),
            borderRadius: '10px',
            px: 1.5,
            py: 1,
            whiteSpace: 'nowrap',
            fontFamily: fontFamilies.mono,
            fontSize: '0.72rem',
            zIndex: 3,
            boxShadow: `0 10px 30px ${alpha('#000', 0.25)}`,
          }}
        >
          <Box sx={{ color: 'accent.text', fontWeight: 500 }}>
            {tipCount === 0
              ? t.noCommits
              : `${number.format(tipCount)} ${tipCount === 1 ? t.commit : t.commits}`}
          </Box>
          <Box sx={{ color: 'text.secondary', mt: 0.25 }}>
            {dateFormat.format(new Date(startMs + tip.day * DAY))}
            {tipRepo ? ` · ${tipRepo}` : ''}
          </Box>
        </Box>
      )}

      {/* Caption: what you're looking at, plus a GitHub-style legend. */}
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          // Lines up with the column, not the part that bleeds under the text.
          pl: { lg: '23%' },
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: 2,
          flexWrap: 'wrap',
          pointerEvents: 'none',
          fontFamily: fontFamilies.mono,
          fontSize: '0.64rem',
          letterSpacing: '0.08em',
          color: 'text.secondary',
        }}
      >
        <Box>
          <Box sx={{ color: 'text.primary', fontSize: '0.78rem', letterSpacing: '0.02em', mb: 0.5 }}>
            <Box component="span" sx={{ color: 'accent.text' }}>
              {number.format(commits.total)}
            </Box>{' '}
            {t.caption}
          </Box>
          <Box>
            {t.streak.replace('{n}', String(commits.longestStreak))} ·{' '}
            {t.activeDays.replace('{n}', String(commits.activeDays))} · {t.dragHint}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {t.less}
          {[0.08, 0.3, 0.55, 0.8, 1].map((level) => (
            <Box
              key={level}
              sx={{
                width: 10,
                height: 10,
                borderRadius: '2px',
                bgcolor:
                  level < 0.1
                    ? dark
                      ? '#1a222c'
                      : '#d5dce3'
                    : alpha(theme.palette.accent.main, level),
              }}
            />
          ))}
          {t.more}
        </Box>
      </Box>
    </Box>
  );
}
