'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  getCookieConsent,
  loadGa,
  setCookieConsent,
  type CookieConsentValue,
} from '@/lib/analytics';

export function CookieConsent() {
  const [choice, setChoice] = useState<CookieConsentValue | null | 'unknown'>('unknown');

  useEffect(() => {
    const existing = getCookieConsent();
    setChoice(existing);
    if (existing === 'accepted') loadGa();

    function onSettings() {
      setChoice(null);
    }
    window.addEventListener('mb:cookie-settings', onSettings);
    return () => window.removeEventListener('mb:cookie-settings', onSettings);
  }, []);

  if (choice === 'unknown' || choice === 'accepted' || choice === 'declined') {
    return null;
  }

  function accept() {
    setCookieConsent('accepted');
    setChoice('accepted');
  }

  function decline() {
    setCookieConsent('declined');
    setChoice('declined');
  }

  return (
    <div className="cookie-consent" role="dialog" aria-label="Cookie preferences">
      <div className="cookie-consent-inner">
        <p>
          MarriageBio uses cookies for analytics so we can improve the biodata maker.{' '}
          <Link href="/privacy">Privacy &amp; cookies</Link>
        </p>
        <div className="cookie-consent-actions">
          <button type="button" className="btn btn-line" onClick={decline}>
            Decline
          </button>
          <button type="button" className="btn btn-primary" onClick={accept}>
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
