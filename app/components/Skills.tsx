'use client';

import Box from '@mui/material/Box';
import SectionHeading from './SectionHeading';
import { fontFamilies } from '../fonts';
import type { Dictionary } from '../get-dictionary';

/** One row per category: mono label on the left, a dot-separated line on the right. */
export default function Skills({ dictionary }: { dictionary: Dictionary }) {
  return (
    <Box
      id="skills"
      component="section"
      sx={{ px: { xs: 3, sm: 5, lg: 8 }, pt: { xs: 10, md: 15 }, pb: 5 }}
    >
      <SectionHeading index="04" title={dictionary.skills.title} mb={3} />

      {dictionary.skills.categories.map((category) => (
        <Box
          key={category.label}
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '240px 1fr' },
            gap: { xs: 2, md: 4 },
            py: { xs: 2.5, md: 3 },
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
          {/* A scannable line per group instead of a wall of pills: every keyword
              stays for recruiters, the first few (the daily drivers) read strongest. */}
          <Box component="p" sx={{ m: 0, fontSize: { xs: '1rem', md: '1.05rem' }, lineHeight: 1.7, maxWidth: 760 }}>
            {category.items.map((item, index) => (
              <Box component="span" key={item}>
                {/* Real spaces around the dot give the line somewhere to wrap. */}
                {index > 0 ? (
                  <>
                    {' '}
                    <Box component="span" aria-hidden sx={{ color: 'text.secondary', mx: 0.5 }}>
                      ·
                    </Box>{' '}
                  </>
                ) : null}
                <Box
                  component="span"
                  sx={{
                    color: index < 4 ? 'text.primary' : 'text.secondary',
                    fontWeight: index < 4 ? 500 : 400,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
