'use client';

import { useEffect } from 'react';

/** IntersectionObserver reveal — progressive enhancement over visible-by-default CSS. */
export function useReveal(rootSelector = '.landing') {
  useEffect(() => {
    const root = document.querySelector(rootSelector);
    if (!root) return;

    const pending = () =>
      Array.from(root.querySelectorAll<HTMLElement>('.reveal:not(.in)'));

    const show = (el: HTMLElement) => el.classList.add('in');

    const markAboveFold = () => {
      const h = window.innerHeight;
      pending().forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < h * 0.96 && r.height > 0) show(el);
      });
    };

    // Reveal above-fold first, then enable hide styles (avoids flash).
    markAboveFold();
    root.classList.add('reveal-ready');

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      pending().forEach(show);
      return () => {
        root.classList.remove('reveal-ready');
      };
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
      pending().forEach((el) => {
        if ((el as HTMLElement & { _o?: number })._o) return;
        (el as HTMLElement & { _o?: number })._o = 1;
        if (io) io.observe(el);
        else show(el);
      });
    };

    const sweep = () => {
      const h = window.innerHeight;
      pending().forEach((el) => {
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
    const t2 = window.setTimeout(() => pending().forEach(show), 3500);

    window.addEventListener('scroll', sweep, { passive: true });
    window.addEventListener('resize', sweep);

    return () => {
      io?.disconnect();
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener('scroll', sweep);
      window.removeEventListener('resize', sweep);
      root.classList.remove('reveal-ready');
    };
  }, [rootSelector]);
}
