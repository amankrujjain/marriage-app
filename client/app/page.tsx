import { Suspense } from 'react';
import type { Metadata } from 'next';
import { BiodataEditor } from '@/features/biodata/components/editor/BiodataEditor';

export const metadata: Metadata = {
  title: 'MarriageBio — Marriage biodata maker',
  description:
    'Fill in your details once, try them on every design, and download a print-ready A4 PDF plus a WhatsApp-sized image.',
};

function EditorFallback() {
  return (
    <div className="landing editor-page" style={{ padding: '48px 24px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', margin: 0 }}>
        Create your marriage biodata
      </h1>
      <p style={{ marginTop: 12, color: 'var(--ink-2)' }}>Loading editor…</p>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      {/* SSR SEO shell — present without JS; editor hydrates as the primary UI */}
      <header className="sr-only">
        <h1>MarriageBio — create your marriage biodata</h1>
        <p>
          Beautiful A4 PDF biodata designs for Indian families. Fill in your details, preview live,
          and download a print-ready PDF or WhatsApp image.
        </p>
      </header>
      <Suspense fallback={<EditorFallback />}>
        <BiodataEditor />
      </Suspense>
    </>
  );
}
