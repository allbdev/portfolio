'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

const GLYPHS = '!<>-_\\/[]{}—=+*^?#01ABCDEFabcdef';

/**
 * Decodes `text` from random glyphs, left to right, the first time it scrolls
 * into view and again on hover. Server-renders the real text, so crawlers
 * and reduced-motion users only ever see the final string.
 */
export default function ScrambleText({ text, duration = 750 }: { text: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' });
  const [display, setDisplay] = useState(text);
  const frame = useRef(0);

  const scramble = useCallback(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    cancelAnimationFrame(frame.current);
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const settled = Math.floor(progress * text.length);
      setDisplay(
        Array.from(text)
          .map((char, i) =>
            i < settled || char === ' ' ? char : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
          )
          .join(''),
      );
      if (progress < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  }, [text, duration]);

  useEffect(() => {
    if (inView) scramble();
    return () => cancelAnimationFrame(frame.current);
  }, [inView, scramble]);

  return (
    <span ref={ref} onMouseEnter={scramble} aria-label={text}>
      <span aria-hidden>{display}</span>
    </span>
  );
}
