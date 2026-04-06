'use client';
import { alpha, createTheme } from '@mui/material/styles';
import { Inter } from 'next/font/google';

const inter = Inter({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const lightSecondary = '#10b981';
const lightSecondaryContrast = '#042f2e';
const darkSecondary = '#4ade80';
const darkSecondaryContrast = '#052e16';

export const getTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            primary: {
              main: '#2b8cee',
              contrastText: '#ffffff',
            },
            secondary: {
              main: lightSecondary,
              contrastText: lightSecondaryContrast,
              light: '#34d399',
              dark: '#059669',
            },
            success: {
              main: '#059669',
              contrastText: '#ffffff',
            },
            background: {
              default: '#f0f4f8',
              paper: '#ffffff',
            },
            text: {
              primary: '#1e293b',
              secondary: '#64748b',
            },
          }
        : {
            primary: {
              main: '#3b9eff',
              contrastText: '#ffffff',
            },
            secondary: {
              main: darkSecondary,
              contrastText: darkSecondaryContrast,
              light: '#86efac',
              dark: '#22c55e',
            },
            success: {
              main: '#22c55e',
              contrastText: '#052e16',
            },
            background: {
              default: '#0b1220',
              paper: '#151f32',
            },
            text: {
              primary: '#f8fafc',
              secondary: '#94a3b8',
            },
          }),
    },
    typography: {
      fontFamily: inter.style.fontFamily,
      h1: {
        fontWeight: 700,
      },
      h2: {
        fontWeight: 600,
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            transition: 'box-shadow 0.2s ease, transform 0.2s ease',
          },
          containedPrimary: ({ theme }) => ({
            boxShadow: `0 4px 18px ${alpha(theme.palette.secondary.main, mode === 'dark' ? 0.45 : 0.28)}`,
            '&:hover': {
              boxShadow: `0 6px 26px ${alpha(theme.palette.secondary.main, mode === 'dark' ? 0.55 : 0.38)}`,
            },
          }),
        },
      },
      MuiCard: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 16,
            border: `1px solid ${alpha(theme.palette.primary.main, mode === 'light' ? 0.12 : 0.2)}`,
            backgroundImage: 'none',
            boxShadow:
              mode === 'light'
                ? `0 4px 6px -1px ${alpha('#000000', 0.08)}, 0 2px 4px -2px ${alpha('#000000', 0.06)}`
                : `0 4px 6px -1px ${alpha('#000000', 0.45)}, 0 0 0 1px ${alpha(theme.palette.secondary.main, 0.06)}`,
            transition: theme.transitions.create(['box-shadow', 'border-color', 'transform'], {
              duration: theme.transitions.duration.shorter,
            }),
            '&:hover': {
              borderColor: alpha(theme.palette.secondary.main, mode === 'light' ? 0.45 : 0.5),
              boxShadow: `0 8px 32px ${alpha(theme.palette.secondary.main, mode === 'dark' ? 0.22 : 0.14)}, 0 0 0 1px ${alpha(theme.palette.secondary.main, 0.12)}`,
            },
          }),
        },
      },
      MuiChip: {
        styleOverrides: {
          outlined: ({ theme }) => ({
            borderColor: alpha(theme.palette.secondary.main, 0.45),
            color: theme.palette.secondary.main,
            '&:hover': {
              backgroundColor: alpha(theme.palette.secondary.main, mode === 'light' ? 0.08 : 0.12),
            },
          }),
          filled: ({ theme }) => ({
            backgroundColor: alpha(theme.palette.secondary.main, mode === 'light' ? 0.14 : 0.2),
            color: theme.palette.secondary.contrastText,
            '&:hover': {
              backgroundColor: alpha(theme.palette.secondary.main, mode === 'light' ? 0.22 : 0.28),
            },
          }),
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  });
