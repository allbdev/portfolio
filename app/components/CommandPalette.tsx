'use client';

import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import { alpha, useTheme } from '@mui/material/styles';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { ColorModeContext } from './ThemeRegistry/ThemeRegistry';
import { aiPrompt } from './AskAI';
import { fontFamilies } from '../fonts';
import { sections, site } from '../site';
import { i18n, type Locale } from '../../i18n-config';
import type { Dictionary } from '../get-dictionary';

export const OPEN_PALETTE_EVENT = 'open-command-palette';

type Item = { id: string; group: string; label: string; hint?: string; run: () => void };

/** ⌘K / Ctrl+K launcher: jump to a section, open a case study, or run an action. */
export default function CommandPalette({ dictionary, lang }: { dictionary: Dictionary; lang: Locale }) {
  const t = dictionary.palette;
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const { toggleColorMode } = useContext(ColorModeContext);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [flash, setFlash] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const openRef = useRef(false);

  useEffect(() => {
    openRef.current = open;
    if (open) requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  useEffect(() => {
    // Every open starts from a clean slate.
    const show = () => {
      setQuery('');
      setActive(0);
      setFlash('');
      setOpen(true);
    };
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (openRef.current) setOpen(false);
        else show();
      } else if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener(OPEN_PALETTE_EVENT, show);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener(OPEN_PALETTE_EVENT, show);
    };
  }, []);

  const items = useMemo<Item[]>(() => {
    const close = (fn: () => void) => () => {
      setOpen(false);
      fn();
    };
    const other = (i18n.locales.find((locale) => locale !== lang) ?? i18n.defaultLocale) as Locale;
    const segments = (pathname || `/${lang}`).split('/');
    segments[1] = other;

    return [
      ...sections.map((section) => ({
        id: `go-${section.id}`,
        group: t.groups.navigate,
        label: dictionary.navigation[section.key],
        hint: section.index,
        run: close(() => document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' })),
      })),
      ...dictionary.projects.items.map((project) => ({
        id: `project-${project.slug}`,
        group: t.groups.projects,
        label: project.title,
        hint: t.caseStudy,
        run: close(() => router.push(`/${lang}/projeto/${project.slug}`)),
      })),
      {
        id: 'terminal',
        group: t.groups.actions,
        label: t.actions.terminal,
        hint: '>_',
        run: close(() => {
          document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
        }),
      },
      {
        id: 'copy-email',
        group: t.groups.actions,
        label: t.actions.copyEmail,
        hint: site.email,
        run: () => {
          navigator.clipboard?.writeText(site.email).then(
            () => setFlash(t.actions.copied),
            () => setFlash(site.email),
          );
        },
      },
      {
        id: 'copy-prompt',
        group: t.groups.actions,
        label: t.actions.copyPrompt,
        hint: 'llms.txt',
        run: () => {
          navigator.clipboard?.writeText(aiPrompt(dictionary)).then(
            () => setFlash(t.actions.promptCopied),
            () => setFlash(aiPrompt(dictionary)),
          );
        },
      },
      { id: 'cv', group: t.groups.actions, label: t.actions.downloadCv, hint: 'PDF', run: close(() => window.open(site.cv, '_blank', 'noopener')) },
      { id: 'theme', group: t.groups.actions, label: t.actions.toggleTheme, hint: theme.palette.mode === 'dark' ? '☀' : '☾', run: close(toggleColorMode) },
      { id: 'lang', group: t.groups.actions, label: t.actions.switchLang, hint: other.toUpperCase(), run: close(() => router.push(segments.join('/'))) },
      { id: 'github', group: t.groups.links, label: 'GitHub', hint: 'allbdev', run: close(() => window.open(site.github, '_blank', 'noopener')) },
      { id: 'linkedin', group: t.groups.links, label: 'LinkedIn', hint: 'albuquerque-vinicius', run: close(() => window.open(site.linkedin, '_blank', 'noopener')) },
      { id: 'email', group: t.groups.links, label: t.actions.sendEmail, hint: 'mailto', run: close(() => window.location.assign(`mailto:${site.email}`)) },
    ];
  }, [dictionary, lang, pathname, router, t, theme.palette.mode, toggleColorMode]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => `${item.label} ${item.group} ${item.hint ?? ''}`.toLowerCase().includes(q));
  }, [items, query]);

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((i) => Math.min(filtered.length - 1, i + 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (event.key === 'Enter') {
      filtered[active]?.run();
    }
  };

  let lastGroup = '';

  return (
    <AnimatePresence>
      {open && (
        <Box
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
          sx={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            bgcolor: alpha('#000', theme.palette.mode === 'dark' ? 0.55 : 0.3),
            backdropFilter: 'blur(6px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            pt: { xs: '12vh', md: '16vh' },
            px: 2,
          }}
        >
          <Box
            component={motion.div}
            role="dialog"
            aria-modal="true"
            aria-label={t.placeholder}
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            onClick={(event: React.MouseEvent) => event.stopPropagation()}
            sx={{
              width: '100%',
              maxWidth: 580,
              bgcolor: 'background.paper',
              border: 1,
              borderColor: alpha(theme.palette.accent.main, 0.25),
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: `0 40px 120px ${alpha('#000', 0.45)}, 0 0 60px ${alpha(theme.palette.accent.main, 0.08)}`,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2.5, borderBottom: 1, borderColor: 'divider' }}>
              <Box sx={{ fontFamily: fontFamilies.mono, color: 'accent.text', fontSize: '0.9rem' }}>›</Box>
              <Box
                component="input"
                ref={inputRef}
                value={query}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setQuery(event.target.value);
                  setActive(0);
                }}
                onKeyDown={onKeyDown}
                placeholder={t.placeholder}
                aria-label={t.placeholder}
                sx={{
                  flex: 1,
                  py: 2.25,
                  border: 0,
                  outline: 0,
                  bgcolor: 'transparent',
                  color: 'text.primary',
                  font: 'inherit',
                  fontSize: '1rem',
                }}
              />
              <Box sx={kbdSx}>ESC</Box>
            </Box>

            <Box ref={listRef} sx={{ maxHeight: 380, overflowY: 'auto', py: 1 }}>
              {filtered.length === 0 && (
                <Box sx={{ px: 2.5, py: 3, color: 'text.secondary', fontSize: '0.9rem' }}>{t.empty}</Box>
              )}
              {filtered.map((item, index) => {
                const header = item.group !== lastGroup ? item.group : null;
                lastGroup = item.group;
                const selected = index === active;
                return (
                  <Box key={item.id}>
                    {header && (
                      <Box
                        sx={{
                          px: 2.5,
                          pt: 1.5,
                          pb: 0.75,
                          fontFamily: fontFamilies.mono,
                          fontSize: '0.6rem',
                          letterSpacing: '0.16em',
                          textTransform: 'uppercase',
                          color: 'text.secondary',
                        }}
                      >
                        {header}
                      </Box>
                    )}
                    <Box
                      data-index={index}
                      role="option"
                      aria-selected={selected}
                      onMouseMove={() => setActive(index)}
                      onClick={item.run}
                      sx={{
                        mx: 1,
                        px: 1.5,
                        py: 1.25,
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 2,
                        cursor: 'pointer',
                        fontSize: '0.92rem',
                        bgcolor: selected ? alpha(theme.palette.accent.main, 0.1) : 'transparent',
                        color: selected ? 'text.primary' : 'text.secondary',
                        borderLeft: 2,
                        borderColor: selected ? 'accent.main' : 'transparent',
                      }}
                    >
                      <span>{item.label}</span>
                      {item.hint && (
                        <Box sx={{ fontFamily: fontFamilies.mono, fontSize: '0.68rem', color: 'text.secondary', opacity: 0.8 }}>
                          {item.hint}
                        </Box>
                      )}
                    </Box>
                  </Box>
                );
              })}
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 2,
                px: 2.5,
                py: 1.25,
                borderTop: 1,
                borderColor: 'divider',
                fontFamily: fontFamilies.mono,
                fontSize: '0.62rem',
                color: 'text.secondary',
              }}
            >
              <span>{flash || t.footer}</span>
              <span>⌘K</span>
            </Box>
          </Box>
        </Box>
      )}
    </AnimatePresence>
  );
}

export const kbdSx = {
  fontFamily: fontFamilies.mono,
  fontSize: '0.6rem',
  letterSpacing: '0.08em',
  color: 'text.secondary',
  border: 1,
  borderColor: 'divider',
  borderRadius: '6px',
  px: 0.75,
  py: 0.25,
} as const;
