'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import { alpha } from '@mui/material/styles';
import Reveal from './Reveal';
import { fontFamilies } from '../fonts';
import { site } from '../site';
import { useMagnetic } from '../hooks/useMagnetic';
import type { Dictionary } from '../get-dictionary';

export default function Contact({ dictionary }: { dictionary: Dictionary }) {
  const { contact, navigation } = dictionary;
  const emailRef = useMagnetic<HTMLAnchorElement>();
  const linkedinRef = useMagnetic<HTMLAnchorElement>();
  const githubRef = useMagnetic<HTMLAnchorElement>();

  const outlinedSx = {
    px: 3.5,
    py: 1.75,
    fontSize: '0.92rem',
    color: 'text.primary',
    borderColor: 'divider',
    transition: 'border-color 0.25s, color 0.25s',
    '&:hover': { borderColor: 'accent.main', color: 'accent.text' },
  } as const;

  return (
    <Box
      id="contact"
      component="section"
      sx={{ px: { xs: 3, sm: 5, lg: 8 }, pt: { xs: 12, md: 17.5 }, textAlign: 'center' }}
    >
      <Box
        sx={{
          fontFamily: fontFamilies.mono,
          fontSize: '0.72rem',
          letterSpacing: '0.22em',
          color: 'accent.text',
          textTransform: 'uppercase',
          mb: 3,
        }}
      >
        04 — {navigation.contact}
      </Box>

      <Reveal>
        <Typography
          component="h2"
          variant="h2"
          sx={{
            mx: 'auto',
            maxWidth: 900,
            fontSize: 'clamp(38px, 5.5vw, 76px)',
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
          }}
        >
          {contact.title}
        </Typography>
      </Reveal>

      <Box
        sx={{
          display: 'flex',
          gap: 2,
          justifyContent: 'center',
          mt: 6,
          flexWrap: 'wrap',
        }}
      >
        <Button
          ref={emailRef}
          href={`mailto:${site.email}`}
          variant="contained"
          sx={{
            px: 4,
            py: 1.875,
            fontFamily: fontFamilies.mono,
            fontSize: '0.9rem',
            fontWeight: 500,
            bgcolor: 'accent.main',
            color: 'accent.ink',
            transition: 'box-shadow 0.3s',
            '&:hover': {
              bgcolor: 'accent.main',
              boxShadow: (theme) => `0 8px 44px ${alpha(theme.palette.accent.main, 0.45)}`,
            },
          }}
        >
          {site.email}
        </Button>
        <Button
          ref={linkedinRef}
          href={site.linkedin}
          target="_blank"
          rel="noreferrer"
          variant="outlined"
          endIcon={<NorthEastIcon sx={{ fontSize: 15 }} />}
          sx={outlinedSx}
        >
          LinkedIn
        </Button>
        <Button
          ref={githubRef}
          href={site.github}
          target="_blank"
          rel="noreferrer"
          variant="outlined"
          endIcon={<NorthEastIcon sx={{ fontSize: 15 }} />}
          sx={outlinedSx}
        >
          GitHub
        </Button>
      </Box>

      <Box
        component="footer"
        sx={{
          mt: 15,
          borderTop: 1,
          borderColor: 'divider',
          py: 3.5,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 1,
          justifyContent: 'space-between',
          fontFamily: fontFamilies.mono,
          fontSize: '0.65rem',
          letterSpacing: '0.1em',
          color: 'text.secondary',
        }}
      >
        <Box component="span">{contact.copyright}</Box>
        <Box component="span">{contact.location}</Box>
      </Box>
    </Box>
  );
}
