'use client';
import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import NextAppDirEmotionCacheProvider from './EmotionCache';
import { getTheme } from '../../theme';

const COLOR_MODE_STORAGE_KEY = 'portfolio-color-mode';

export const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  // Dark is the design's default; the inline script in the root layout resolves
  // the stored/system preference onto <html data-mode> before first paint.
  const [mode, setMode] = React.useState<'light' | 'dark'>('dark');

  React.useEffect(() => {
    let resolved: string | undefined;
    try {
      resolved = window.localStorage.getItem(COLOR_MODE_STORAGE_KEY) ?? undefined;
    } catch {
      // Storage can be unavailable (private mode).
    }
    // Falls back to what the inline script resolved from the system preference.
    if (resolved !== 'light' && resolved !== 'dark') {
      resolved = document.documentElement.dataset.mode;
    }
    if (resolved === 'light' || resolved === 'dark') {
      setMode(resolved);
    }
  }, []);

  React.useEffect(() => {
    document.documentElement.dataset.mode = mode;
  }, [mode]);

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((previousMode) => {
          const nextMode = previousMode === 'light' ? 'dark' : 'light';
          try {
            window.localStorage.setItem(COLOR_MODE_STORAGE_KEY, nextMode);
          } catch {
            // Storage can be unavailable (private mode); the toggle still works.
          }
          return nextMode;
        });
      },
    }),
    [],
  );

  const theme = React.useMemo(() => getTheme(mode), [mode]);

  return (
    <NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </ColorModeContext.Provider>
    </NextAppDirEmotionCacheProvider>
  );
}
