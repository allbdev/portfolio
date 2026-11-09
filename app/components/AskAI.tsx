'use client';

import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { alpha } from '@mui/material/styles';
import { useInView } from 'framer-motion';
import Reveal from './Reveal';
import SpotlightCard from './SpotlightCard';
import { openChat } from './chat/events';
import { useChatAvailable } from './chat/engine';
import type { Locale } from '../../i18n-config';
import { fontFamilies } from '../fonts';
import { site } from '../site';
import type { Dictionary } from '../get-dictionary';

export const LLMS_URL = `${site.url}/llms.txt`;

/** The prompt visitors paste into their assistant, with the llms.txt link filled in. */
export const aiPrompt = (dictionary: Dictionary) => dictionary.ai.prompt.replace('{url}', LLMS_URL);

/**
 * "Ask your AI about me": a ready-made prompt pointing at /llms.txt, typed out
 * when it scrolls into view, with copy and open-in-assistant shortcuts.
 */
export default function AskAI({ dictionary, lang }: { dictionary: Dictionary; lang: Locale }) {
  const t = dictionary.ai;
  const chatReady = useChatAvailable(lang);
  const prompt = aiPrompt(dictionary);
  const boxRef = useRef<HTMLDivElement>(null);
  const inView = useInView(boxRef, { once: true, margin: '0px 0px -20% 0px' });
  const [typed, setTyped] = useState(prompt);
  const [copied, setCopied] = useState(false);

  // Type the prompt out once; SSR and reduced-motion users get it whole.
  useEffect(() => {
    if (!inView || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let i = 0;
    let timer = 0;
    const step = () => {
      i = Math.min(prompt.length, i + 2);
      setTyped(prompt.slice(0, i));
      if (i < prompt.length) timer = window.setTimeout(step, 18);
    };
    step();
    return () => window.clearTimeout(timer);
  }, [inView, prompt]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard can be blocked; the text is selectable as a fallback.
    }
  };

  const encoded = encodeURIComponent(prompt);
  const assistants = [
    { label: 'ChatGPT', href: `https://chatgpt.com/?q=${encoded}` },
    { label: 'Claude', href: `https://claude.ai/new?q=${encoded}` },
    { label: 'Perplexity', href: `https://www.perplexity.ai/search?q=${encoded}` },
  ];

  const linkSx = {
    px: 2,
    py: 1,
    fontSize: '0.85rem',
    color: 'text.primary',
    borderColor: 'divider',
    transition: 'border-color 0.25s, color 0.25s',
    '&:hover': { borderColor: 'accent.main', color: 'accent.text' },
  } as const;

  return (
    <Box id="ask-ai" component="section" sx={{ px: { xs: 3, sm: 5, lg: 8 }, pt: { xs: 10, md: 15 } }}>
      <Reveal>
        <SpotlightCard sx={{ p: { xs: 3, sm: 4.5, md: 6 } }}>
          <Box
            sx={{
              position: 'relative',
              zIndex: 2,
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '0.9fr 1.1fr' },
              gap: { xs: 4, lg: 7 },
              alignItems: 'center',
            }}
          >
            <Box>
              <Box
                sx={{
                  fontFamily: fontFamilies.mono,
                  fontSize: '0.7rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'accent.text',
                  mb: 2,
                }}
              >
                {t.eyebrow}
              </Box>
              <Typography
                component="h2"
                variant="h2"
                sx={{ fontSize: { xs: '1.8rem', md: '2.4rem' }, lineHeight: 1.1, mb: 2 }}
              >
                {t.title}
              </Typography>
              <Typography sx={{ color: 'text.secondary', lineHeight: 1.7, maxWidth: 460 }}>{t.text}</Typography>
              <Box
                component="a"
                href="/llms.txt"
                target="_blank"
                rel="noreferrer"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.75,
                  mt: 2.5,
                  fontFamily: fontFamilies.mono,
                  fontSize: '0.78rem',
                  color: 'accent.text',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                {t.viewFile} <NorthEastIcon sx={{ fontSize: 14 }} />
              </Box>
              {chatReady && (
                <Box sx={{ mt: 3 }}>
                  <Button
                    onClick={() => openChat()}
                    variant="outlined"
                    startIcon={<AutoAwesomeIcon sx={{ fontSize: 16 }} />}
                    sx={{ ...linkSx, borderColor: 'accent.main', color: 'accent.text' }}
                  >
                    {t.chatHere}
                  </Button>
                </Box>
              )}
            </Box>

            <Box>
              <Box
                ref={boxRef}
                sx={(theme) => ({
                  position: 'relative',
                  borderRadius: '14px',
                  border: `1px solid ${alpha(theme.palette.accent.main, 0.25)}`,
                  bgcolor: theme.palette.mode === 'dark' ? '#070a0e' : '#0f151c',
                  color: '#e9eef3',
                  fontFamily: fontFamilies.mono,
                  fontSize: { xs: '0.8rem', sm: '0.88rem' },
                  lineHeight: 1.75,
                  p: { xs: 2.5, sm: 3 },
                  pr: { xs: 2.5, sm: 7 },
                  minHeight: 132,
                })}
              >
                <Box component="span" sx={{ color: 'accent.main', mr: 1, userSelect: 'none' }}>
                  ❯
                </Box>
                <Box component="span" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {typed}
                </Box>
                {typed.length < prompt.length && <Box component="span" className="term-caret" />}
                <Box
                  component="button"
                  type="button"
                  onClick={copy}
                  aria-label={copied ? t.copied : t.copy}
                  sx={(theme) => ({
                    all: 'unset',
                    cursor: 'pointer',
                    position: { xs: 'static', sm: 'absolute' },
                    top: 14,
                    right: 14,
                    display: { xs: 'none', sm: 'grid' },
                    placeItems: 'center',
                    width: 36,
                    height: 36,
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: copied ? theme.palette.accent.main : '#a9b7c3',
                    transition: 'border-color 0.2s, color 0.2s',
                    '&:hover, &:focus-visible': {
                      borderColor: theme.palette.accent.main,
                      color: theme.palette.accent.main,
                    },
                  })}
                >
                  {copied ? <CheckIcon sx={{ fontSize: 18 }} /> : <ContentCopyIcon sx={{ fontSize: 16 }} />}
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25, mt: 2.5, alignItems: 'center' }}>
                <Button
                  onClick={copy}
                  variant="contained"
                  startIcon={copied ? <CheckIcon sx={{ fontSize: 18 }} /> : <ContentCopyIcon sx={{ fontSize: 16 }} />}
                  sx={{
                    px: 2.5,
                    py: 1,
                    fontSize: '0.85rem',
                    bgcolor: 'accent.main',
                    color: 'accent.ink',
                    '&:hover': {
                      bgcolor: 'accent.main',
                      boxShadow: (theme) => `0 8px 30px ${alpha(theme.palette.accent.main, 0.4)}`,
                    },
                  }}
                >
                  {copied ? t.copied : t.copy}
                </Button>
                <Box sx={{ fontFamily: fontFamilies.mono, fontSize: '0.68rem', color: 'text.secondary', mx: 0.5 }}>
                  {t.open}
                </Box>
                {assistants.map((assistant) => (
                  <Button
                    key={assistant.label}
                    href={assistant.href}
                    target="_blank"
                    rel="noreferrer"
                    variant="outlined"
                    endIcon={<NorthEastIcon sx={{ fontSize: 14 }} />}
                    sx={linkSx}
                  >
                    {assistant.label}
                  </Button>
                ))}
              </Box>
            </Box>
          </Box>
        </SpotlightCard>
      </Reveal>
    </Box>
  );
}
