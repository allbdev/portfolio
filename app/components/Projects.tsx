'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import { alpha } from '@mui/material/styles';
import Image from 'next/image';
import Link from 'next/link';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';
import SpotlightCard from './SpotlightCard';
import { fontFamilies } from '../fonts';
import { useMagnetic } from '../hooks/useMagnetic';
import type { Dictionary } from '../get-dictionary';
import type { Locale } from '../../i18n-config';

type Project = Dictionary['projects']['items'][number];

const chipSx = {
  fontFamily: fontFamilies.mono,
  fontSize: '0.66rem',
  letterSpacing: '0.06em',
  color: 'text.secondary',
  border: 1,
  borderColor: 'divider',
  borderRadius: 999,
  px: 1.375,
  py: 0.625,
} as const;

const inlineLinkSx = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 0.75,
  fontSize: '0.88rem',
  fontWeight: 600,
  color: 'text.secondary',
  transition: 'color 0.2s',
  '&:hover': { color: 'accent.text' },
} as const;

function TechChips({ items }: { items: string[] }) {
  return (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
      {items.map((tech) => (
        <Box key={tech} component="span" sx={chipSx}>
          {tech}
        </Box>
      ))}
    </Box>
  );
}

function FeaturedProject({
  project,
  dictionary,
  lang,
}: {
  project: Project;
  dictionary: Dictionary;
  lang: Locale;
}) {
  const ctaRef = useMagnetic<HTMLAnchorElement>();
  const shot = project.screenshots[0];

  return (
    <SpotlightCard
      sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '5fr 7fr' } }}
    >
      <Box
        sx={{
          p: { xs: 3.5, md: 5.5 },
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Box
          sx={{
            fontFamily: fontFamilies.mono,
            fontSize: '0.65rem',
            letterSpacing: '0.18em',
            color: 'accent.text',
            textTransform: 'uppercase',
            mb: 2.25,
          }}
        >
          {dictionary.projects.featuredLabel}
        </Box>
        <Typography component="h3" variant="h3" sx={{ mb: 1.75, fontSize: { xs: '1.7rem', md: '2.1rem' } }}>
          {project.title}
        </Typography>
        <Typography sx={{ m: 0, fontSize: '1rem', lineHeight: 1.65, color: 'text.secondary' }}>
          {project.summary}
        </Typography>
        <Box sx={{ mt: 2.75 }}>
          <TechChips items={project.techStack.slice(0, 6)} />
        </Box>
        <Box sx={{ flex: 1, minHeight: 24 }} />
        <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'center', flexWrap: 'wrap', mt: 3.5 }}>
          <Button
            ref={ctaRef}
            component={Link}
            href={`/${lang}/projeto/${project.slug}`}
            variant="contained"
            endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
            sx={{
              px: 2.75,
              py: 1.375,
              fontSize: '0.88rem',
              bgcolor: 'accent.main',
              color: 'accent.ink',
              transition: 'box-shadow 0.3s',
              '&:hover': {
                bgcolor: 'accent.main',
                boxShadow: (theme) => `0 6px 30px ${alpha(theme.palette.accent.main, 0.4)}`,
              },
            }}
          >
            {dictionary.projects.viewDetails}
          </Button>
          <Box component="a" href={project.liveUrl} target="_blank" rel="noreferrer" sx={inlineLinkSx}>
            {dictionary.projects.liveDemo}
            <NorthEastIcon sx={{ fontSize: 15 }} />
          </Box>
        </Box>
      </Box>

      <Box
        className="shot"
        sx={{
          position: 'relative',
          overflow: 'hidden',
          minHeight: { xs: 240, sm: 320, md: 420 },
          borderLeft: { md: 1 },
          borderTop: { xs: 1, md: 0 },
          borderColor: { xs: 'divider', md: 'divider' },
        }}
      >
        <Image
          src={shot.src}
          alt={shot.alt}
          fill
          priority
          sizes="(max-width: 900px) 100vw, 55vw"
          style={{ objectFit: 'cover', objectPosition: 'left top' }}
        />
      </Box>
    </SpotlightCard>
  );
}

function SecondaryProject({
  project,
  dictionary,
  lang,
}: {
  project: Project;
  dictionary: Dictionary;
  lang: Locale;
}) {
  const shot = project.screenshots[0];

  return (
    <SpotlightCard
      glow={420}
      sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      <Box
        className="shot"
        sx={{
          position: 'relative',
          overflow: 'hidden',
          aspectRatio: '16 / 9',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Image
          src={shot.src}
          alt={shot.alt}
          fill
          sizes="(max-width: 900px) 100vw, 45vw"
          style={{ objectFit: 'cover', objectPosition: 'center top' }}
        />
      </Box>
      <Box
        sx={{
          p: 3.75,
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Typography component="h3" variant="h4" sx={{ mb: 1.25, fontSize: '1.45rem' }}>
          {project.title}
        </Typography>
        <Typography sx={{ m: 0, fontSize: '0.95rem', lineHeight: 1.6, color: 'text.secondary' }}>
          {project.summary}
        </Typography>
        <Box sx={{ mt: 2.25 }}>
          <TechChips items={project.techStack.slice(0, 5)} />
        </Box>
        <Box sx={{ flex: 1, minHeight: 20 }} />
        <Box sx={{ display: 'flex', gap: 2.25, alignItems: 'center', flexWrap: 'wrap', mt: 3 }}>
          <Box
            component={Link}
            href={`/${lang}/projeto/${project.slug}`}
            sx={{ ...inlineLinkSx, color: 'text.primary' }}
          >
            {dictionary.projects.viewDetails}
            <ArrowForwardIcon sx={{ fontSize: 15 }} />
          </Box>
          <Box component="a" href={project.liveUrl} target="_blank" rel="noreferrer" sx={inlineLinkSx}>
            {dictionary.projects.liveDemo}
            <NorthEastIcon sx={{ fontSize: 15 }} />
          </Box>
          {project.githubUrl ? (
            <Box component="a" href={project.githubUrl} target="_blank" rel="noreferrer" sx={inlineLinkSx}>
              {dictionary.projects.code}
              <NorthEastIcon sx={{ fontSize: 15 }} />
            </Box>
          ) : null}
        </Box>
      </Box>
    </SpotlightCard>
  );
}

export default function Projects({
  dictionary,
  lang,
}: {
  dictionary: Dictionary;
  lang: Locale;
}) {
  const [featured, ...secondary] = dictionary.projects.items;

  return (
    <Box
      id="projects"
      component="section"
      sx={{ px: { xs: 3, sm: 5, lg: 8 }, pt: { xs: 10, md: 15 }, pb: 5 }}
    >
      <SectionHeading index="01" title={dictionary.projects.title} />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {featured ? (
          <Reveal>
            <FeaturedProject project={featured} dictionary={dictionary} lang={lang} />
          </Reveal>
        ) : null}

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 4,
          }}
        >
          {secondary.map((project, index) => (
            <Reveal key={project.slug} delay={index * 0.08} fullHeight>
              <SecondaryProject project={project} dictionary={dictionary} lang={lang} />
            </Reveal>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
