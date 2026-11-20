'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import { alpha } from '@mui/material/styles';
import { fontFamilies } from '../fonts';
import { site } from '../site';
import type { Dictionary } from '../get-dictionary';

export const LLMS_URL = `${site.url}/llms.txt`;

/** The prompt visitors paste into their assistant, with the llms.txt link filled in. */
export const aiPrompt = (dictionary: Dictionary) => dictionary.ai.prompt.replace('{url}', LLMS_URL);

const textLinkSx = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 0.5,
  minHeight: 44,
  fontSize: '0.9rem',
  fontWeight: 600,
  color: 'text.secondary',
  transition: 'color 0.2s',
  '&:hover': { color: 'accent.text' },
} as const;

/**
 * "Prefer your assistant's summary?": a secondary row inside Contact with the
 * ready-made prompt that points an AI at /llms.txt, a copy button and
 * open-in-assistant links. Kept after the work so it never pulls visitors
 * away before the proof.
 */
export default function AskAI({ dictionary }: { dictionary: Dictionary }) {
  const t = dictionary.ai;
  const prompt = aiPrompt(dictionary);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard can be blocked; the prompt stays selectable as a fallback.
    }
  };

  const encoded = encodeURIComponent(prompt);
  const assistants = [
    { label: 'ChatGPT', href: `https://chatgpt.com/?q=${encoded}` },
    { label: 'Claude', href: `https://claude.ai/new?q=${encoded}` },
    { label: 'Perplexity', href: `https://www.perplexity.ai/search?q=${encoded}` },
  ];

  return (
    <Box
      id="ask-ai"
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: '0.8fr 1.2fr' },
        gap: { xs: 3, lg: 6 },
        alignItems: 'start',
        pt: { xs: 5, md: 6 },
        borderTop: 1,
        borderColor: 'divider',
        scrollMarginTop: 96,
      }}
    >
      <Box>
        <Typography component="h3" variant="h4" sx={{ fontSize: { xs: '1.3rem', md: '1.45rem' }, mb: 1.25 }}>
          {t.title}
        </Typography>
        <Typography sx={{ color: 'text.secondary', lineHeight: 1.65, maxWidth: 440, fontSize: '0.95rem' }}>
          {t.text}
        </Typography>
        <Box component="a" href="/llms.txt" target="_blank" rel="noreferrer" sx={{ ...textLinkSx, mt: 0.5 }}>
          {t.viewFile}
          <NorthEastIcon sx={{ fontSize: 15 }} />
        </Box>
      </Box>

      <Box>
        <Box
          sx={(theme) => ({
            borderRadius: '14px',
            border: `1px solid ${alpha(theme.palette.accent.main, 0.22)}`,
            bgcolor: theme.palette.mode === 'dark' ? '#070a0e' : '#0f151c',
            color: '#e9eef3',
            fontFamily: fontFamilies.mono,
            fontSize: { xs: '0.8rem', sm: '0.85rem' },
            lineHeight: 1.7,
            p: { xs: 2.25, sm: 2.75 },
          })}
        >
          <Box component="span" aria-hidden sx={{ color: 'accent.main', mr: 1, userSelect: 'none' }}>
            ❯
          </Box>
          <Box component="span" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {prompt}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', columnGap: 2.5, rowGap: 1, mt: 2, alignItems: 'center' }}>
          <Button
            onClick={copy}
            variant="outlined"
            startIcon={copied ? <CheckIcon sx={{ fontSize: 18 }} /> : <ContentCopyIcon sx={{ fontSize: 16 }} />}
            aria-live="polite"
            sx={{
              px: 2.25,
              py: 1.125,
              fontSize: '0.88rem',
              color: copied ? 'accent.text' : 'text.primary',
              borderColor: copied ? 'accent.main' : 'divider',
              transition: 'border-color 0.25s, color 0.25s',
              '&:hover': { borderColor: 'accent.main', color: 'accent.text' },
            }}
          >
            {copied ? t.copied : t.copy}
          </Button>
          <Box component="span" sx={{ fontSize: '0.9rem', color: 'text.secondary' }}>
            {t.open}
          </Box>
          {assistants.map((assistant) => (
            <Box
              key={assistant.label}
              component="a"
              href={assistant.href}
              target="_blank"
              rel="noreferrer"
              sx={textLinkSx}
            >
              {assistant.label}
              <NorthEastIcon sx={{ fontSize: 14 }} />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
