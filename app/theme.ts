'use client';
import { createTheme } from '@mui/material/styles';
import { fontFamilies } from './fonts';

/** Single accent used for every emphasis in the design. */
const ACCENT = '#34d399';
const ACCENT_INK = '#071a10';

const palettes = {
  dark: {
    bg: '#0a0e13',
    panel: '#10151c',
    panelAlt: '#131a22',
    line: 'rgba(151, 166, 180, 0.14)',
    text1: '#e9eef3',
    text2: '#8fa0ae',
    // The raw accent is legible on the dark background.
    accentText: ACCENT,
  },
  light: {
    bg: '#f2f4f6',
    panel: '#ffffff',
    panelAlt: '#e9edf1',
    line: 'rgba(20, 32, 44, 0.13)',
    text1: '#16202a',
    text2: '#5b6b78',
    // #34d399 only reaches ~1.9:1 on the light background, so small accent text
    // uses a darker green (4.8:1) while fills and borders keep the raw accent.
    accentText: '#067a55',
  },
} as const;

declare module '@mui/material/styles' {
  interface Palette {
    accent: { main: string; ink: string; text: string };
    panelAlt: string;
  }
  interface PaletteOptions {
    accent?: { main: string; ink: string; text: string };
    panelAlt?: string;
  }
}

export const getTheme = (mode: 'light' | 'dark') => {
  const t = palettes[mode];

  return createTheme({
    shape: { borderRadius: 12 },
    palette: {
      mode,
      primary: { main: ACCENT, contrastText: ACCENT_INK },
      secondary: { main: ACCENT, contrastText: ACCENT_INK },
      accent: { main: ACCENT, ink: ACCENT_INK, text: t.accentText },
      panelAlt: t.panelAlt,
      divider: t.line,
      background: { default: t.bg, paper: t.panel },
      text: { primary: t.text1, secondary: t.text2 },
    },
    typography: {
      fontFamily: fontFamilies.body,
      h1: { fontFamily: fontFamilies.display, fontWeight: 500, letterSpacing: '-0.03em' },
      h2: { fontFamily: fontFamilies.display, fontWeight: 600, letterSpacing: '-0.02em' },
      h3: { fontFamily: fontFamilies.display, fontWeight: 600, letterSpacing: '-0.02em' },
      h4: { fontFamily: fontFamilies.display, fontWeight: 600, letterSpacing: '-0.02em' },
      h5: { fontFamily: fontFamilies.display, fontWeight: 600, letterSpacing: '-0.01em' },
      h6: { fontFamily: fontFamilies.display, fontWeight: 600, letterSpacing: '-0.01em' },
      button: { textTransform: 'none', fontWeight: 600 },
      overline: { fontFamily: fontFamilies.mono, letterSpacing: '0.18em' },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: t.bg,
            transition: 'background-color 0.3s ease, color 0.3s ease',
          },
          '::selection': {
            backgroundColor: `${ACCENT}59`,
          },
          a: { color: 'inherit', textDecoration: 'none' },
          img: { maxWidth: '100%' },
        },
      },
      MuiPaper: {
        styleOverrides: { root: { backgroundImage: 'none' } },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: { borderRadius: 12 },
        },
      },
    },
  });
};
