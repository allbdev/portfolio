'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import { alpha } from '@mui/material/styles';
import Image from 'next/image';
import Link from 'next/link';
import ArchitectureFlow from './ArchitectureFlow';
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
  fontSize: '0.72rem',
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
  minHeight: 44,
  fontSize: '0.88rem',
  fontWeight: 600,
  color: 'text.secondary',
  transition: 'color 0.2s',
  '&:hover': { color: 'accent.text' },
} as const;

/** "In development" badge, shown where the live link would be. */
export function StatusBadge({
  label,
  size = 'sm',
  shipped = false,
}: {
  label: string;
  size?: 'sm' | 'lg';
  /** Calm, non-blinking accent badge for work that is live but not public. */
  shipped?: boolean;
}) {
  // One Signal: shipped work gets the accent, work in progress stays neutral.
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
        fontFamily: fontFamilies.mono,
        fontSize: size === 'lg' ? '0.8rem' : '0.72rem',
        letterSpacing: '0.04em',
        color: shipped ? 'accent.text' : 'text.secondary',
        border: 1,
        borderColor: (theme) => (shipped ? alpha(theme.palette.accent.main, 0.4) : theme.palette.divider),
        bgcolor: (theme) => (shipped ? alpha(theme.palette.accent.main, 0.08) : 'transparent'),
        borderRadius: 999,
        px: size === 'lg' ? 2 : 1.5,
        py: size === 'lg' ? 1.25 : 0.75,
      }}
    >
      <Box
        component="span"
        aria-hidden
        sx={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          boxSizing: 'border-box',
          ...(shipped ? { bgcolor: 'accent.main' } : { border: '1.5px solid', borderColor: 'text.secondary' }),
        }}
      />
      {label}
    </Box>
  );
}

function LiveOrStatus({ project, label }: { project: Project; label: string }) {
  if (!project.liveUrl) {
    return project.status ? <StatusBadge label={project.status} shipped={project.shipped} /> : null;
  }
  return (
    <Box component="a" href={project.liveUrl} target="_blank" rel="noreferrer" sx={inlineLinkSx}>
      {label}
      <NorthEastIcon sx={{ fontSize: 15 }} />
    </Box>
  );
}

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

/** The card's picture: the first screenshot, or the architecture when there is none (or it is preferred). */
function CardVisual({
  project,
  sizes,
  position,
  priority,
}: {
  project: Project;
  sizes: string;
  position: string;
  priority?: boolean;
}) {
  const shot = project.screenshots[0];
  if (project.architecture && (!shot || project.architecture.onCard)) {
    return (
      <Box
        sx={(theme) => ({
          // In flow (not absolute) so a tall diagram grows the card instead of clipping.
          position: 'relative',
          width: '100%',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 3, md: 4 },
          backgroundImage: `radial-gradient(${alpha(theme.palette.text.primary, 0.1)} 1px, transparent 1.2px)`,
          backgroundSize: '22px 22px',
        })}
      >
        <Box sx={{ width: '100%', maxWidth: 360 }}>
          <ArchitectureFlow architecture={project.architecture} compact />
        </Box>
      </Box>
    );
  }
  if (!shot) return null;
  return (
    <Image
      src={shot.src}
      alt={shot.alt}
      fill
      priority={priority}
      sizes={sizes}
      style={{ objectFit: 'cover', objectPosition: position }}
    />
  );
}

function FeaturedProject({
  project,
  dictionary,
  lang,
  priority,
}: {
  project: Project;
  dictionary: Dictionary;
  lang: Locale;
  priority?: boolean;
}) {
  const ctaRef = useMagnetic<HTMLAnchorElement>();

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
        <Typography component="h3" variant="h3" sx={{ mb: 1, fontSize: { xs: '1.9rem', md: '2.4rem' } }}>
          {project.title}
        </Typography>
        {project.eyebrow ? (
          <Box sx={{ fontFamily: fontFamilies.mono, fontSize: '0.78rem', color: 'accent.text', mb: 2.25 }}>
            {project.eyebrow}
          </Box>
        ) : null}
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
          <LiveOrStatus project={project} label={dictionary.projects.liveDemo} />
        </Box>
      </Box>

      <Box
        className="shot"
        sx={{
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          minHeight: { xs: project.screenshots.length ? 240 : 460, sm: 320, md: 420 },
          borderLeft: { md: 1 },
          borderTop: { xs: 1, md: 0 },
          borderColor: { xs: 'divider', md: 'divider' },
        }}
      >
        <CardVisual
          project={project}
          priority={priority}
          sizes="(max-width: 900px) 100vw, 55vw"
          position="left top"
        />
      </Box>
    </SpotlightCard>
  );
}

function SecondaryProject({
  project,
  dictionary,
  lang,
  wide = false,
}: {
  project: Project;
  dictionary: Dictionary;
  lang: Locale;
  /** Spans both columns, picture beside the text, so an odd last card doesn't sit alone. */
  wide?: boolean;
}) {
  return (
    <SpotlightCard
      glow={420}
      sx={{
        display: wide ? { xs: 'flex', md: 'grid' } : 'flex',
        flexDirection: 'column',
        gridTemplateColumns: wide ? { md: '1fr 1fr' } : undefined,
        height: '100%',
      }}
    >
      <Box
        className="shot"
        sx={{
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          aspectRatio: project.architecture?.onCard ? undefined : wide ? { xs: '16 / 9', md: 'auto' } : '16 / 9',
          minHeight: project.architecture?.onCard ? { xs: 400, sm: 300 } : wide ? { md: 320 } : undefined,
          // The picture keeps its height: a tall diagram grows the card instead of being clipped.
          flexShrink: 0,
          // Longhands: a responsive border shorthand would reset the colour.
          borderStyle: 'solid',
          borderWidth: 0,
          borderBottomWidth: wide ? { xs: 1, md: 0 } : 1,
          borderRightWidth: wide ? { md: 1 } : 0,
          borderColor: 'divider',
        }}
      >
        <CardVisual project={project} sizes="(max-width: 900px) 100vw, 45vw" position={wide ? 'left top' : 'center top'} />
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
          <LiveOrStatus project={project} label={dictionary.projects.liveDemo} />
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

/** Compact card for the Lab strip. */
function LabProject({
  project,
  dictionary,
  lang,
}: {
  project: Project;
  dictionary: Dictionary;
  lang: Locale;
}) {
  return (
    <SpotlightCard glow={300} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box
        className="shot"
        sx={{ position: 'relative', overflow: 'hidden', aspectRatio: '16 / 9', borderBottom: 1, borderColor: 'divider' }}
      >
        <CardVisual project={project} sizes="(max-width: 900px) 100vw, 30vw" position="center top" />
      </Box>
      <Box sx={{ p: 2.75, display: 'flex', flexDirection: 'column', flex: 1, position: 'relative', zIndex: 2 }}>
        <Typography component="h4" variant="h5" sx={{ mb: 1, fontSize: '1.1rem' }}>
          {project.title}
        </Typography>
        <Typography sx={{ m: 0, fontSize: '0.86rem', lineHeight: 1.55, color: 'text.secondary' }}>
          {project.summary}
        </Typography>
        <Box sx={{ flex: 1, minHeight: 16 }} />
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', mt: 2.25 }}>
          <Box component={Link} href={`/${lang}/projeto/${project.slug}`} sx={{ ...inlineLinkSx, color: 'text.primary' }}>
            {dictionary.projects.viewDetails}
            <ArrowForwardIcon sx={{ fontSize: 15 }} />
          </Box>
          <LiveOrStatus project={project} label={dictionary.projects.liveDemo} />
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
  const { items, lab } = dictionary.projects;
  // One featured card (the first with a meta line); everything else outside the Lab is secondary.
  const featured = items.filter((project) => project.eyebrow && !project.lab).slice(0, 1);
  const secondary = items.filter((project) => !project.lab && !featured.includes(project));
  const labItems = items.filter((project) => project.lab);

  return (
    <Box
      id="projects"
      component="section"
      sx={{ px: { xs: 3, sm: 5, lg: 8 }, pt: { xs: 10, md: 15 }, pb: 5 }}
    >
      <SectionHeading index="02" title={dictionary.projects.title} />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {featured.map((project, index) => (
          <Reveal key={project.slug}>
            <FeaturedProject project={project} dictionary={dictionary} lang={lang} priority={index === 0} />
          </Reveal>
        ))}

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 4,
          }}
        >
          {secondary.map((project, index) => {
            const wide = secondary.length % 2 === 1 && index === secondary.length - 1;
            return (
              <Box key={project.slug} sx={wide ? { gridColumn: { md: '1 / -1' } } : undefined}>
                <Reveal delay={index * 0.08} fullHeight>
                  <SecondaryProject project={project} dictionary={dictionary} lang={lang} wide={wide} />
                </Reveal>
              </Box>
            );
          })}
        </Box>

        {labItems.length > 0 ? (
          <Box sx={{ mt: { xs: 4, md: 6 } }}>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, flexWrap: 'wrap', mb: 3 }}>
              <Typography component="h3" variant="h4" sx={{ fontSize: '1.35rem' }}>
                {lab.title}
              </Typography>
              <Typography sx={{ m: 0, fontSize: '0.92rem', color: 'text.secondary' }}>{lab.text}</Typography>
            </Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' },
                gap: 3,
              }}
            >
              {labItems.map((project, index) => (
                <Reveal key={project.slug} delay={index * 0.06} fullHeight>
                  <LabProject project={project} dictionary={dictionary} lang={lang} />
                </Reveal>
              ))}
            </Box>
          </Box>
        ) : null}
      </Box>
    </Box>
  );
}
