'use client';

import { useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import { AnimatePresence, motion, useInView, useScroll, useSpring } from 'framer-motion';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';
import { EASE } from './motion/variants';
import { fontFamilies } from '../fonts';
import type { Dictionary } from '../get-dictionary';

const VISIBLE_BULLETS = 5;
const RAIL = { xs: 28, md: 56 };

/** Stable fake commit hash per job, so it reads like `git log`. */
function shortHash(seed: string) {
  let h = 2166136261;
  for (const char of seed) h = Math.imul(h ^ char.charCodeAt(0), 16777619);
  return (h >>> 0).toString(16).padStart(8, '0').slice(0, 7);
}

const monoSx = { fontFamily: fontFamilies.mono, fontSize: '0.7rem', letterSpacing: '0.08em' } as const;

function BranchChip({ label, head = false }: { label: string; head?: boolean }) {
  return (
    <Box
      component="span"
      sx={(theme) => ({
        ...monoSx,
        fontSize: '0.64rem',
        letterSpacing: '0.04em',
        px: 1,
        py: 0.25,
        borderRadius: '6px',
        border: `1px solid ${alpha(theme.palette.accent.main, head ? 0.6 : 0.3)}`,
        bgcolor: alpha(theme.palette.accent.main, head ? 0.14 : 0.06),
        color: 'accent.text',
        whiteSpace: 'nowrap',
      })}
    >
      {label}
    </Box>
  );
}

/** Commit node on the rail; fills in once its row scrolls into view. */
function Node({ head = false }: { head?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -35% 0px' });
  return (
    <Box
      ref={ref}
      aria-hidden
      sx={(theme) => ({
        position: 'absolute',
        left: { xs: RAIL.xs / 2, md: RAIL.md / 2 },
        top: 6,
        width: 15,
        height: 15,
        ml: '-7.5px',
        borderRadius: '50%',
        border: `2px solid ${inView ? theme.palette.accent.main : theme.palette.divider}`,
        bgcolor: inView ? theme.palette.accent.main : theme.palette.background.default,
        boxShadow: inView ? `0 0 0 5px ${alpha(theme.palette.accent.main, 0.14)}` : 'none',
        transition: 'all 0.5s cubic-bezier(0.22,1,0.36,1)',
        zIndex: 1,
        ...(head && { animation: 'head-pulse 2.4s ease-out infinite' }),
      })}
    />
  );
}

/** One entry on the graph. `spaced` adds the gap above it, outside the node's frame. */
function Row({ children, head = false, spaced = false }: { children: React.ReactNode; head?: boolean; spaced?: boolean }) {
  return (
    <Box sx={{ pt: spaced ? { xs: 7, md: 9 } : 0 }}>
      <Box sx={{ position: 'relative', pl: { xs: `${RAIL.xs + 12}px`, md: `${RAIL.md + 8}px` } }}>
        <Node head={head} />
        {children}
      </Box>
    </Box>
  );
}

export default function Experience({ dictionary }: { dictionary: Dictionary }) {
  const { experience } = dictionary;
  const graphRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const { scrollYProgress } = useScroll({ target: graphRef, offset: ['start 70%', 'end 60%'] });
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 25, restDelta: 0.001 });

  return (
    <Box
      id="experience"
      component="section"
      sx={{ px: { xs: 3, sm: 5, lg: 8 }, pt: { xs: 10, md: 15 }, pb: 5 }}
    >
      <SectionHeading index="03" title={experience.title} mb={3} />

      <Box
        sx={{
          ...monoSx,
          color: 'text.secondary',
          mb: 5,
          '& b': { color: 'accent.text', fontWeight: 500 },
        }}
      >
        <b>$</b> git log --graph --oneline career
      </Box>

      <Box ref={graphRef} sx={{ position: 'relative' }}>
        {/* Rail: a faint track with an accent line drawn by scroll progress. */}
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            left: { xs: RAIL.xs / 2, md: RAIL.md / 2 },
            top: 12,
            bottom: 12,
            width: '2px',
            ml: '-1px',
            bgcolor: 'divider',
          }}
        />
        <Box
          component={motion.div}
          aria-hidden
          style={{ scaleY: fill }}
          sx={(theme) => ({
            position: 'absolute',
            left: { xs: RAIL.xs / 2, md: RAIL.md / 2 },
            top: 12,
            bottom: 12,
            width: '2px',
            ml: '-1px',
            transformOrigin: 'top',
            background: `linear-gradient(${theme.palette.accent.main}, ${alpha(theme.palette.accent.main, 0.4)})`,
            boxShadow: `0 0 12px ${alpha(theme.palette.accent.main, 0.5)}`,
          })}
        />

        {/* HEAD: where things stand today. */}
        <Row head>
          <Reveal>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.25, mb: 1.25 }}>
              <Box component="span" sx={{ ...monoSx, color: 'text.secondary' }}>
                {shortHash('head')}
              </Box>
              <BranchChip label={experience.head.branch} head />
              <Box component="span" sx={{ ...monoSx, color: 'accent.text' }}>
                {experience.head.date}
              </Box>
            </Box>
            <Typography sx={{ fontSize: '1.15rem', fontWeight: 600 }}>{experience.head.title}</Typography>
            <Typography sx={{ fontSize: '0.95rem', color: 'text.secondary', mt: 0.5, maxWidth: 680, lineHeight: 1.6 }}>
              {experience.head.text}
            </Typography>
          </Reveal>
        </Row>

        {experience.jobs.map((job) => {
          const key = `${job.company}-${job.period}`;
          const open = expanded[key] ?? false;
          const extra = job.achievements.length - VISIBLE_BULLETS;
          const bullets = open ? job.achievements : job.achievements.slice(0, VISIBLE_BULLETS);

          return (
            <Row key={key} spaced>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '300px 1fr' },
                  gap: { xs: 2.5, md: 6 },
                }}
              >
                <Box>
                  <Box sx={{ position: { md: 'sticky' }, top: 96 }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, mb: 1.75 }}>
                      <Box component="span" sx={{ ...monoSx, color: 'text.secondary' }}>
                        {shortHash(job.company)}
                      </Box>
                      <BranchChip label={job.branch} />
                    </Box>
                    <Box sx={{ ...monoSx, color: 'accent.text', mb: 1.25 }}>{job.period}</Box>
                    <Typography component="h3" variant="h4" sx={{ fontSize: '1.6rem', lineHeight: 1.2 }}>
                      {job.role}
                    </Typography>
                    <Typography sx={{ fontSize: '1rem', color: 'text.secondary', mt: 0.75 }}>
                      @ {job.company}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 2.5 }}>
                      {job.stack.map((tech) => (
                        <Box
                          key={tech}
                          component="span"
                          sx={{
                            ...monoSx,
                            fontSize: '0.62rem',
                            letterSpacing: '0.04em',
                            color: 'text.secondary',
                            border: 1,
                            borderColor: 'divider',
                            borderRadius: 999,
                            px: 1.1,
                            py: 0.4,
                          }}
                        >
                          {tech}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Box>

                <Reveal>
                  <Typography sx={{ m: 0, mb: 3, fontSize: '1.02rem', lineHeight: 1.7, color: 'text.secondary' }}>
                    {job.description}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <AnimatePresence initial={false}>
                      {bullets.map((achievement, index) => (
                        <Box
                          key={achievement}
                          component={motion.div}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.35, ease: EASE, delay: index >= VISIBLE_BULLETS ? (index - VISIBLE_BULLETS) * 0.04 : 0 }}
                          sx={{ overflow: 'hidden' }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              gap: 1.75,
                              py: 1.375,
                              borderTop: 1,
                              borderColor: 'divider',
                              alignItems: 'baseline',
                              transition: 'padding-left 0.25s',
                              '&:hover': { pl: 0.75 },
                              '&:hover .bullet-arrow': { color: 'accent.main' },
                            }}
                          >
                            <Box
                              aria-hidden
                              component="span"
                              className="bullet-arrow"
                              sx={{ fontFamily: fontFamilies.mono, fontSize: '0.75rem', color: 'accent.text', flex: 'none' }}
                            >
                              →
                            </Box>
                            <Box component="span" sx={{ fontSize: '0.94rem', lineHeight: 1.6 }}>
                              {achievement}
                            </Box>
                          </Box>
                        </Box>
                      ))}
                    </AnimatePresence>
                  </Box>
                  {extra > 0 && (
                    <Box
                      component="button"
                      type="button"
                      onClick={() => setExpanded((prev) => ({ ...prev, [key]: !open }))}
                      aria-expanded={open}
                      sx={{
                        all: 'unset',
                        cursor: 'pointer',
                        mt: 1.5,
                        ...monoSx,
                        color: 'accent.text',
                        borderTop: 1,
                        borderColor: 'divider',
                        pt: 1.5,
                        display: 'block',
                        width: '100%',
                        '&:hover, &:focus-visible': { textDecoration: 'underline' },
                      }}
                    >
                      {open ? experience.showLess : experience.showMore.replace('{n}', String(extra))}
                    </Box>
                  )}
                </Reveal>
              </Box>
            </Row>
          );
        })}

        {/* Root commit. */}
        <Row spaced>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.25 }}>
              <Box component="span" sx={{ ...monoSx, color: 'text.secondary' }}>
                {shortHash('root')}
              </Box>
              <Box component="span" sx={{ ...monoSx, color: 'accent.text' }}>
                {experience.root.date}
              </Box>
              <Box component="span" sx={{ fontSize: '0.95rem', color: 'text.secondary' }}>
                {experience.root.title}
              </Box>
            </Box>
        </Row>
      </Box>

      <Box sx={{ mt: 12 }}>
        <Box
          sx={{
            fontFamily: fontFamilies.mono,
            fontSize: '0.7rem',
            letterSpacing: '0.18em',
            color: 'text.secondary',
            textTransform: 'uppercase',
            mb: 3,
          }}
        >
          {experience.educationTitle}
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' },
            gap: 2.5,
          }}
        >
          {experience.education.map((item, index) => (
            <Reveal key={`${item.title}-${item.institution}`} delay={index * 0.05} fullHeight>
              <Box
                sx={{
                  height: '100%',
                  boxSizing: 'border-box',
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: '14px',
                  p: 2.75,
                  transition: 'border-color 0.25s, transform 0.3s',
                  '&:hover': {
                    borderColor: (theme) => alpha(theme.palette.accent.main, 0.45),
                    transform: 'translateY(-3px)',
                  },
                }}
              >
                <Box sx={{ fontSize: '0.95rem', fontWeight: 600, lineHeight: 1.4 }}>{item.title}</Box>
                <Box
                  sx={{
                    fontFamily: fontFamilies.mono,
                    fontSize: '0.66rem',
                    letterSpacing: '0.08em',
                    color: 'accent.text',
                    my: 1,
                  }}
                >
                  {item.institution}
                </Box>
                <Box sx={{ fontSize: '0.82rem', color: 'text.secondary', lineHeight: 1.5 }}>
                  {item.description}
                </Box>
              </Box>
            </Reveal>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
