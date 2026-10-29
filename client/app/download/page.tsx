import type { Metadata } from 'next';
import { DownloadShell } from '@/features/download/DownloadShell';

export const metadata: Metadata = {
  title: 'Download your biodata',
  description: 'Review your biodata, preview it in WhatsApp, and download the A4 PDF.',
  robots: { index: false, follow: false },
};

export default function DownloadPage() {
  return <DownloadShell />;
}
