'use client';

export type CookieConsentValue = 'accepted' | 'declined';

const CONSENT_KEY = 'mb_cookie_consent';
const FORM_STARTED_KEY = 'mb_form_started';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function measurementId(): string {
  return (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '').trim();
}

export function getCookieConsent(): CookieConsentValue | null {
  if (typeof window === 'undefined') return null;
  const value = window.localStorage.getItem(CONSENT_KEY);
  if (value === 'accepted' || value === 'declined') return value;
  return null;
}

export function setCookieConsent(value: CookieConsentValue): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(CONSENT_KEY, value);
  if (value === 'accepted') {
    loadGa();
  }
  window.dispatchEvent(new CustomEvent('mb:cookie-consent', { detail: value }));
}

/** Clear preference so the banner can ask again (Cookie settings). */
export function clearCookieConsent(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(CONSENT_KEY);
  window.dispatchEvent(new CustomEvent('mb:cookie-settings'));
}

let gaLoading = false;

/** Load gtag only after Accept and when a measurement ID is configured. */
export function loadGa(): void {
  if (typeof window === 'undefined') return;
  const id = measurementId();
  if (!id || getCookieConsent() !== 'accepted' || gaLoading || window.gtag) {
    if (id && getCookieConsent() === 'accepted' && window.gtag) {
      window.gtag('config', id);
    }
    return;
  }

  gaLoading = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer?.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', id);

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  script.onerror = () => {
    gaLoading = false;
  };
  document.head.appendChild(script);
}

export function trackEvent(
  name: string,
  params?: Record<string, string | number | boolean>,
): void {
  if (typeof window === 'undefined') return;
  if (!measurementId() || getCookieConsent() !== 'accepted') return;
  loadGa();
  window.gtag?.('event', name, params);
}

/** Once per tab session, on first meaningful editor field edit. */
export function trackFormStarted(): void {
  if (typeof window === 'undefined') return;
  if (window.sessionStorage.getItem(FORM_STARTED_KEY) === '1') return;
  window.sessionStorage.setItem(FORM_STARTED_KEY, '1');
  trackEvent('form_started');
}

export function trackDownload(format?: string): void {
  trackEvent('download', format ? { format } : undefined);
}
