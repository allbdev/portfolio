'use client';

import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import SectionHeading from './SectionHeading';
import { fontFamilies } from '../fonts';
import type { Dictionary } from '../get-dictionary';

/** One row per category: mono label on the left, pills on the right. */
export default function Skills({ dictionary }: { dictionary: Dictionary }) {
  return (
    <Box
      id="skills"
      component="section"
      sx={{ px: { xs: 3, sm: 5, lg: 8 }, pt: { xs: 10, md: 15 }, pb: 5 }}
    >
      <SectionHeading index="03" title={dictionary.skills.title} mb={3} />

      {dictionary.skills.categories.map((category) => (
        <Box
          key={category.label}
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '240px 1fr' },
            gap: { xs: 2, md: 4 },
            py: 3.5,
            borderTop: 1,
            borderColor: 'divider',
            alignItems: 'baseline',
          }}
        >
          <Box
            sx={{
              fontFamily: fontFamilies.mono,
              fontSize: '0.72rem',
              letterSpacing: '0.14em',
              color: 'text.secondary',
              textTransform: 'uppercase',
            }}
          >
            {category.label}
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25 }}>
            {category.items.map((item) => (
              <Box
                key={item}
                component="span"
                sx={{
                  fontSize: '0.88rem',
                  fontWeight: 500,
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 999,
                  px: 2,
                  py: 1,
                  transition: 'border-color 0.2s, background-color 0.2s, transform 0.2s',
                  '&:hover': {
                    borderColor: 'accent.main',
                    bgcolor: (theme) => alpha(theme.palette.accent.main, 0.09),
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                {item}
              </Box>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
