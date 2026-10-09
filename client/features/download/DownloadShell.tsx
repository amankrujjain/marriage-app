'use client';

import { DownloadAppBar } from './DownloadAppBar';
import { DownloadPreviews } from './DownloadPreviews';
import { DownloadChecklist } from './DownloadChecklist';
import { DownloadCheckout } from './DownloadCheckout';

export function DownloadShell() {
  return (
    <div className="dl">
      <DownloadAppBar />
      <div className="dl-layout">
        <DownloadPreviews />
        <aside className="dl-aside">
          <DownloadChecklist />
          <DownloadCheckout />
          <div className="dl-privacy">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2F6B45"
              strokeWidth="2"
              aria-hidden
            >
              <rect x="5" y="11" width="14" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
            <span>
              Only your account is used to verify payment. Your biodata details stay in this
              browser session until you save or export.
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
}
