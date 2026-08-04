'use client';

import { useEffect, useState } from 'react';

/**
 * Tracks which section owns the middle of the viewport, for the sidebar's
 * active-link indicator.
 */
export function useActiveSection(ids: readonly string[], initial = ids[0]) {
  const [active, setActive] = useState(initial);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' },
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [ids]);

  return active;
}
