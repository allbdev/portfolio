'use client';

import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import { alpha, useTheme } from '@mui/material/styles';
import { motion, useInView } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ColorModeContext } from './ThemeRegistry/ThemeRegistry';
import { LLMS_URL } from './AskAI';
import commits from '../data/commits.json';
import { fontFamilies } from '../fonts';
import { site } from '../site';
import type { Dictionary } from '../get-dictionary';
import type { Locale } from '../../i18n-config';

type Line = { kind: 'cmd' | 'out' | 'accent' | 'dim' | 'err'; text: string };

const PROMPT = 'vinicius@portfolio:~$';
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * A terminal that pops in when scrolled into view, types out a short intro,
 * then hands the prompt to the visitor (`help` lists what it understands).
 */
export default function Terminal({ dictionary, lang }: { dictionary: Dictionary; lang: Locale }) {
  const t = dictionary.about.terminal;
  const theme = useTheme();
  const router = useRouter();
  const { toggleColorMode } = useContext(ColorModeContext);
  const rootRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inView = useInView(rootRef, { once: true, margin: '0px 0px -20% 0px' });

  const [lines, setLines] = useState<Line[]>([]);
  const [typing, setTyping] = useState('');
  const [ready, setReady] = useState(false);
  const [input, setInput] = useState('');
  const history = useRef<string[]>([]);
  const historyIndex = useRef(-1);

  const push = useCallback((...next: Line[]) => setLines((prev) => [...prev, ...next]), []);

  // Intro script: type each command, then print its output.
  useEffect(() => {
    if (!inView) return;
    let cancelled = false;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    (async () => {
      await sleep(reduced ? 0 : 500);
      for (const step of t.script) {
        if (cancelled) return;
        if (reduced) {
          push({ kind: 'cmd', text: step.cmd });
        } else {
          for (let i = 1; i <= step.cmd.length; i++) {
            if (cancelled) return;
            setTyping(step.cmd.slice(0, i));
            await sleep(38 + Math.random() * 45);
          }
          await sleep(220);
          setTyping('');
          push({ kind: 'cmd', text: step.cmd });
        }
        for (const text of step.out) {
          if (cancelled) return;
          if (!reduced) await sleep(55);
          push({ kind: text.startsWith('#') ? 'dim' : 'out', text });
        }
        if (!reduced) await sleep(380);
      }
      if (!cancelled) {
        push({ kind: 'dim', text: t.hint });
        setReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [inView, push, t]);

  // Keep the newest line in view without scrolling the page.
  useEffect(() => {
    const body = bodyRef.current;
    if (body) body.scrollTop = body.scrollHeight;
  }, [lines, typing]);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const run = (raw: string) => {
    const cmd = raw.trim();
    push({ kind: 'cmd', text: cmd });
    if (!cmd) return;
    history.current.unshift(cmd);
    historyIndex.current = -1;

    const [name, ...args] = cmd.toLowerCase().split(/\s+/);
    const out = (text: string, kind: Line['kind'] = 'out') => push({ kind, text });

    switch (name) {
      case 'help':
        t.help.forEach((text) => out(text));
        break;
      case 'whoami':
      case 'about':
      case 'status':
        t.commands[name].forEach((text) => out(text));
        break;
      case 'llms':
      case 'llms.txt':
        t.commands.llms.forEach((text) =>
          out(text.replace('{url}', LLMS_URL), text.startsWith('#') ? 'dim' : 'accent'),
        );
        break;
      case 'skills':
      case 'stack':
        dictionary.skills.categories.forEach((category) => {
          out(`# ${category.label}`, 'dim');
          out(`  ${category.items.join(', ')}`);
        });
        break;
      case 'experience':
      case 'jobs':
        dictionary.experience.jobs.forEach((job) => {
          out(`${job.period.padEnd(20)} ${job.role} @ ${job.company}`);
        });
        break;
      case 'projects':
      case 'ls':
        dictionary.projects.items.forEach((project) => {
          out(`${project.slug.padEnd(26)} ${project.summary}`);
        });
        if (name === 'projects') out(t.openHint, 'dim');
        break;
      case 'open': {
        const project = dictionary.projects.items.find((item) => item.slug === args[0]);
        if (project) {
          out(t.opening.replace('{x}', project.title), 'accent');
          router.push(`/${lang}/projeto/${project.slug}`);
        } else {
          out(t.openHint, 'err');
        }
        break;
      }
      case 'git':
        if (args[0] === 'log') {
          out(`${commits.total} commits · ${commits.start} → ${commits.generatedAt}`, 'accent');
          commits.byRepo.forEach((repo) => out(`  ${String(repo.commits).padStart(5)}  ${repo.label}`));
        } else {
          out(t.notFound.replace('{cmd}', cmd), 'err');
        }
        break;
      case 'contact':
      case 'email':
        out(`email     ${site.email}`);
        out(`linkedin  ${site.linkedin.replace('https://www.', '')}`);
        out(`github    ${site.github.replace('https://', '')}`);
        if (name === 'email') window.location.assign(`mailto:${site.email}`);
        break;
      case 'github':
      case 'linkedin':
        out(t.opening.replace('{x}', name), 'accent');
        window.open(name === 'github' ? site.github : site.linkedin, '_blank', 'noopener');
        break;
      case 'cv':
      case 'resume':
        out(t.opening.replace('{x}', 'cv.pdf'), 'accent');
        window.open(site.cv, '_blank', 'noopener');
        break;
      case 'theme':
        toggleColorMode();
        out(t.themeSwitched, 'accent');
        break;
      case 'goto':
      case 'cd': {
        const target = (args[0] ?? '').replace(/^[~/.]+/, '');
        const ids = ['home', 'about', 'projects', 'experience', 'skills', 'contact'];
        if (ids.includes(target)) scrollTo(target);
        else out(t.notFound.replace('{cmd}', cmd), 'err');
        break;
      }
      case 'date':
        out(new Date().toString());
        break;
      case 'echo':
        out(raw.trim().slice(5));
        break;
      case 'clear':
        setLines([]);
        break;
      case 'sudo':
      case 'hire-me':
        if (name === 'sudo' && args.join(' ') !== 'hire-me') {
          out(t.sudo, 'err');
          break;
        }
        t.hire.forEach((text) => out(text, 'accent'));
        setTimeout(() => scrollTo('contact'), 900);
        break;
      case 'exit':
        out(t.exit, 'dim');
        break;
      default:
        out(t.notFound.replace('{cmd}', name), 'err');
    }
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      run(input);
      setInput('');
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      const delta = event.key === 'ArrowUp' ? 1 : -1;
      const next = Math.min(history.current.length - 1, Math.max(-1, historyIndex.current + delta));
      historyIndex.current = next;
      setInput(next === -1 ? '' : history.current[next]);
    } else if (event.key === 'l' && event.ctrlKey) {
      event.preventDefault();
      setLines([]);
    }
  };

  // The terminal is dark in both themes, so its colours are fixed.
  const lineColor: Record<Line['kind'], string> = {
    cmd: '#e9eef3',
    out: '#a9b7c3',
    accent: theme.palette.accent.main,
    dim: '#5f6f7c',
    err: '#f87171',
  };

  return (
    <motion.div
      ref={rootRef}
      initial={{ opacity: 0, y: 40, scale: 0.92, rotateX: 12 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1, rotateX: 0 } : undefined}
      transition={{ type: 'spring', stiffness: 120, damping: 18, mass: 0.9 }}
      style={{ transformPerspective: 1200 }}
    >
      <Box
        onClick={() => inputRef.current?.focus({ preventScroll: true })}
        sx={{
          borderRadius: '14px',
          overflow: 'hidden',
          border: 1,
          borderColor: alpha(theme.palette.accent.main, 0.22),
          bgcolor: theme.palette.mode === 'dark' ? '#070a0e' : '#0f151c',
          boxShadow: `0 30px 90px ${alpha(theme.palette.accent.main, 0.12)}, 0 0 0 1px ${alpha('#000', 0.2)}`,
          fontFamily: fontFamilies.mono,
          fontSize: { xs: '0.72rem', sm: '0.8rem' },
          lineHeight: 1.7,
          cursor: 'text',
          color: '#e9eef3',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 2,
            py: 1.25,
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            bgcolor: 'rgba(255,255,255,0.03)',
          }}
        >
          {['#ff5f57', '#febc2e', '#28c840'].map((color) => (
            <Box key={color} sx={{ width: 11, height: 11, borderRadius: '50%', bgcolor: color }} />
          ))}
          <Box sx={{ flex: 1, textAlign: 'center', fontSize: '0.7rem', color: '#8fa0ae', mr: 5 }}>
            {t.title}
          </Box>
        </Box>

        <Box
          ref={bodyRef}
          sx={{
            p: { xs: 2, sm: 2.5 },
            height: { xs: 360, sm: 420 },
            overflowY: 'auto',
            overscrollBehavior: 'contain',
            '&::-webkit-scrollbar': { width: 6 },
            '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 3 },
          }}
        >
          {lines.map((line, index) => (
            <Box
              key={index}
              sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: lineColor[line.kind] }}
            >
              {line.kind === 'cmd' && (
                <Box component="span" sx={{ color: theme.palette.accent.main, mr: 1 }}>
                  {PROMPT}
                </Box>
              )}
              {line.text}
            </Box>
          ))}

          <Box sx={{ display: 'flex', alignItems: 'center', whiteSpace: 'pre' }}>
            <Box component="span" sx={{ color: theme.palette.accent.main, mr: 1, flex: 'none' }}>
              {PROMPT}
            </Box>
            {ready ? (
              <Box sx={{ position: 'relative', flex: 1, display: 'flex' }}>
                <Box component="span">{input}</Box>
                <Box component="span" className="term-caret" />
                <Box
                  component="input"
                  ref={inputRef}
                  value={input}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => setInput(event.target.value)}
                  onKeyDown={onKeyDown}
                  aria-label={t.hint}
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0,
                    border: 0,
                    outline: 0,
                    font: 'inherit',
                    // iOS zooms inputs under 16px; it is invisible anyway.
                    fontSize: 16,
                  }}
                />
              </Box>
            ) : (
              <>
                <Box component="span">{typing}</Box>
                <Box component="span" className="term-caret" />
              </>
            )}
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
}
