'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';
import Terminal from './Terminal';
import { fontFamilies } from '../fonts';
import type { Dictionary } from '../get-dictionary';
import type { Locale } from '../../i18n-config';

/** Bio + quick facts on the left, the interactive terminal on the right. */
export default function About({ dictionary, lang }: { dictionary: Dictionary; lang: Locale }) {
  const { about } = dictionary;

  return (
    <Box
      id="about"
      component="section"
      sx={{ px: { xs: 3, sm: 5, lg: 8 }, pt: { xs: 10, md: 15 }, pb: 5 }}
    >
      <SectionHeading index="01" title={about.title} />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1.1fr' },
          gap: { xs: 6, lg: 6, xl: 8 },
          alignItems: 'start',
        }}
      >
        <Box>
          {about.lead.map((paragraph, index) => (
            <Reveal key={index} delay={index * 0.08}>
              <Typography
                sx={{
                  m: 0,
                  mb: 2.5,
                  fontSize: index === 0 ? { xs: '1.15rem', md: '1.25rem' } : '1rem',
                  lineHeight: 1.65,
                  color: index === 0 ? 'text.primary' : 'text.secondary',
                }}
              >
                {paragraph}
              </Typography>
            </Reveal>
          ))}

          <Box
            component="div"
            sx={{
              m: 0,
              mt: 4,
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              border: 1,
              borderColor: 'divider',
              borderRadius: '16px',
              overflow: 'hidden',
            }}
          >
            {about.facts.map((fact, index) => (
              <Reveal key={fact.label} delay={0.1 + index * 0.05} fullHeight>
                <Box
                  sx={{
                    height: '100%',
                    boxSizing: 'border-box',
                    p: 2.5,
                    borderTop: { xs: index === 0 ? 0 : 1, sm: index < 2 ? 0 : 1 },
                    borderLeft: { sm: index % 2 === 1 ? 1 : 0 },
                    borderColor: 'divider',
                    transition: 'background-color 0.25s',
                    '&:hover': { bgcolor: (theme) => alpha(theme.palette.accent.main, 0.04) },
                  }}
                >
                  <Box
                    component="div"
                    sx={{
                      fontFamily: fontFamilies.mono,
                      fontSize: '0.62rem',
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      color: 'text.secondary',
                      mb: 0.75,
                    }}
                  >
                    {fact.label}
                  </Box>
                  <Box
                    component="div"
                    sx={{ m: 0, fontSize: '0.95rem', fontWeight: 500, display: 'flex', gap: 1, alignItems: 'center' }}
                  >
                    {fact.live && <Box component="span" className="live-dot" aria-hidden />}
                    {fact.value}
                  </Box>
                </Box>
              </Reveal>
            ))}
          </Box>
        </Box>

        <Box sx={{ position: { lg: 'sticky' }, top: 96 }}>
          <Terminal dictionary={dictionary} lang={lang} />
        </Box>
      </Box>
    </Box>
  );
}
