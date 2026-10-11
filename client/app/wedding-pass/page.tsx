'use client';

import Link from 'next/link';
import { PREMIUM_AMOUNT_INR } from '@marriage/shared';
import { SiteHeader } from '@/components/landing/SiteHeader';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { OrnamentDivLotus } from '@/components/landing/Ornaments';
import { Toast } from '@/components/landing/Toast';
import { useToast } from '@/components/landing/useToast';
import { useReveal } from '@/components/landing/useReveal';

export default function WeddingPassPage() {
  const { message, toast } = useToast();
  useReveal('.pass-page');

  return (
    <div className="landing pass-page">
      <SiteHeader variant="pass" />
      <div className="auth-bg" style={{ minHeight: 'calc(100vh - 74px)' }}>
        <main id="main" className="pass-wrap" style={{ position: 'relative', zIndex: 1, marginBottom: 60 }}>
          <div className="pass reveal">
            <OrnamentDivLotus />
            <h1>Wedding Pass</h1>
            <div className="rule" aria-hidden="true">
              <svg width="9" height="9" viewBox="0 0 10 10">
                <path d="M5 0l5 5-5 5-5-5z" fill="currentColor" />
              </svg>
            </div>
            <div className="lbl">Premium Wedding Pass</div>
            <div className="big">₹{PREMIUM_AMOUNT_INR}</div>
            <div className="when">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
              For a limited days only
            </div>
            <h2>Includes</h2>
            <ul className="inc">
              <li>PDF + WhatsApp image</li>
              <li>No credit line</li>
              <li>Free re-downloads</li>
              <li>All premium designs</li>
            </ul>
            <button
              className="btn btn-primary btn-block"
              type="button"
              onClick={() => toast('Payment is a placeholder. UPI is coming soon.')}
            >
              Continue to pay
            </button>
            <div className="upi">UPI coming soon</div>
            <p className="note" style={{ margin: '18px 0 0' }}>
              Payment is not connected in this build.{' '}
              <Link href="/templates">See the premium designs</Link>
            </p>
          </div>
        </main>
      </div>
      <SiteFooter slim />
      <Toast message={message} />
    </div>
  );
}
