import type { Metadata } from 'next';
import { DownloadShell } from '@/features/download/DownloadShell';

export const metadata: Metadata = {
  title: 'Download your biodata — Vivah Patra',
  description: 'Review your biodata, preview it in WhatsApp, and download the A4 PDF.',
};

export default function DownloadPage() {
  return <DownloadShell />;
}
