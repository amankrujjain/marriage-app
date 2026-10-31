'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SiteHeader } from '@/components/landing/SiteHeader';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { getOriginPath } from '@/lib/analytics';
import { DownloadPreviews } from './DownloadPreviews';
import { DownloadChecklist } from './DownloadChecklist';
import { DownloadCheckout } from './DownloadCheckout';

export type DownloadPlan = 'premium' | 'free';

export function DownloadShell() {
  const [plan, setPlan] = useState<DownloadPlan>('premium');
  const [backHref, setBackHref] = useState('/');

  useEffect(() => {
    const origin = getOriginPath();
    if (origin && origin.startsWith('/') && !origin.startsWith('//')) {
      setBackHref(origin);
    }
  }, []);

  return (
    <ProtectedRoute>
      <div className="landing dl-page">
        <SiteHeader variant="app" />
        <main id="main" className="dl">
          <DownloadPreviews credit={plan === 'free'} />
          <section aria-label="Download options">
            <DownloadChecklist />
            <DownloadCheckout plan={plan} onPlanChange={setPlan} />
            <p style={{ textAlign: 'center', marginTop: 18 }}>
              <Link href={backHref}>← Back to editor</Link>
              {' · '}
              <Link href="/wedding-pass/">About the Wedding Pass</Link>
            </p>
          </section>
        </main>
        <SiteFooter variant="mini" />
      </div>
    </ProtectedRoute>
  );
}
