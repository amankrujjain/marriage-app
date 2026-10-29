import { Suspense } from 'react';
import type { Metadata } from 'next';
import { BiodataEditor } from '@/features/biodata/components/editor/BiodataEditor';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { DesignsStrip } from '@/components/landing/DesignsStrip';
import { Pricing } from '@/components/landing/Pricing';
import { Faq } from '@/components/landing/Faq';

export const metadata: Metadata = {
  title: 'MarriageBio — Marriage biodata maker',
  description:
    'Fill in your details once, try them on every design, and download a print-ready A4 PDF plus a WhatsApp-sized image.',
};

const FAQ_ITEMS = [
  {
    q: 'Do I need an account?',
    a: 'You can design and preview without one. An account lets you keep your saved biodatas in My Designs.',
  },
  {
    q: 'Can I make it in Hindi?',
    a: 'Yes. On the download step you can choose the language for the title lines. Field labels stay in English. More languages are planned.',
  },
  {
    q: 'Can I create a biodata without a photo?',
    a: 'Yes. Skip the photo and the design shows a neutral placeholder. Fields you leave blank do not appear on the page.',
  },
  {
    q: 'Will it fit on one page?',
    a: 'Yes. The preview shows “Fits on 1 page” and scales the text gently when you write a lot. If it still cannot fit, you are told what to shorten.',
  },
  {
    q: 'Can I change details after downloading?',
    a: 'Yes. Open it from My Designs, edit and download again. With the Wedding Pass, re-downloads are free.',
  },
] as const;

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  })),
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
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
      <div className="landing">
        <HowItWorks />
        <DesignsStrip />
        <Pricing />
        <Faq />
      </div>
    </>
  );
}
