'use client';

import { useEffect, useState } from 'react';

/**
 * True when the device has a precise pointer and the user has not asked for
 * reduced motion — the gate for every pointer-driven flourish in the design
 * (custom cursor, magnetic buttons, kinetic type).
 */
export function useFineMotion() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setEnabled(fine.matches && !reduced.matches);

    update();
    fine.addEventListener('change', update);
    reduced.addEventListener('change', update);
    return () => {
      fine.removeEventListener('change', update);
      reduced.removeEventListener('change', update);
    };
  }, []);

  return enabled;
}
