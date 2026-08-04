'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@mui/material/styles';
import { ColorModeContext } from './ThemeRegistry/ThemeRegistry';
import { fontFamilies } from '../fonts';
import { i18n, type Locale } from '../../i18n-config';

const controlSx = {
  height: 34,
  borderRadius: '10px',
  border: 1,
  borderColor: 'divider',
  color: 'text.secondary',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'border-color 0.2s, color 0.2s',
  '&:hover': { borderColor: 'accent.main', color: 'accent.text' },
} as const;

/** Theme and language toggles, shared by the sidebar and the project detail page. */
export default function ThemeControls({ lang }: { lang: Locale }) {
  const theme = useTheme();
  const { toggleColorMode } = React.useContext(ColorModeContext);
  const pathname = usePathname();

  const other = (i18n.locales.find((locale) => locale !== lang) ?? i18n.defaultLocale) as Locale;

  // Swap the locale segment, keeping the rest of the route intact.
  const segments = (pathname || `/${lang}`).split('/');
  segments[1] = other;
  const otherHref = segments.join('/') || `/${other}`;

  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <ButtonBase
        onClick={toggleColorMode}
        aria-label={theme.palette.mode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        sx={{ ...controlSx, width: 34 }}
      >
        {theme.palette.mode === 'dark' ? (
          <LightModeOutlinedIcon sx={{ fontSize: 17 }} />
        ) : (
          <DarkModeOutlinedIcon sx={{ fontSize: 17 }} />
        )}
      </ButtonBase>

      <ButtonBase
        component={Link}
        href={otherHref}
        hrefLang={other}
        aria-label={`Switch language to ${other.toUpperCase()}`}
        sx={{
          ...controlSx,
          px: 1.5,
          fontFamily: fontFamilies.mono,
          fontSize: '0.68rem',
          letterSpacing: '0.1em',
        }}
      >
        {lang.toUpperCase()} → {other.toUpperCase()}
      </ButtonBase>
    </Box>
  );
}
