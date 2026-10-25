'use client';

import type { VpApi } from './types';

let loading: Promise<VpApi> | null = null;

function loadScript(src: string, dataAttr: 'vpBiodata' | 'vpBiodata30'): Promise<void> {
  return new Promise((resolve, reject) => {
    const selector =
      dataAttr === 'vpBiodata' ? 'script[data-vp-biodata]' : 'script[data-vp-biodata30]';
    const existing = document.querySelector<HTMLScriptElement>(selector);
    if (existing) {
      if (existing.dataset.loaded === '1' || (dataAttr === 'vpBiodata' && window.VP)) {
        existing.dataset.loaded = '1';
        resolve();
        return;
      }
      existing.addEventListener('load', () => {
        existing.dataset.loaded = '1';
        resolve();
      }, { once: true });
      existing.addEventListener(
        'error',
        () => reject(new Error(`Failed to load ${src}`)),
        { once: true },
      );
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    if (dataAttr === 'vpBiodata') script.dataset.vpBiodata = '1';
    else script.dataset.vpBiodata30 = '1';
    script.onload = () => {
      script.dataset.loaded = '1';
      resolve();
    };
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

/** Load ui-v2 biodata renderer: biodata.js then biodata30.js (38 templates). */
export function loadVp(): Promise<VpApi> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('VP requires window'));
  }
  if (
    window.VP &&
    typeof window.VP.thumb === 'function' &&
    Array.isArray(window.VP.TEMPLATES) &&
    window.VP.TEMPLATES.length >= 30
  ) {
    window.VP.ensureSprite();
    return Promise.resolve(window.VP);
  }
  if (!loading) {
    loading = (async () => {
      await loadScript('/vp/biodata.js', 'vpBiodata');
      await loadScript('/vp/biodata30.js', 'vpBiodata30');
      if (!window.VP || typeof window.VP.thumb !== 'function') {
        throw new Error('VP failed to initialize');
      }
      window.VP.ensureSprite();
      return window.VP;
    })().catch((err) => {
      loading = null;
      throw err;
    });
  }
  return loading;
}
