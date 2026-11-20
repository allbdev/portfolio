'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DownloadIcon from '@mui/icons-material/Download';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import WestIcon from '@mui/icons-material/West';
import { alpha } from '@mui/material/styles';
import { MotionConfig } from 'framer-motion';
import Link from 'next/link';
import ArchitectureFlow from './ArchitectureFlow';
import CustomCursor from './CustomCursor';
import Reveal from './Reveal';
import ScreenshotCarousel from './ScreenshotCarousel';
import ScrollProgress from './ScrollProgress';
import ThemeControls from './ThemeControls';
import { StatusBadge } from './Projects';
import { fontFamilies } from '../fonts';
import { useMagnetic } from '../hooks/useMagnetic';
import { site } from '../site';
import type { Dictionary } from '../get-dictionary';
import type { Locale } from '../../i18n-config';

type Project = Dictionary['projects']['items'][number];

// Capped near 75 characters a line: the content column is wider than a comfortable measure.
const proseSx = { m: 0, maxWidth: 580, fontSize: '1.05rem', lineHeight: 1.8, color: 'text.secondary' } as const;

/** Same spec as the project cards: mono, hairline pill, display-only. */
const chipSx = {
  fontFamily: fontFamilies.mono,
  fontSize: '0.78rem',
  letterSpacing: '0.04em',
  color: 'text.secondary',
  border: 1,
  borderColor: 'divider',
  borderRadius: 999,
  px: 1.75,
  py: 0.75,
} as const;

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
          letterSpacing: '0.14em',
          color: 'accent.text',
          textTransform: 'uppercase',
          pt: { md: 0.5 },
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
  const { caseStudy } = project;
  const items = dictionary.projects.items;
  const next = items[(items.findIndex((item) => item.slug === project.slug) + 1) % items.length];
  const overview = (
    <DetailRow label={detail.overview}>
      <Typography sx={proseSx}>{project.longDescription}</Typography>
    </DetailRow>
  );
  // With a case study, the long description mostly restates the sections above,
  // so it folds away; the Markdown twin keeps it in full.
  const fullWriteup = (
    <DetailRow label={detail.overview}>
      <Box
        component="details"
        sx={{
          '& > summary': {
            listStyle: 'none',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            minHeight: 44,
            fontWeight: 600,
            color: 'text.primary',
            transition: 'color 0.2s',
            '&::-webkit-details-marker': { display: 'none' },
            '&:hover': { color: 'accent.text' },
            '& svg': { transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1)' },
          },
          '&[open] > summary svg': { transform: 'rotate(90deg)' },
        }}
      >
        <summary>
          <ArrowForwardIcon sx={{ fontSize: 16 }} />
          {detail.fullWriteup}
        </summary>
        <Typography sx={{ ...proseSx, mt: 2 }}>{project.longDescription}</Typography>
      </Box>
    </DetailRow>
  );
  const meta = [project.role, project.period].filter(Boolean) as string[];

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
                fontSize: '0.75rem',
                letterSpacing: '0.06em',
                transition: 'border-color 0.25s, color 0.25s',
                '&:hover': { borderColor: 'accent.main', color: 'accent.text' },
              }}
            >
              {detail.back}
            </Button>
            <ThemeControls lang={lang} />
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

          {meta.length > 0 ? (
            <Box
              component="p"
              sx={{
                m: 0,
                mt: 2,
                display: 'flex',
                flexWrap: 'wrap',
                columnGap: 1.5,
                rowGap: 0.5,
                fontFamily: fontFamilies.mono,
                fontSize: '0.8rem',
                color: 'text.primary',
              }}
            >
              {meta.map((item, index) => (
                <Box component="span" key={item} sx={{ display: 'inline-flex', gap: 1.5 }}>
                  {index > 0 ? (
                    <Box component="span" aria-hidden sx={{ color: 'text.secondary' }}>
                      ·
                    </Box>
                  ) : null}
                  {item}
                </Box>
              ))}
            </Box>
          ) : null}

          <Box sx={{ display: 'flex', gap: 2, mt: 4.5, mb: 7, flexWrap: 'wrap' }}>
            {project.liveUrl ? (
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
            ) : project.status ? (
              <StatusBadge label={project.status} size="lg" shipped={project.shipped} />
            ) : null}
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
            <Box
              component="a"
              href={`/${lang}/projeto/${project.slug}.md`}
              target="_blank"
              rel="alternate"
              type="text/markdown"
              sx={{
                alignSelf: 'center',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                minHeight: 44,
                ml: { sm: 1 },
                fontFamily: fontFamilies.mono,
                fontSize: '0.78rem',
                color: 'text.secondary',
                transition: 'color 0.2s',
                '&:hover': { color: 'accent.text' },
              }}
            >
              {detail.markdown}
              <NorthEastIcon sx={{ fontSize: 14 }} />
            </Box>
          </Box>

          {project.screenshots.length > 0 ? (
            <Reveal>
              <ScreenshotCarousel screenshots={project.screenshots} label={project.title} />
            </Reveal>
          ) : project.architecture ? (
            // No screenshots to show (e.g. work under NDA): the diagram takes their place.
            <Reveal>
              <Box sx={{ border: 1, borderColor: 'divider', borderRadius: '16px', p: { xs: 2.5, md: 4 } }}>
                <ArchitectureFlow architecture={project.architecture} />
              </Box>
            </Reveal>
          ) : null}

          <Box sx={{ mt: 5 }}>
            {caseStudy ? (
              <DetailRow label={detail.problem}>
                <Typography sx={proseSx}>{caseStudy.problem}</Typography>
              </DetailRow>
            ) : (
              overview
            )}

            {project.highlights.length > 0 ? (
              <DetailRow label={caseStudy ? detail.built : detail.highlights}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  {project.highlights.map((highlight) => (
                    <Box
                      key={highlight}
                      sx={{ display: 'flex', gap: 1.75, py: 1.25, alignItems: 'baseline' }}
                    >
                      <ArrowForwardIcon
                        aria-hidden
                        sx={{ fontSize: 15, color: 'accent.text', flex: 'none', alignSelf: 'center' }}
                      />
                      <Box component="span" sx={{ fontSize: '0.96rem', lineHeight: 1.6, maxWidth: 580 }}>
                        {highlight}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </DetailRow>
            ) : null}

            {caseStudy ? (
              <>
                <DetailRow label={detail.hardPart}>
                  <Typography component="h2" sx={{ m: 0, mb: 1.5, fontSize: '1.25rem', fontWeight: 600 }}>
                    {caseStudy.hardPart.title}
                  </Typography>
                  <Typography sx={proseSx}>{caseStudy.hardPart.text}</Typography>
                </DetailRow>
                <DetailRow label={detail.result}>
                  <Typography sx={{ ...proseSx, color: 'text.primary' }}>{caseStudy.result}</Typography>
                </DetailRow>
              </>
            ) : null}

            {project.architecture && project.screenshots.length > 0 ? (
              <DetailRow label={detail.architecture}>
                <ArchitectureFlow architecture={project.architecture} />
              </DetailRow>
            ) : null}

            {caseStudy ? fullWriteup : null}

            {project.techStack.length > 0 ? (
              <DetailRow label={detail.technologies} divider={false}>
                <Box sx={{ display: 'flex', gap: 1.25, flexWrap: 'wrap' }}>
                  {project.techStack.map((tech) => (
                    <Box key={tech} component="span" sx={chipSx}>
                      {tech}
                    </Box>
                  ))}
                </Box>
              </DetailRow>
            ) : null}
          </Box>

          {/* The ending asks for the next step: another study, or contact. */}
          <Box
            component="nav"
            aria-label={detail.next}
            sx={{ mt: { xs: 6, md: 8 }, borderTop: 1, borderColor: 'divider', pt: { xs: 5, md: 6 } }}
          >
            <Box
              component={Link}
              href={`/${lang}/projeto/${next.slug}`}
              sx={{
                display: 'block',
                color: 'text.primary',
                '&:hover .next-title': { color: 'accent.text' },
                '&:hover svg': { transform: 'translateX(6px)' },
              }}
            >
              <Box sx={{ fontFamily: fontFamilies.mono, fontSize: '0.78rem', color: 'text.secondary', mb: 1 }}>
                {detail.next}
              </Box>
              <Box
                className="next-title"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1.5,
                  fontFamily: fontFamilies.display,
                  fontWeight: 600,
                  fontSize: { xs: '1.6rem', md: '2.2rem' },
                  letterSpacing: '-0.02em',
                  lineHeight: 1.15,
                  transition: 'color 0.25s',
                  '& svg': { transition: 'transform 0.35s cubic-bezier(0.22,1,0.36,1)' },
                }}
              >
                {next.title}
                <ArrowForwardIcon sx={{ fontSize: { xs: 26, md: 32 } }} />
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              mt: { xs: 5, md: 6 },
              p: { xs: 3, md: 4 },
              border: 1,
              borderColor: 'divider',
              borderRadius: '16px',
              bgcolor: 'background.paper',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 3,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography sx={{ m: 0, fontFamily: fontFamilies.display, fontWeight: 600, fontSize: '1.3rem', letterSpacing: '-0.01em' }}>
              {dictionary.contact.title}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              <Button
                href={`mailto:${site.email}`}
                variant="contained"
                endIcon={<MailOutlineIcon sx={{ fontSize: 17 }} />}
                sx={{
                  px: 2.75,
                  py: 1.25,
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
                {dictionary.hero.emailCta}
              </Button>
              <Button
                href={site.cv}
                download
                target="_blank"
                variant="outlined"
                endIcon={<DownloadIcon sx={{ fontSize: 17 }} />}
                sx={{
                  px: 2.75,
                  py: 1.125,
                  fontSize: '0.9rem',
                  color: 'text.primary',
                  borderColor: 'divider',
                  transition: 'border-color 0.25s, color 0.25s',
                  '&:hover': { borderColor: 'accent.main', color: 'accent.text' },
                }}
              >
                {dictionary.hero.downloadCv}
              </Button>
            </Box>
          </Box>

          <Box
            component="footer"
            sx={{
              mt: { xs: 6, md: 8 },
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              justifyContent: 'space-between',
              fontFamily: fontFamilies.mono,
              fontSize: '0.75rem',
              color: 'text.secondary',
            }}
          >
            <Box component="span">{dictionary.contact.copyright}</Box>
            <Box component="span">{dictionary.contact.location}</Box>
          </Box>
        </Box>
      </Box>
    </MotionConfig>
  );
}
