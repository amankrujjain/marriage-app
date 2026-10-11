'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SiteHeader } from '@/components/landing/SiteHeader';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { DownloadPreviews } from './DownloadPreviews';
import { DownloadChecklist } from './DownloadChecklist';
import { DownloadCheckout } from './DownloadCheckout';

export type DownloadPlan = 'premium' | 'free';

export function DownloadShell() {
  const [plan, setPlan] = useState<DownloadPlan>('premium');

  return (
    <ProtectedRoute>
      <div className="landing dl-page">
        <SiteHeader variant="minimal" />
        <main id="main" className="dl">
          <DownloadPreviews credit={plan === 'free'} />
          <section aria-label="Download options">
            <DownloadChecklist />
            <DownloadCheckout plan={plan} onPlanChange={setPlan} />
            <p style={{ textAlign: 'center', marginTop: 18 }}>
              <Link href="/marriage-biodata-maker">← Back to editor</Link>
              {' · '}
              <Link href="/wedding-pass">About the Wedding Pass</Link>
            </p>
          </section>
        </main>
        <SiteFooter slim />
      </div>
    </ProtectedRoute>
  );
}
