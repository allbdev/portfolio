'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';
import { fontFamilies } from '../fonts';
import type { Dictionary } from '../get-dictionary';

export default function Experience({ dictionary }: { dictionary: Dictionary }) {
  const { experience } = dictionary;

  return (
    <Box
      id="experience"
      component="section"
      sx={{ px: { xs: 3, sm: 5, lg: 8 }, pt: { xs: 10, md: 15 }, pb: 5 }}
    >
      <SectionHeading index="02" title={experience.title} mb={3} />

      {experience.jobs.map((job) => (
        <Box
          key={`${job.company}-${job.period}`}
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '340px 1fr' },
            gap: { xs: 3, md: 6 },
            py: { xs: 5, md: 7 },
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          <Box>
            <Box sx={{ position: { md: 'sticky' }, top: 96 }}>
              <Box
                sx={{
                  fontFamily: fontFamilies.mono,
                  fontSize: '0.7rem',
                  letterSpacing: '0.12em',
                  color: 'accent.text',
                  mb: 1.75,
                }}
              >
                {job.period}
              </Box>
              <Typography
                component="h3"
                variant="h4"
                sx={{ fontSize: '1.6rem', lineHeight: 1.2 }}
              >
                {job.role}
              </Typography>
              <Typography sx={{ fontSize: '1rem', color: 'text.secondary', mt: 0.75 }}>
                @ {job.company}
              </Typography>
            </Box>
          </Box>

          <Reveal>
            <Typography
              sx={{ m: 0, mb: 3, fontSize: '1.02rem', lineHeight: 1.7, color: 'text.secondary' }}
            >
              {job.description}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {job.achievements.map((achievement) => (
                <Box
                  key={achievement}
                  sx={{
                    display: 'flex',
                    gap: 1.75,
                    py: 1.375,
                    borderTop: 1,
                    borderColor: 'divider',
                    alignItems: 'baseline',
                  }}
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
                  <Box component="span" sx={{ fontSize: '0.94rem', lineHeight: 1.6 }}>
                    {achievement}
                  </Box>
                </Box>
              ))}
            </Box>
          </Reveal>
        </Box>
      ))}

      <Box sx={{ mt: 5 }}>
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
                  transition: 'border-color 0.25s',
                  '&:hover': {
                    borderColor: (theme) => alpha(theme.palette.accent.main, 0.45),
                  },
                }}
              >
                <Box sx={{ fontSize: '0.95rem', fontWeight: 600, lineHeight: 1.4 }}>
                  {item.title}
                </Box>
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
