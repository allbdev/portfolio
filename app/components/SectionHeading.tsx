'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { fontFamilies } from '../fonts';

type SectionHeadingProps = {
  /** Two-digit section number, e.g. "01". */
  index: string;
  title: string;
  mb?: number;
};

/** Mono section number, display title, and a rule that runs to the edge. */
export default function SectionHeading({ index, title, mb = 7 }: SectionHeadingProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2.5, mb }}>
      <Box
        component="span"
        sx={{
          fontFamily: fontFamilies.mono,
          fontSize: '0.75rem',
          color: 'accent.text',
          flex: 'none',
        }}
      >
        {index}
      </Box>
      <Typography
        component="h2"
        variant="h2"
        sx={{ m: 0, fontSize: { xs: '1.9rem', sm: '2.2rem', md: '2.6rem' } }}
      >
        {title}
      </Typography>
      <Box
        aria-hidden
        sx={{ flex: 1, height: '1px', bgcolor: 'divider', alignSelf: 'center', minWidth: 24 }}
      />
    </Box>
  );
}
