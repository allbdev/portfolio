'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import WestIcon from '@mui/icons-material/West';
import { alpha } from '@mui/material/styles';
import { MotionConfig } from 'framer-motion';
import Link from 'next/link';
import CustomCursor from './CustomCursor';
import Reveal from './Reveal';
import ScreenshotCarousel from './ScreenshotCarousel';
import ScrollProgress from './ScrollProgress';
import ThemeControls from './ThemeControls';
import { fontFamilies } from '../fonts';
import { useMagnetic } from '../hooks/useMagnetic';
import type { Dictionary } from '../get-dictionary';
import type { Locale } from '../../i18n-config';

type Project = Dictionary['projects']['items'][number];

/** Label column + content column, the layout the design uses for every detail block. */
function DetailRow({
  label,
  children,
  divider = true,
}: {
  label: string;
  children: React.ReactNode;
  divider?: boolean;
}) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '240px 1fr' },
        gap: { xs: 2, md: 4 },
        py: 5,
        borderBottom: divider ? 1 : 0,
        borderColor: 'divider',
      }}
    >
      <Box
        sx={{
          fontFamily: fontFamilies.mono,
          fontSize: '0.72rem',
          letterSpacing: '0.16em',
          color: 'accent.text',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </Box>
      <Box>{children}</Box>
    </Box>
  );
}

export default function ProjectDetail({
  project,
  dictionary,
  lang,
}: {
  project: Project;
  dictionary: Dictionary;
  lang: Locale;
}) {
  const { detail, liveDemo, viewCode } = dictionary.projects;
  const backRef = useMagnetic<HTMLAnchorElement>();
  const liveRef = useMagnetic<HTMLAnchorElement>();
  const codeRef = useMagnetic<HTMLAnchorElement>();

  return (
    <MotionConfig reducedMotion="user">
      <ScrollProgress />
      <CustomCursor />
      <Box
        component="main"
        sx={{
          minHeight: '100vh',
          bgcolor: 'background.default',
          color: 'text.primary',
          px: { xs: 3, sm: 5, lg: 8 },
          py: { xs: 5, md: 9 },
          boxSizing: 'border-box',
        }}
      >
        <Box sx={{ maxWidth: 1040, mx: 'auto' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
              mb: 6,
            }}
          >
            <Button
              ref={backRef}
              component={Link}
              href={`/${lang}#projects`}
              variant="outlined"
              startIcon={<WestIcon sx={{ fontSize: 15 }} />}
              sx={{
                px: 2.25,
                py: 1.125,
                color: 'text.secondary',
                borderColor: 'divider',
                borderRadius: '10px',
                fontFamily: fontFamilies.mono,
                fontSize: '0.7rem',
                letterSpacing: '0.1em',
                transition: 'border-color 0.25s, color 0.25s',
                '&:hover': { borderColor: 'accent.main', color: 'accent.text' },
              }}
            >
              {detail.back}
            </Button>
            <ThemeControls lang={lang} />
          </Box>

          <Box
            sx={{
              fontFamily: fontFamilies.mono,
              fontSize: '0.7rem',
              letterSpacing: '0.2em',
              color: 'accent.text',
              textTransform: 'uppercase',
              mb: 2,
            }}
          >
            {detail.eyebrow}
          </Box>

          <Typography
            component="h1"
            variant="h1"
            sx={{ fontSize: 'clamp(38px, 5vw, 72px)', fontWeight: 600, lineHeight: 1.02 }}
          >
            {project.title}
          </Typography>

          <Typography
            sx={{
              mt: 2.5,
              maxWidth: 640,
              fontSize: '1.15rem',
              lineHeight: 1.65,
              color: 'text.secondary',
            }}
          >
            {project.summary}
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, mt: 4.5, mb: 7, flexWrap: 'wrap' }}>
            <Button
              ref={liveRef}
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              variant="contained"
              endIcon={<NorthEastIcon sx={{ fontSize: 16 }} />}
              sx={{
                px: 3.25,
                py: 1.5,
                fontSize: '0.9rem',
                bgcolor: 'accent.main',
                color: 'accent.ink',
                transition: 'box-shadow 0.3s',
                '&:hover': {
                  bgcolor: 'accent.main',
                  boxShadow: (theme) => `0 8px 40px ${alpha(theme.palette.accent.main, 0.45)}`,
                },
              }}
            >
              {liveDemo}
            </Button>
            {project.githubUrl ? (
              <Button
                ref={codeRef}
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                variant="outlined"
                endIcon={<NorthEastIcon sx={{ fontSize: 16 }} />}
                sx={{
                  px: 3.125,
                  py: 1.375,
                  fontSize: '0.9rem',
                  color: 'text.primary',
                  borderColor: 'divider',
                  transition: 'border-color 0.25s, color 0.25s',
                  '&:hover': { borderColor: 'accent.main', color: 'accent.text' },
                }}
              >
                {viewCode}
              </Button>
            ) : null}
          </Box>

          {project.screenshots.length > 0 ? (
            <Reveal>
              <ScreenshotCarousel screenshots={project.screenshots} label={project.title} />
            </Reveal>
          ) : null}

          <Box sx={{ mt: 5 }}>
            <DetailRow label={detail.overview}>
              <Typography
                sx={{ m: 0, fontSize: '1.05rem', lineHeight: 1.8, color: 'text.secondary' }}
              >
                {project.longDescription}
              </Typography>
            </DetailRow>

            {project.highlights.length > 0 ? (
              <DetailRow label={detail.highlights}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  {project.highlights.map((highlight) => (
                    <Box
                      key={highlight}
                      sx={{ display: 'flex', gap: 1.75, py: 1.25, alignItems: 'baseline' }}
                    >
                      <Box
                        aria-hidden
                        component="span"
                        sx={{
                          fontFamily: fontFamilies.mono,
                          fontSize: '0.75rem',
                          color: 'accent.text',
                          flex: 'none',
                        }}
                      >
                        →
                      </Box>
                      <Box component="span" sx={{ fontSize: '0.96rem', lineHeight: 1.6 }}>
                        {highlight}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </DetailRow>
            ) : null}

            {project.techStack.length > 0 ? (
              <DetailRow label={detail.technologies} divider={false}>
                <Box sx={{ display: 'flex', gap: 1.25, flexWrap: 'wrap' }}>
                  {project.techStack.map((tech) => (
                    <Box
                      key={tech}
                      component="span"
                      sx={{
                        fontSize: '0.88rem',
                        fontWeight: 500,
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 999,
                        px: 2,
                        py: 1,
                        transition: 'border-color 0.2s, background-color 0.2s',
                        '&:hover': {
                          borderColor: 'accent.main',
                          bgcolor: (theme) => alpha(theme.palette.accent.main, 0.09),
                        },
                      }}
                    >
                      {tech}
                    </Box>
                  ))}
                </Box>
              </DetailRow>
            ) : null}
          </Box>
        </Box>
      </Box>
    </MotionConfig>
  );
}
