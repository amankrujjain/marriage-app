'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getOriginPath } from '@/lib/analytics';

export function DownloadAppBar() {
  const [editHref, setEditHref] = useState('/');

  useEffect(() => {
    const origin = getOriginPath();
    if (origin && origin.startsWith('/') && !origin.startsWith('//')) {
      setEditHref(origin);
    }
  }, []);

  return (
    <header className="dl-bar">
      <div className="dl-bar-inner">
        <Link href="/" className="dl-brand">
          MarriageBio
        </Link>
        <ol className="dl-steps">
          <li className="dl-step is-done">
            <span className="dl-step-num is-done">✓</span>
            Your details
          </li>
          <li className="dl-step-rule" aria-hidden />
          <li className="dl-step is-done">
            <span className="dl-step-num is-done">✓</span>
            Design
          </li>
          <li className="dl-step-rule" aria-hidden />
          <li className="dl-step is-active">
            <span className="dl-step-num">3</span>
            Download
          </li>
        </ol>
        <Link href={editHref} className="dl-edit-link">
          ← Edit details
        </Link>
      </div>
    </header>
  );
}
