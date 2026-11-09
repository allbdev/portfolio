'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import { alpha, useTheme } from '@mui/material/styles';
import { AnimatePresence, motion } from 'framer-motion';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloseIcon from '@mui/icons-material/Close';
import NorthIcon from '@mui/icons-material/North';
import StopIcon from '@mui/icons-material/Stop';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Markdown from './Markdown';
import { OPEN_CHAT_EVENT } from './events';
import { ask, ChatUnavailableError, onDeviceReady, useChatAvailable, type EngineKind } from './engine';
import { aiPrompt } from '../AskAI';
import { CHAT_LIMITS, type ChatMessage } from '../../chat-prompt';
import { fontFamilies } from '../../fonts';
import type { Dictionary } from '../../get-dictionary';
import type { Locale } from '../../../i18n-config';

const STORAGE_KEY = 'portfolio-chat-v1';

function loadHistory(): ChatMessage[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed.slice(-40) : [];
  } catch {
    return [];
  }
}

type ErrorReason = ChatUnavailableError['reason'];

export default function ChatWidget({ dictionary, lang }: { dictionary: Dictionary; lang: Locale }) {
  const t = dictionary.chat;
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => (typeof window === 'undefined' ? [] : loadHistory()));
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ErrorReason | null>(null);
  const [engine, setEngine] = useState<EngineKind | null>(null);
  const [copied, setCopied] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesRef = useRef(messages);
  const engineRef = useRef<Promise<EngineKind> | null>(null);

  useEffect(() => {
    messagesRef.current = messages;
    if (busy) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // Private mode or blocked storage: the chat still works, it just forgets.
    }
  }, [messages, busy]);

  useEffect(() => {
    const body = bodyRef.current;
    if (body) body.scrollTop = body.scrollHeight;
  }, [messages, open, error]);

  const detectEngine = useCallback(() => {
    engineRef.current ??= onDeviceReady(lang).then((ready) => {
      const kind: EngineKind = ready ? 'device' : 'cloud';
      setEngine(kind);
      return kind;
    });
    return engineRef.current;
  }, [lang]);

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim().slice(0, CHAT_LIMITS.messageChars);
      if (!text || abortRef.current) return;
      const history = [...messagesRef.current, { role: 'user' as const, content: text }];
      setMessages([...history, { role: 'assistant', content: '' }]);
      setInput('');
      setError(null);
      setBusy(true);
      const controller = new AbortController();
      abortRef.current = controller;
      let answer = '';
      try {
        const used = await ask(
          await detectEngine(),
          history,
          lang,
          (delta) => {
            answer += delta;
            setMessages([...history, { role: 'assistant', content: answer }]);
          },
          controller.signal,
        );
        setEngine(used);
      } catch (caught) {
        if (!controller.signal.aborted) {
          setError(caught instanceof ChatUnavailableError ? caught.reason : 'failed');
        }
      } finally {
        // Drop an empty bubble left by a failure or an early stop.
        if (!answer) setMessages(history);
        abortRef.current = null;
        setBusy(false);
      }
    },
    [detectEngine, lang],
  );

  const show = useCallback(
    (question?: string) => {
      setOpen(true);
      detectEngine();
      if (question) send(question);
      requestAnimationFrame(() => inputRef.current?.focus({ preventScroll: true }));
    },
    [detectEngine, send],
  );

  useEffect(() => {
    const onOpen = (event: Event) => show((event as CustomEvent<{ question?: string }>).detail?.question);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener(OPEN_CHAT_EVENT, onOpen);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener(OPEN_CHAT_EVENT, onOpen);
      window.removeEventListener('keydown', onKey);
    };
  }, [show]);

  const stop = () => abortRef.current?.abort();
  const clear = () => {
    stop();
    setMessages([]);
    setError(null);
  };
  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(aiPrompt(dictionary));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      document.getElementById('ask-ai')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const available = useChatAvailable(lang);
  const accent = theme.palette.accent.main;
  const dark = theme.palette.mode === 'dark';
  const panelBg = dark ? '#0a0e13' : '#ffffff';
  const last = messages.at(-1);
  const waiting = busy && last?.role === 'assistant' && !last.content;

  return (
    <>
      <AnimatePresence>
        {available && !open && (
          <motion.button
            key="fab"
            type="button"
            onClick={() => show()}
            aria-label={t.open}
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.9 }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 22,
              delay: 0.2,
            }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            style={{
              position: 'fixed',
              right: 20,
              bottom: 20,
              zIndex: 1250,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '11px 16px 11px 13px',
              borderRadius: 999,
              border: `1px solid ${alpha(accent, 0.45)}`,
              background: dark ? alpha('#0a0e13', 0.88) : alpha('#ffffff', 0.92),
              backdropFilter: 'blur(12px)',
              color: theme.palette.text.primary,
              fontFamily: fontFamilies.mono,
              fontSize: '0.8rem',
              cursor: 'pointer',
              boxShadow: `0 10px 40px ${alpha(accent, 0.25)}`,
            }}
          >
            <AutoAwesomeIcon sx={{ fontSize: 18, color: 'accent.main' }} />
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
              {t.open}
            </Box>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <Box
            key="panel"
            role="dialog"
            aria-label={t.title}
            sx={{
              position: 'fixed',
              zIndex: 1300,
              right: { xs: 8, sm: 20 },
              left: { xs: 8, sm: 'auto' },
              bottom: { xs: 8, sm: 20 },
              width: { sm: 400 },
              height: {
                xs: 'min(620px, calc(100dvh - 80px))',
                sm: 'min(600px, calc(100dvh - 40px))',
              },
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              style={{ height: '100%', transformOrigin: 'bottom right' }}
            >
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  bgcolor: panelBg,
                  border: `1px solid ${alpha(accent, 0.3)}`,
                  boxShadow: `0 30px 90px ${alpha('#000', dark ? 0.55 : 0.18)}, 0 0 0 1px ${alpha(accent, 0.05)}`,
                }}
              >
                {/* Header */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.25,
                    px: 2,
                    py: 1.5,
                    borderBottom: 1,
                    borderColor: 'divider',
                  }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '10px',
                      display: 'grid',
                      placeItems: 'center',
                      bgcolor: alpha(accent, 0.14),
                      color: 'accent.main',
                      flex: 'none',
                    }}
                  >
                    <AutoAwesomeIcon sx={{ fontSize: 18 }} />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box
                      sx={{
                        fontWeight: 600,
                        fontSize: '0.92rem',
                        lineHeight: 1.3,
                      }}
                    >
                      {t.title}
                    </Box>
                    <Box
                      title={engine === 'device' ? t.deviceNote : undefined}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.75,
                        fontFamily: fontFamilies.mono,
                        fontSize: '0.66rem',
                        color: 'text.secondary',
                      }}
                    >
                      <Box
                        component="span"
                        className="live-dot"
                        sx={{ width: 6, height: 6, opacity: engine ? 1 : 0.3 }}
                      />
                      {engine ? t.engines[engine] : '…'}
                    </Box>
                  </Box>
                  {messages.length > 0 && (
                    <IconButton label={t.clear} onClick={clear}>
                      <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  )}
                  <IconButton label={t.close} onClick={() => setOpen(false)}>
                    <CloseIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Box>

                {/* Messages */}
                <Box
                  ref={bodyRef}
                  aria-live="polite"
                  sx={{
                    flex: 1,
                    overflowY: 'auto',
                    overscrollBehavior: 'contain',
                    px: 2,
                    py: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5,
                    fontSize: '0.88rem',
                    lineHeight: 1.6,
                  }}
                >
                  <Bubble role="assistant">{t.greeting}</Bubble>
                  {engine === 'device' && messages.length === 0 && (
                    <Box
                      sx={{
                        fontFamily: fontFamilies.mono,
                        fontSize: '0.68rem',
                        color: 'text.secondary',
                        px: 0.5,
                      }}
                    >
                      {t.deviceNote}
                    </Box>
                  )}

                  {messages.map((message, index) =>
                    message.content ? (
                      <Bubble key={index} role={message.role}>
                        {message.role === 'assistant' ? <Markdown text={message.content} /> : message.content}
                      </Bubble>
                    ) : null,
                  )}

                  {waiting && (
                    <Bubble role="assistant">
                      <Box sx={{ display: 'flex', gap: 0.6, py: 0.75 }}>
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            animate={{
                              opacity: [0.25, 1, 0.25],
                              y: [0, -3, 0],
                            }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              delay: i * 0.15,
                            }}
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: 3,
                              background: accent,
                              display: 'block',
                            }}
                          />
                        ))}
                      </Box>
                    </Bubble>
                  )}

                  {error && (
                    <Box
                      sx={{
                        border: 1,
                        borderColor: alpha('#f87171', 0.4),
                        bgcolor: alpha('#f87171', 0.08),
                        borderRadius: '12px',
                        p: 1.5,
                        fontSize: '0.82rem',
                      }}
                    >
                      {t.errors[error]}
                      <Box
                        component="button"
                        type="button"
                        onClick={copyPrompt}
                        sx={{
                          all: 'unset',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.75,
                          mt: 1,
                          color: 'accent.text',
                          fontFamily: fontFamilies.mono,
                          fontSize: '0.74rem',
                          '&:hover, &:focus-visible': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        <ContentCopyIcon sx={{ fontSize: 14 }} />
                        {copied ? dictionary.ai.copied : t.fallback}
                      </Box>
                    </Box>
                  )}

                  {messages.length === 0 && !busy && (
                    <Box
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 1,
                        mt: 0.5,
                      }}
                    >
                      {t.suggestions.map((suggestion) => (
                        <Box
                          key={suggestion}
                          component="button"
                          type="button"
                          onClick={() => send(suggestion)}
                          sx={{
                            all: 'unset',
                            cursor: 'pointer',
                            px: 1.5,
                            py: 0.75,
                            borderRadius: 999,
                            border: 1,
                            borderColor: 'divider',
                            fontSize: '0.78rem',
                            color: 'text.secondary',
                            transition: 'border-color 0.2s, color 0.2s',
                            '&:hover, &:focus-visible': {
                              borderColor: 'accent.main',
                              color: 'accent.text',
                            },
                          }}
                        >
                          {suggestion}
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>

                {/* Composer */}
                <Box
                  component="form"
                  onSubmit={(event: React.FormEvent) => {
                    event.preventDefault();
                    send(input);
                  }}
                  sx={{ borderTop: 1, borderColor: 'divider', p: 1.5 }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-end',
                      gap: 1,
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: '14px',
                      pl: 1.5,
                      pr: 0.75,
                      py: 0.75,
                      transition: 'border-color 0.2s',
                      '&:focus-within': { borderColor: 'accent.main' },
                    }}
                  >
                    <Box
                      component="textarea"
                      ref={inputRef}
                      rows={1}
                      value={input}
                      maxLength={CHAT_LIMITS.messageChars}
                      placeholder={t.placeholder}
                      aria-label={t.placeholder}
                      onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setInput(event.target.value)}
                      onKeyDown={(event: React.KeyboardEvent<HTMLTextAreaElement>) => {
                        if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
                          event.preventDefault();
                          send(input);
                        }
                      }}
                      sx={{
                        flex: 1,
                        resize: 'none',
                        border: 0,
                        outline: 0,
                        bgcolor: 'transparent',
                        color: 'text.primary',
                        font: 'inherit',
                        // 16px stops iOS from zooming into the field.
                        fontSize: { xs: 16, sm: '0.88rem' },
                        lineHeight: 1.5,
                        py: 0.6,
                        maxHeight: 120,
                        fieldSizing: 'content',
                        '&::placeholder': {
                          color: 'text.secondary',
                          opacity: 0.8,
                        },
                      }}
                    />
                    <Box
                      component="button"
                      type={busy ? 'button' : 'submit'}
                      onClick={busy ? stop : undefined}
                      disabled={!busy && !input.trim()}
                      aria-label={busy ? t.stop : t.send}
                      sx={{
                        all: 'unset',
                        cursor: 'pointer',
                        flex: 'none',
                        width: 34,
                        height: 34,
                        borderRadius: '10px',
                        display: 'grid',
                        placeItems: 'center',
                        bgcolor: 'accent.main',
                        color: 'accent.ink',
                        transition: 'opacity 0.2s, transform 0.2s',
                        '&:disabled': { opacity: 0.35, cursor: 'default' },
                        '&:not(:disabled):hover': {
                          transform: 'translateY(-1px)',
                        },
                        '&:focus-visible': {
                          outline: `2px solid ${accent}`,
                          outlineOffset: 2,
                        },
                      }}
                    >
                      {busy ? <StopIcon sx={{ fontSize: 18 }} /> : <NorthIcon sx={{ fontSize: 18 }} />}
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      mt: 1,
                      textAlign: 'center',
                      fontSize: '0.64rem',
                      color: 'text.secondary',
                      fontFamily: fontFamilies.mono,
                    }}
                  >
                    {t.disclaimer}
                  </Box>
                </Box>
              </Box>
            </motion.div>
          </Box>
        )}
      </AnimatePresence>
    </>
  );
}

function Bubble({ role, children }: { role: ChatMessage['role']; children: React.ReactNode }) {
  const user = role === 'user';
  return (
    <Box
      sx={(theme) => ({
        alignSelf: user ? 'flex-end' : 'flex-start',
        maxWidth: '88%',
        px: 1.75,
        py: 1.1,
        borderRadius: user ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
        bgcolor: user ? theme.palette.accent.main : alpha(theme.palette.text.primary, 0.05),
        color: user ? theme.palette.accent.ink : 'text.primary',
        whiteSpace: user ? 'pre-wrap' : 'normal',
        wordBreak: 'break-word',
      })}
    >
      {children}
    </Box>
  );
}

function IconButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      sx={{
        all: 'unset',
        cursor: 'pointer',
        width: 32,
        height: 32,
        borderRadius: '8px',
        display: 'grid',
        placeItems: 'center',
        color: 'text.secondary',
        transition: 'background-color 0.2s, color 0.2s',
        '&:hover, &:focus-visible': {
          bgcolor: 'action.hover',
          color: 'text.primary',
        },
      }}
    >
      {children}
    </Box>
  );
}
