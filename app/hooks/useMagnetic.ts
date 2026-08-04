'use client';

import { useEffect, useRef } from 'react';
import { useFineMotion } from './useFineMotion';

/**
 * Pulls an element toward the pointer once it comes within `radius` pixels.
 * Returns a ref to spread onto the element (MUI Button forwards refs).
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.18, radius = 110) {
  const ref = useRef<T>(null);
  const active = useFineMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!active) {
      el.style.transform = '';
      return;
    }

    const onMove = (event: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const distance = Math.hypot(dx, dy);

      el.style.transform =
        distance < radius ? `translate(${dx * strength}px, ${dy * strength}px)` : '';
    };

    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      el.style.transform = '';
    };
  }, [active, radius, strength]);

  return ref;
}
