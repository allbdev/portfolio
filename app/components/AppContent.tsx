'use client';

import * as React from 'react';
import Header from './Header';
import Hero from './Hero';
import Skills from './Skills';
import Projects from './Projects';
import Experience from './Experience';
import Contact from './Contact';
import AmbientBackground from './AmbientBackground';
import CursorGlow from './CursorGlow';
import ScrollProgress from './ScrollProgress';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { ColorModeContext } from './ThemeRegistry/ThemeRegistry';
import { Dictionary } from '../get-dictionary';

export default function AppContent({
  dictionary,
}: {
  dictionary: Dictionary;
}) {
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <ScrollProgress />
      <AmbientBackground />
      <CursorGlow />
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          color: 'text.primary',
          minHeight: '100vh',
        }}
      >
        <Header
          dictionary={dictionary}
          mode={theme.palette.mode}
          toggleColorMode={colorMode.toggleColorMode}
        />
        <main>
          <Hero dictionary={dictionary} />
          <Skills dictionary={dictionary} />
          <Projects dictionary={dictionary} />
          <Experience dictionary={dictionary} />
          <Contact dictionary={dictionary} />
        </main>
      </Box>
    </Box>
  );
}
