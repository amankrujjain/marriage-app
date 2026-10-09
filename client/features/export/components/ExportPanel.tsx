'use client';

import Link from 'next/link';
import { useAppSelector } from '@/store/hooks';
import { ExportActions } from './ExportActions';
import { WhatsAppShareButton } from './WhatsAppShareButton';

export function ExportPanel() {
  const isPremium = useAppSelector((state) => state.auth.user?.isPremium ?? false);
  const status = useAppSelector((state) => state.export.status);
  const error = useAppSelector((state) => state.export.error);
  const result = useAppSelector((state) => state.export.result);

  return (
    <div className="mt-4 border border-maroon/15 bg-ivory/70 p-4">
      <p className="font-display text-xl text-maroon">Export</p>
      {!isPremium ? (
        <p className="mt-2 font-body text-sm text-ink/70">
          Preview is free. Download & WhatsApp share need the{' '}
          <Link href="/wedding-pass" className="text-maroon underline decoration-gold">
            ₹151 Wedding Pass
          </Link>
          .
        </p>
      ) : (
        <p className="mt-2 font-body text-sm text-ink/70">
          Download your biodata or share the link on WhatsApp.
        </p>
      )}
      <div className="mt-4 flex flex-col gap-3">
        <ExportActions />
        {status === 'capturing' ? (
          <p className="text-sm text-ink/60">Capturing preview…</p>
        ) : null}
        {status === 'exporting' ? (
          <p className="text-sm text-ink/60">Preparing file…</p>
        ) : null}
        {error ? <p className="text-sm text-maroon">{error}</p> : null}
        {result ? (
          <div className="flex flex-col gap-2">
            <a
              href={result.url}
              download={result.fileName}
              className="font-body text-sm text-maroon underline decoration-gold"
            >
              Open {result.format.toUpperCase()} file
            </a>
            <WhatsAppShareButton />
          </div>
        ) : null}
      </div>
    </div>
  );
}
