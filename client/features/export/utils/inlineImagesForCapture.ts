const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

function isInlineSrc(src: string): boolean {
  return (
    !src ||
    src.startsWith('data:') ||
    src.startsWith('blob:') ||
    src.startsWith('svg:')
  );
}

function needsProxy(src: string): boolean {
  if (isInlineSrc(src)) return false;
  try {
    const url = new URL(src, typeof window !== 'undefined' ? window.location.href : undefined);
    if (typeof window !== 'undefined' && url.origin === window.location.origin) {
      return false;
    }
    // Private R2 / Cloudflare storage — browser CORS usually missing.
    return (
      url.hostname.includes('r2.cloudflarestorage.com') ||
      url.hostname.includes('r2.dev') ||
      url.hostname.endsWith('cloudflarestorage.com')
    );
  } catch {
    return true;
  }
}

async function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error('Could not read image'));
    reader.readAsDataURL(blob);
  });
}

async function fetchAsDataUrl(src: string): Promise<string> {
  const target = needsProxy(src)
    ? `${API_BASE}/media/profile-photo?src=${encodeURIComponent(src)}`
    : src;

  const response = await fetch(target, {
    credentials: needsProxy(src) ? 'include' : 'omit',
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error(`Image fetch failed (${response.status})`);
  }
  return blobToDataUrl(await response.blob());
}

/**
 * Replace cross-origin &lt;img&gt; sources with data URLs so html-to-image
 * does not taint the canvas when R2 CORS is missing.
 */
export async function inlineImagesForCapture(
  root: HTMLElement,
): Promise<() => void> {
  const images = Array.from(root.querySelectorAll('img'));
  const restores: Array<() => void> = [];

  await Promise.all(
    images.map(async (img) => {
      const src = img.getAttribute('src') || img.currentSrc || '';
      if (isInlineSrc(src)) return;

      try {
        const dataUrl = await fetchAsDataUrl(src);
        const previous = img.getAttribute('src') ?? src;
        restores.push(() => {
          img.setAttribute('src', previous);
        });
        img.removeAttribute('crossorigin');
        img.src = dataUrl;
        if (typeof img.decode === 'function') {
          await img.decode().catch(() => undefined);
        }
      } catch {
        // Leave original src; capture may still fail with a clearer error.
      }
    }),
  );

  return () => {
    for (const restore of restores) restore();
  };
}
