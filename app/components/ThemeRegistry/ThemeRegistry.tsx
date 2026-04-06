'use client';
import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import NextAppDirEmotionCacheProvider from './EmotionCache';
import { getTheme } from '../../theme';

const COLOR_MODE_STORAGE_KEY = 'portfolio-color-mode';

export const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

function readStoredColorMode(): 'light' | 'dark' | null {
  if (typeof window === 'undefined') {
    return null;
  }
  const stored = window.localStorage.getItem(COLOR_MODE_STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  return null;
}

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = React.useState<'light' | 'dark'>('light');

  React.useEffect(() => {
    const storedMode = readStoredColorMode();
    if (storedMode) {
      setMode(storedMode);
    }
  }, []);

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((previousMode) => {
          const nextMode = previousMode === 'light' ? 'dark' : 'light';
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(COLOR_MODE_STORAGE_KEY, nextMode);
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
