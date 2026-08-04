'use client';

import Box from '@mui/material/Box';
import { fontFamilies } from '../fonts';
import { site } from '../site';

const line = `${site.marquee.join(' ◦ ')} ◦ `;

/** Rule-bounded band of tech names scrolling continuously under the hero. */
export default function Marquee() {
  return (
    <Box
      aria-hidden
      sx={{
        borderTop: 1,
        borderBottom: 1,
        borderColor: 'divider',
        overflow: 'hidden',
        py: 2,
        whiteSpace: 'nowrap',
      }}
    >
      <Box
        sx={{
          display: 'inline-flex',
          animation: 'marquee 36s linear infinite',
          willChange: 'transform',
        }}
      >
        {[0, 1].map((copy) => (
          <Box
            key={copy}
            component="span"
            sx={{
              fontFamily: fontFamilies.mono,
              fontSize: '0.78rem',
              letterSpacing: '0.2em',
              color: 'text.secondary',
              textTransform: 'uppercase',
              pr: 3,
            }}
          >
            {line}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
