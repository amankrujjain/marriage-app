import type { Metadata } from 'next';
import { DownloadShell } from '@/features/download/DownloadShell';

export const metadata: Metadata = {
  title: 'Preview & download — Vivah Patra',
  description: 'Check your biodata once more, then download PDF or WhatsApp image.',
};

export default function DownloadPage() {
  return <DownloadShell />;
}
