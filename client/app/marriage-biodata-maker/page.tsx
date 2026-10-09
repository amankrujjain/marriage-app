import { Suspense } from 'react';
import type { Metadata } from 'next';
import { BiodataEditor } from '@/features/biodata/components/editor/BiodataEditor';

export const metadata: Metadata = {
  title: 'Biodata editor — Vivah Patra',
  description: 'Fill in your details and preview your marriage biodata live on an A4 page.',
};

export default function MarriageBiodataMakerPage() {
  return (
    <Suspense fallback={<div className="editor editor-loading">Loading editor…</div>}>
      <BiodataEditor />
    </Suspense>
  );
}
