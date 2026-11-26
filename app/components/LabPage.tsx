'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import WestIcon from '@mui/icons-material/West';
import { alpha, type Theme } from '@mui/material/styles';
import { MotionConfig } from 'framer-motion';
import Link from 'next/link';
import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import CustomCursor from './CustomCursor';
import Reveal from './Reveal';
import ScrollProgress from './ScrollProgress';
import ThemeControls from './ThemeControls';
import { LabProject } from './Projects';
import { fontFamilies } from '../fonts';
import { useMagnetic } from '../hooks/useMagnetic';
import type { Dictionary } from '../get-dictionary';
import type { Locale } from '../../i18n-config';

type Project = Dictionary['projects']['items'][number];

/** Cards rendered per step of the infinite scroll. */
const PAGE_SIZE = 6;

/** Lowercase and strip accents, so "cartorio" finds "Cartório". */
const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();

type Indexed = { project: Project; title: string; content: string };

function index(project: Project): Indexed {
  return {
    project,
    title: normalize(project.title),
    content: normalize(
      [
        project.summary,
        project.description,
        project.longDescription,
        ...(project.highlights ?? []),
        ...project.techStack,
        project.status ?? '',
      ].join(' '),
    ),
  };
}

/** Every word of the query must appear in at least one of the chosen fields. */
function matches(entry: Indexed, terms: string[], inTitle: boolean, inContent: boolean) {
  return terms.every((term) => (inTitle && entry.title.includes(term)) || (inContent && entry.content.includes(term)));
}

const scopeChipSx = (active: boolean) =>
  ({
    fontFamily: fontFamilies.mono,
    fontSize: '0.75rem',
    letterSpacing: '0.04em',
    minHeight: 36,
    px: 1.75,
    borderRadius: 999,
    border: 1,
    cursor: 'pointer',
    transition: 'border-color 0.2s, color 0.2s, background-color 0.2s',
    color: active ? 'accent.text' : 'text.secondary',
    borderColor: (theme: Theme) => (active ? alpha(theme.palette.accent.main, 0.5) : theme.palette.divider),
    bgcolor: (theme: Theme) => (active ? alpha(theme.palette.accent.main, 0.08) : 'transparent'),
    '&:hover': { borderColor: 'accent.main' },
    '&:focus-visible': { outline: '2px solid', outlineColor: 'accent.main', outlineOffset: 2 },
  }) as const;

export default function LabPage({ dictionary, lang }: { dictionary: Dictionary; lang: Locale }) {
  const t = dictionary.projects.lab;
  const backRef = useMagnetic<HTMLAnchorElement>();
  const sentinelRef = useRef<HTMLDivElement>(null);

  const entries = useMemo(() => dictionary.projects.items.filter((project) => project.lab).map(index), [dictionary]);

  const [query, setQuery] = useState('');
  const [inTitle, setInTitle] = useState(true);
  const [inContent, setInContent] = useState(true);
  const deferredQuery = useDeferredValue(query);
  // How many results are rendered, per search: a new search starts from the first page again.
  const searchKey = `${deferredQuery}|${inTitle}|${inContent}`;
  const [paging, setPaging] = useState({ key: searchKey, count: PAGE_SIZE });
  const visible = paging.key === searchKey ? paging.count : PAGE_SIZE;

  const results = useMemo(() => {
    const terms = normalize(deferredQuery).split(/\s+/).filter(Boolean);
    if (terms.length === 0) return entries.map((entry) => entry.project);
    return entries.filter((entry) => matches(entry, terms, inTitle, inContent)).map((entry) => entry.project);
  }, [entries, deferredQuery, inTitle, inContent]);

  const hasMore = visible < results.length;

  // Infinite scroll: reveal the next page when the sentinel nears the viewport.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setPaging({ key: searchKey, count: visible + PAGE_SIZE });
      },
      { rootMargin: '0px 0px 400px 0px' },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, visible, searchKey]);

  // At least one field stays selected, otherwise nothing could ever match.
  const toggleTitle = () => (inTitle && !inContent ? undefined : setInTitle((on) => !on));
  const toggleContent = () => (inContent && !inTitle ? undefined : setInContent((on) => !on));

  const shown = results.slice(0, visible);

  return (
    <MotionConfig reducedMotion="user">
      <ScrollProgress />
      <CustomCursor />
      <Box
        component="main"
        sx={{
          minHeight: '100vh',
          bgcolor: 'background.default',
          color: 'text.primary',
          px: { xs: 3, sm: 5, lg: 8 },
          py: { xs: 5, md: 9 },
          boxSizing: 'border-box',
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 6 }}>
            <Button
              ref={backRef}
              component={Link}
              href={`/${lang}#projects`}
              variant="outlined"
              startIcon={<WestIcon sx={{ fontSize: 15 }} />}
              sx={{
                px: 2.25,
                py: 1.125,
                color: 'text.secondary',
                borderColor: 'divider',
                borderRadius: '10px',
                fontFamily: fontFamilies.mono,
                fontSize: '0.75rem',
                letterSpacing: '0.06em',
                transition: 'border-color 0.25s, color 0.25s',
                '&:hover': { borderColor: 'accent.main', color: 'accent.text' },
              }}
            >
              {t.back}
            </Button>
            <ThemeControls lang={lang} />
          </Box>

          <Typography
            component="h1"
            variant="h1"
            sx={{ fontSize: 'clamp(38px, 5vw, 72px)', fontWeight: 600, lineHeight: 1.02 }}
          >
            {t.pageTitle}
          </Typography>
          <Typography sx={{ mt: 2.5, maxWidth: 640, fontSize: '1.15rem', lineHeight: 1.65, color: 'text.secondary' }}>
            {t.pageText}
          </Typography>

          <Box component="search" sx={{ display: 'block', mt: { xs: 5, md: 6 }, mb: 4 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                px: 2,
                minHeight: 52,
                border: 1,
                borderColor: 'divider',
                borderRadius: '12px',
                bgcolor: 'background.paper',
                transition: 'border-color 0.2s',
                '&:focus-within': { borderColor: 'accent.main' },
              }}
            >
              <SearchIcon aria-hidden sx={{ fontSize: 20, color: 'text.secondary' }} />
              <Box
                component="input"
                type="search"
                value={query}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)}
                placeholder={t.searchPlaceholder}
                aria-label={t.searchLabel}
                aria-controls="lab-results"
                autoComplete="off"
                spellCheck={false}
                sx={{
                  flex: 1,
                  minWidth: 0,
                  border: 0,
                  outline: 0,
                  bgcolor: 'transparent',
                  color: 'text.primary',
                  font: 'inherit',
                  fontSize: '1rem',
                  py: 1.5,
                  '&::placeholder': { color: 'text.secondary', opacity: 1 },
                  '&::-webkit-search-cancel-button': { display: 'none' },
                }}
              />
              {query ? (
                <Box
                  component="button"
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label={t.clear}
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 36,
                    height: 36,
                    border: 0,
                    borderRadius: '8px',
                    bgcolor: 'transparent',
                    color: 'text.secondary',
                    cursor: 'pointer',
                    '&:hover': { color: 'text.primary' },
                    '&:focus-visible': { outline: '2px solid', outlineColor: 'accent.main' },
                  }}
                >
                  <CloseIcon sx={{ fontSize: 18 }} />
                </Box>
              ) : null}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexWrap: 'wrap', mt: 2 }}>
              <Box
                component="span"
                id="lab-scope"
                sx={{ fontFamily: fontFamilies.mono, fontSize: '0.72rem', letterSpacing: '0.1em', color: 'text.secondary', textTransform: 'uppercase', mr: 0.5 }}
              >
                {t.scopeLabel}
              </Box>
              <Box role="group" aria-labelledby="lab-scope" sx={{ display: 'flex', gap: 1 }}>
                <Box component="button" type="button" aria-pressed={inTitle} onClick={toggleTitle} sx={scopeChipSx(inTitle)}>
                  {t.scopeTitle}
                </Box>
                <Box component="button" type="button" aria-pressed={inContent} onClick={toggleContent} sx={scopeChipSx(inContent)}>
                  {t.scopeContent}
                </Box>
              </Box>
              <Box
                component="span"
                role="status"
                sx={{ ml: 'auto', fontFamily: fontFamilies.mono, fontSize: '0.75rem', color: 'text.secondary' }}
              >
                {t.results.replace('{n}', String(results.length)).replace('{total}', String(entries.length))}
              </Box>
            </Box>
          </Box>

          {results.length === 0 ? (
            <Box sx={{ py: 10, textAlign: 'center' }}>
              <Typography sx={{ color: 'text.secondary', fontSize: '1rem' }}>{t.empty.replace('{q}', deferredQuery.trim())}</Typography>
              <Button onClick={() => setQuery('')} sx={{ mt: 2, color: 'accent.text' }}>
                {t.clear}
              </Button>
            </Box>
          ) : (
            <Box
              id="lab-results"
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' },
                gap: 3,
              }}
            >
              {shown.map((project, i) => (
                <Reveal key={project.slug} delay={(i % PAGE_SIZE) * 0.05} fullHeight>
                  <LabProject project={project} dictionary={dictionary} lang={lang} />
                </Reveal>
              ))}
            </Box>
          )}
          {hasMore ? <Box ref={sentinelRef} aria-hidden sx={{ height: 1 }} /> : null}
        </Box>
      </Box>
    </MotionConfig>
  );
}
