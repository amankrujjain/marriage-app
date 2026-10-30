'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PREMIUM_AMOUNT_INR, PREMIUM_DURATION_DAYS } from '@marriage/shared';
import { SiteHeader } from '@/components/landing/SiteHeader';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { OrnamentDivLotus } from '@/components/landing/Ornaments';
import { Toast } from '@/components/landing/Toast';
import { useToast } from '@/components/landing/useToast';
import { useReveal } from '@/components/landing/useReveal';
import { useAppSelector } from '@/store/hooks';
import { useWeddingPassCheckout } from '@/features/billing/hooks/useWeddingPassCheckout';

export default function WeddingPassPage() {
  const { message, toast } = useToast();
  useReveal('.pass-page');
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const authStatus = useAppSelector((state) => state.auth.status);
  const { startCheckout, busy, error } = useWeddingPassCheckout();
  const [done, setDone] = useState(false);

  async function onPay(): Promise<void> {
    const ok = await startCheckout();
    if (ok) {
      setDone(true);
      toast('Wedding Pass activated. Enjoy premium downloads!');
      router.push('/download/');
    }
  }

  const isPremium = Boolean(user?.isPremium);

  return (
    <div className="landing pass-page">
      <SiteHeader variant="app" />
      <div className="auth-bg" style={{ minHeight: 'calc(100vh - 74px)' }}>
        <main
          id="main"
          className="pass-wrap"
          style={{ position: 'relative', zIndex: 1, marginBottom: 60 }}
        >
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
              Valid for {PREMIUM_DURATION_DAYS} days
            </div>
            <h2>Includes</h2>
            <ul className="inc">
              <li>PDF + WhatsApp image</li>
              <li>No credit line</li>
              <li>Free re-downloads</li>
              <li>All premium designs</li>
            </ul>

            {isPremium ? (
              <>
                <p className="note" style={{ margin: '0 0 12px' }}>
                  You already have an active Wedding Pass
                  {user?.premiumUntil
                    ? ` until ${new Date(user.premiumUntil).toLocaleDateString()}`
                    : ''}
                  .
                </p>
                <Link className="btn btn-primary btn-block" href="/download">
                  Continue to download
                </Link>
              </>
            ) : (
              <button
                className="btn btn-primary btn-block"
                type="button"
                disabled={busy || authStatus === 'loading'}
                onClick={() => void onPay()}
              >
                {busy ? 'Processing…' : 'Continue to pay'}
              </button>
            )}

            <div className="upi">Secure payment via Razorpay · UPI, cards &amp; more</div>
            {error ? (
              <p className="err" style={{ margin: '14px 0 0' }} role="alert">
                {error}
              </p>
            ) : null}
            {done ? null : (
              <p className="note" style={{ margin: '18px 0 0' }}>
                <Link href="/templates">See the premium designs</Link>
                {' · '}
                <Link href="/download">Back to download</Link>
              </p>
            )}
          </div>
        </main>
      </div>
      <SiteFooter slim />
      <Toast message={message} />
    </div>
  );
}
