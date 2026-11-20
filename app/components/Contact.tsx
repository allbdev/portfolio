'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DownloadIcon from '@mui/icons-material/Download';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { useState } from 'react';
import { alpha } from '@mui/material/styles';
import AskAI from './AskAI';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';
import { fontFamilies } from '../fonts';
import { site } from '../site';
import { useMagnetic } from '../hooks/useMagnetic';
import type { Dictionary } from '../get-dictionary';

export default function Contact({ dictionary }: { dictionary: Dictionary }) {
  const { contact, navigation, hero } = dictionary;
  const [copied, setCopied] = useState(false);

  // mailto: does nothing for webmail users, so the address is one click to copy.
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // The address is visible on the button, so it can still be selected.
    }
  };
  const emailRef = useMagnetic<HTMLAnchorElement>();
  const linkedinRef = useMagnetic<HTMLAnchorElement>();
  const githubRef = useMagnetic<HTMLAnchorElement>();
  const cvRef = useMagnetic<HTMLAnchorElement>();

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
      sx={{ px: { xs: 3, sm: 5, lg: 8 }, pt: { xs: 10, md: 15 } }}
    >
      <SectionHeading index="05" title={navigation.contact} />

      <Reveal>
        <Typography
          component="p"
          sx={{
            m: 0,
            maxWidth: 820,
            fontFamily: fontFamilies.display,
            fontWeight: 500,
            fontSize: 'clamp(2.1rem, 4.6vw, 4rem)',
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            textWrap: 'balance',
          }}
        >
          {contact.title}
        </Typography>
        <Typography sx={{ mt: 2.5, maxWidth: 560, fontSize: '1.1rem', lineHeight: 1.65, color: 'text.secondary' }}>
          {contact.hiring}
        </Typography>
      </Reveal>

      <Box
        sx={{
          display: 'flex',
          gap: 2,
          alignItems: 'center',
          mt: 4.5,
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
          onClick={copyEmail}
          variant="outlined"
          aria-live="polite"
          startIcon={copied ? <CheckIcon sx={{ fontSize: 16 }} /> : <ContentCopyIcon sx={{ fontSize: 15 }} />}
          sx={{ ...outlinedSx, ...(copied ? { borderColor: 'accent.main', color: 'accent.text' } : null) }}
        >
          {copied ? contact.emailCopied : contact.copyEmail}
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
        <Button
          ref={cvRef}
          href={site.cv}
          download
          target="_blank"
          variant="outlined"
          endIcon={<DownloadIcon sx={{ fontSize: 15 }} />}
          sx={outlinedSx}
        >
          {hero.downloadCv}
        </Button>
      </Box>

      <Box sx={{ mt: { xs: 8, md: 10 } }}>
        <AskAI dictionary={dictionary} />
      </Box>

      <Box
        component="footer"
        sx={{
          mt: { xs: 10, md: 12 },
          borderTop: 1,
          borderColor: 'divider',
          py: 3.5,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 1,
          justifyContent: 'space-between',
          fontFamily: fontFamilies.mono,
          fontSize: '0.75rem',
          letterSpacing: '0.04em',
          color: 'text.secondary',
          // Room for the floating chat button so it never covers the footer text.
          pr: { xs: 9, sm: 10 },
        }}
      >
        <Box component="span">{contact.copyright}</Box>
        <Box component="span">{contact.location}</Box>
      </Box>
    </Box>
  );
}
