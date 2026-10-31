'use client';

import Link from 'next/link';
import { getFooterFormatLinks } from '@/content/nav/formatsNav';
import { clearCookieConsent } from '@/lib/analytics';
import { BrandLogo } from './BrandLogo';
import { BrandMark } from './BrandMark';
import { Toast } from './Toast';
import { useToast } from './useToast';

type SiteFooterProps = {
  /** @deprecated Prefer `variant="mini"`. */
  slim?: boolean;
  variant?: 'full' | 'mini';
};

export function SiteFooter({ slim = false, variant }: SiteFooterProps) {
  const { message, toast } = useToast();
  const year = new Date().getFullYear();
  const formatLinks = getFooterFormatLinks();
  const mode = variant ?? (slim ? 'mini' : 'full');

  const termsBtn = (
    <button
      type="button"
      className="linkish"
      onClick={() => toast('Terms is a placeholder. It is not built yet.')}
    >
      Terms
    </button>
  );

  if (mode === 'mini') {
    return (
      <>
        <footer className="foot-mini">
          <div className="wrap">
            <span className="foot-mini-copy">
              <BrandMark />© {year} MarriageBio
            </span>
            <nav aria-label="Legal">
              <Link href="/privacy/">Privacy</Link>
              {termsBtn}
              <button
                type="button"
                className="linkish"
                onClick={() => clearCookieConsent()}
              >
                Cookie settings
              </button>
              <a
                className="foot-contact"
                href="mailto:support@example.com"
              >
                Contact
              </a>
            </nav>
          </div>
        </footer>
        <Toast message={message} />
      </>
    );
  }

  const colsClass = formatLinks.length > 0 ? 'cols-4' : 'cols-3';

  return (
    <>
      <footer className="site-foot">
        <div className="wrap">
          <div className={`foot-grid ${colsClass}`}>
            <div className="foot-brand">
              <BrandLogo href="/" light />
              <p style={{ marginTop: 14, maxWidth: 280 }}>
                Marriage biodata designs, made respectfully for Indian families.
                Free tools for the wedding ahead.
              </p>
            </div>
            <div className="foot-col">
              <h4>Make</h4>
              <Link href="/">Create my biodata</Link>
              <Link href="/templates/">Browse designs</Link>
              <Link href="/wedding-pass/">Wedding Pass</Link>
            </div>
            {formatLinks.length > 0 ? (
              <div className="foot-col">
                <h4>Biodata formats</h4>
                {formatLinks.map((link) => (
                  <Link key={link.href} href={link.href} lang={link.lang}>
                    {link.label}
                  </Link>
                ))}
              </div>
            ) : null}
            <div className="foot-col">
              <h4>Account</h4>
              <Link href="/login/">Sign in</Link>
              <Link href="/register/">Sign up</Link>
              <Link href="/my-designs/">My Designs</Link>
              <Link href="/account/">Profile</Link>
            </div>
          </div>
          <div className="foot-bottom">
            <span>© {year} MarriageBio. All rights reserved.</span>
            <nav aria-label="Legal">
              <Link href="/privacy/">Privacy</Link>
              <button
                type="button"
                className="linkish"
                onClick={() => clearCookieConsent()}
              >
                Cookie settings
              </button>
              {termsBtn}
              <a
                className="foot-contact"
                href="mailto:support@example.com"
              >
                Contact
              </a>
            </nav>
          </div>
        </div>
      </footer>
      <Toast message={message} />
    </>
  );
}
