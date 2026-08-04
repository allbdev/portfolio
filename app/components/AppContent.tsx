'use client';

import Box from '@mui/material/Box';
import { MotionConfig } from 'framer-motion';
import Contact from './Contact';
import CustomCursor from './CustomCursor';
import Experience from './Experience';
import Hero from './Hero';
import Marquee from './Marquee';
import Projects from './Projects';
import ScrollProgress from './ScrollProgress';
import Sidebar, { MOBILE_BAR_HEIGHT, SIDEBAR_WIDTH } from './Sidebar';
import Skills from './Skills';
import type { Dictionary } from '../get-dictionary';
import type { Locale } from '../../i18n-config';

export default function AppContent({
  dictionary,
  lang,
}: {
  dictionary: Dictionary;
  lang: Locale;
}) {
  return (
    <MotionConfig reducedMotion="user">
      <Box
        sx={{
          display: 'flex',
          minHeight: '100vh',
          bgcolor: 'background.default',
          color: 'text.primary',
        }}
      >
        <ScrollProgress />
        <CustomCursor />
        <Sidebar dictionary={dictionary} lang={lang} />

        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            ml: { lg: `${SIDEBAR_WIDTH}px` },
            pt: { xs: `${MOBILE_BAR_HEIGHT}px`, lg: 0 },
          }}
        >
          <main>
            <Hero dictionary={dictionary} />
            <Marquee />
            <Projects dictionary={dictionary} lang={lang} />
            <Experience dictionary={dictionary} />
            <Skills dictionary={dictionary} />
            <Contact dictionary={dictionary} />
          </main>
        </Box>
      </Box>
    </MotionConfig>
  );
}
