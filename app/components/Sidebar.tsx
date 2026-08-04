'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import { alpha } from '@mui/material/styles';
import SocialLinks from './SocialLinks';
import ThemeControls from './ThemeControls';
import { fontFamilies } from '../fonts';
import { sections, site } from '../site';
import { useActiveSection } from '../hooks/useActiveSection';
import type { Dictionary } from '../get-dictionary';
import type { Locale } from '../../i18n-config';

export const SIDEBAR_WIDTH = 232;
export const MOBILE_BAR_HEIGHT = 64;

const sectionIds = sections.map((section) => section.id);

function Wordmark({ role }: { role: string }) {
  return (
    <Box>
      <Box
        sx={{
          fontFamily: fontFamilies.display,
          fontWeight: 700,
          fontSize: '1.05rem',
          letterSpacing: '-0.01em',
          lineHeight: 1.3,
        }}
      >
        {site.firstName}
        <br />
        {site.lastName}
      </Box>
      <Box
        sx={{
          fontFamily: fontFamilies.mono,
          fontSize: '0.65rem',
          letterSpacing: '0.12em',
          color: 'accent.text',
          mt: 1.25,
          textTransform: 'uppercase',
        }}
      >
        {role}
      </Box>
    </Box>
  );
}

function NavLinks({
  dictionary,
  active,
  onNavigate,
}: {
  dictionary: Dictionary;
  active: string;
  onNavigate?: () => void;
}) {
  return (
    <Box component="nav" sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
      {sections.map((section) => {
        const isActive = active === section.id;
        return (
          <Box
            key={section.id}
            component="a"
            href={`#${section.id}`}
            onClick={onNavigate}
            aria-current={isActive ? 'true' : undefined}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              py: 1,
              opacity: isActive ? 1 : 0.55,
              transition: 'opacity 0.25s',
              '&:hover': { opacity: 1 },
            }}
          >
            <Box
              component="span"
              sx={{ fontFamily: fontFamilies.mono, fontSize: '0.65rem', color: 'accent.text' }}
            >
              {section.index}
            </Box>
            <Box
              component="span"
              sx={{ fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.01em' }}
            >
              {dictionary.navigation[section.key]}
            </Box>
            <Box sx={{ flex: 1 }} />
            <Box
              aria-hidden
              sx={{
                width: isActive ? 22 : 0,
                height: '1px',
                bgcolor: 'accent.main',
                transition: 'width 0.35s cubic-bezier(0.22,1,0.36,1)',
              }}
            />
          </Box>
        );
      })}
    </Box>
  );
}

/**
 * Fixed left rail on large screens; a blurred top bar with a slide-in drawer
 * below the `lg` breakpoint.
 */
export default function Sidebar({
  dictionary,
  lang,
}: {
  dictionary: Dictionary;
  lang: Locale;
}) {
  const [open, setOpen] = React.useState(false);
  const active = useActiveSection(sectionIds);

  return (
    <>
      <Box
        component="aside"
        sx={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          width: SIDEBAR_WIDTH,
          borderRight: 1,
          borderColor: 'divider',
          display: { xs: 'none', lg: 'flex' },
          flexDirection: 'column',
          px: 3.5,
          py: 4,
          boxSizing: 'border-box',
          zIndex: 100,
          bgcolor: 'background.default',
        }}
      >
        <Wordmark role={dictionary.hero.role} />
        <Box sx={{ mt: 7 }}>
          <NavLinks dictionary={dictionary} active={active} />
        </Box>
        <Box sx={{ flex: 1 }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <ThemeControls lang={lang} />
          <SocialLinks />
          <Box
            sx={{
              fontFamily: fontFamilies.mono,
              fontSize: '0.6rem',
              color: 'text.secondary',
              opacity: 0.7,
            }}
          >
            © {site.year} — BR
          </Box>
        </Box>
      </Box>

      <Box
        component="header"
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: MOBILE_BAR_HEIGHT,
          px: { xs: 2.5, sm: 4 },
          display: { xs: 'flex', lg: 'none' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: (theme) => alpha(theme.palette.background.default, 0.85),
          backdropFilter: 'blur(12px)',
          zIndex: 100,
        }}
      >
        <Box
          sx={{
            fontFamily: fontFamilies.display,
            fontWeight: 700,
            fontSize: '0.95rem',
            letterSpacing: '-0.01em',
          }}
        >
          {site.firstName} {site.lastName}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ThemeControls lang={lang} />
          <IconButton
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
            sx={{ color: 'text.secondary' }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      </Box>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: 280,
              px: 3.5,
              py: 4,
              bgcolor: 'background.default',
              borderLeft: 1,
              borderColor: 'divider',
              backgroundImage: 'none',
            },
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Wordmark role={dictionary.hero.role} />
          <IconButton
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
            sx={{ color: 'text.secondary' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ mt: 5 }}>
          <NavLinks dictionary={dictionary} active={active} onNavigate={() => setOpen(false)} />
        </Box>
        <Box sx={{ flex: 1 }} />
        <Box sx={{ mt: 5 }}>
          <SocialLinks />
        </Box>
      </Drawer>
    </>
  );
}
