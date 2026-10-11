'use client';

import { useEffect } from 'react';

/** IntersectionObserver reveal matching ui-v1 site.js behaviour. */
export function useReveal(rootSelector = '.landing') {
  useEffect(() => {
    const root = document.querySelector(rootSelector);
    if (!root) return;

    const nodes = () =>
      Array.from(root.querySelectorAll<HTMLElement>('.reveal:not(.in)'));

    const show = (el: HTMLElement) => el.classList.add('in');

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      nodes().forEach(show);
      return;
    }

    const io =
      'IntersectionObserver' in window
        ? new IntersectionObserver(
            (entries) => {
              entries.forEach((e) => {
                if (e.isIntersecting) {
                  show(e.target as HTMLElement);
                  io?.unobserve(e.target);
                }
              });
            },
            { threshold: 0.1 },
          )
        : null;

    const observe = () => {
      nodes().forEach((el) => {
        if ((el as HTMLElement & { _o?: number })._o) return;
        (el as HTMLElement & { _o?: number })._o = 1;
        if (io) io.observe(el);
        else show(el);
      });
    };

    const sweep = () => {
      const h = window.innerHeight;
      nodes().forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < h * 0.96 && r.height > 0) show(el);
      });
    };

    observe();
    sweep();
    const t1 = window.setTimeout(() => {
      observe();
      sweep();
    }, 50);
    const t2 = window.setTimeout(() => nodes().forEach(show), 3500);

    window.addEventListener('scroll', sweep, { passive: true });
    window.addEventListener('resize', sweep);

    return () => {
      io?.disconnect();
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener('scroll', sweep);
      window.removeEventListener('resize', sweep);
    };
  }, [rootSelector]);
}
