'use client';

import Link from 'next/link';
import { clearCookieConsent } from '@/lib/analytics';
import { BrandLogo } from './BrandLogo';
import { Toast } from './Toast';
import { useToast } from './useToast';

type SiteFooterProps = {
  slim?: boolean;
};

export function SiteFooter({ slim = false }: SiteFooterProps) {
  const { message, toast } = useToast();
  const year = new Date().getFullYear();

  if (slim) {
    return (
      <>
        <footer className="site-foot foot-slim">
          <div className="wrap">
            <div className="foot-bottom" style={{ border: 0, margin: 0, padding: 0 }}>
              <span>© {year} MarriageBio</span>
              <span>
                <Link href="/privacy" style={{ color: '#BFA99C', display: 'inline' }}>
                  Privacy
                </Link>
                {' · '}
                <button
                  type="button"
                  style={{ all: 'unset', cursor: 'pointer', color: '#BFA99C', display: 'inline' }}
                  onClick={() => clearCookieConsent()}
                >
                  Cookie settings
                </button>
                {' · '}
                <button
                  type="button"
                  style={{ all: 'unset', cursor: 'pointer', color: '#BFA99C', display: 'inline' }}
                  onClick={() => toast('Terms is a placeholder. It is not built yet.')}
                >
                  Terms
                </button>
              </span>
            </div>
          </div>
        </footer>
        <Toast message={message} />
      </>
    );
  }

  return (
    <>
      <footer className="site-foot">
        <div className="wrap">
          <div className="foot-grid">
            <div>
              <BrandLogo href="/" light />
              <p style={{ marginTop: 14, maxWidth: 280 }}>
                Marriage biodata designs, made respectfully for Indian families. Free tools for the
                wedding ahead.
              </p>
            </div>
            <div>
              <h4>Make</h4>
              <Link href="/marriage-biodata-maker">Create my biodata</Link>
              <Link href="/templates">Browse designs</Link>
              <Link href="/wedding-pass">Wedding Pass</Link>
            </div>
            <div>
              <h4>Free tools</h4>
              <Link href="/#tools">Wedding hashtag generator</Link>
              <Link href="/#tools">Wedding budget calculator</Link>
              <Link href="/#tools">Marriage profile maker</Link>
            </div>
            <div>
              <h4>Account</h4>
              <Link href="/login">Sign in</Link>
              <Link href="/register">Sign up</Link>
              <Link href="/my-designs">My Designs</Link>
              <Link href="/account">Profile</Link>
            </div>
          </div>
          <div className="foot-bottom">
            <span>© {year} MarriageBio. All rights reserved.</span>
            <span>
              <Link href="/privacy" style={{ color: '#BFA99C', display: 'inline' }}>
                Privacy
              </Link>
              {' · '}
              <button
                type="button"
                style={{ all: 'unset', cursor: 'pointer', color: '#BFA99C', display: 'inline' }}
                onClick={() => clearCookieConsent()}
              >
                Cookie settings
              </button>
              {' · '}
              <button
                type="button"
                style={{ all: 'unset', cursor: 'pointer', color: '#BFA99C', display: 'inline' }}
                onClick={() => toast('Terms is a placeholder. It is not built yet.')}
              >
                Terms
              </button>
              {' · '}
              <a href="mailto:support@example.com" style={{ display: 'inline' }}>
                Contact
              </a>
            </span>
          </div>
        </div>
      </footer>
      <Toast message={message} />
    </>
  );
}
