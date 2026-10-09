'use client';

import { useAppSelector } from '@/store/hooks';

export function WhatsAppShareButton() {
  const result = useAppSelector((state) => state.export.result);
  if (!result) return null;

  return (
    <a
      href={result.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-11 items-center justify-center border border-maroon px-5 font-body text-sm text-maroon"
    >
      Share on WhatsApp
    </a>
  );
}
