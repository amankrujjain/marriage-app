'use client';

import type { VpApi } from './types';

let loading: Promise<VpApi> | null = null;

/** Load the ui-v1 biodata renderer from /vp/biodata.js (client-only). */
export function loadVp(): Promise<VpApi> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('VP requires window'));
  }
  if (window.VP && typeof window.VP.thumb === 'function') {
    window.VP.ensureSprite();
    return Promise.resolve(window.VP);
  }
  if (!loading) {
    loading = new Promise<VpApi>((resolve, reject) => {
      const ready = () => {
        if (!window.VP || typeof window.VP.thumb !== 'function') {
          reject(new Error('VP failed to initialize'));
          return;
        }
        window.VP.ensureSprite();
        resolve(window.VP);
      };

      const existing = document.querySelector<HTMLScriptElement>('script[data-vp-biodata]');
      if (existing) {
        if (window.VP && typeof window.VP.thumb === 'function') ready();
        else existing.addEventListener('load', ready, { once: true });
        return;
      }

      const script = document.createElement('script');
      script.src = '/vp/biodata.js';
      script.async = true;
      script.dataset.vpBiodata = '1';
      script.onload = () => ready();
      script.onerror = () => reject(new Error('Failed to load biodata.js'));
      document.head.appendChild(script);
    });
  }
  return loading;
}
