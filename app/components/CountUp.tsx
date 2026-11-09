'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

/**
 * Counts the number inside a label like "6+", "~60" or "1M+" up from zero
 * when it scrolls into view. Prefix/suffix are kept as-is.
 */
export default function CountUp({ value, duration = 1400 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const match = value.match(/^(\D*)([\d.,]+)(.*)$/);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    if (!match || !inView) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const [, prefix, digits, suffix] = match;
    const target = Number(digits.replace(/,/g, ''));
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setShown(`${prefix}${Math.round(target * eased).toLocaleString('en-US')}${suffix}`);
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, value, duration]);

  return (
    <span ref={ref} aria-label={value}>
      <span aria-hidden>{shown}</span>
    </span>
  );
}
