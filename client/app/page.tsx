import { Suspense } from 'react';
import type { Metadata } from 'next';
import { BiodataEditor } from '@/features/biodata/components/editor/BiodataEditor';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { DesignsStrip } from '@/components/landing/DesignsStrip';
import { Pricing } from '@/components/landing/Pricing';
import { Faq } from '@/components/landing/Faq';
import { SiteFooter } from '@/components/landing/SiteFooter';
import {
  languageAlternates,
  organizationJsonLd,
  softwareApplicationJsonLd,
} from '@/lib/seo';

export const metadata: Metadata = {
  title: {
    absolute: 'Free Marriage Biodata Maker | MarriageBio',
  },
  description:
    'Create a print-ready Indian marriage biodata online. Free A4 designs, live preview, PDF and WhatsApp download.',
  alternates: languageAlternates('/'),
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
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', margin: 0 }}>
        Free Marriage Biodata Maker
      </div>
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplicationJsonLd()),
        }}
      />
      <header className="wrap" style={{ paddingTop: 28, paddingBottom: 8 }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          Free Marriage Biodata Maker
        </h1>
        <p style={{ marginTop: 10, color: 'var(--ink-2)', maxWidth: 560 }}>
          Fill in your details, preview live on A4 designs, and download a print-ready PDF or
          WhatsApp image.
        </p>
      </header>
      <Suspense fallback={<EditorFallback />}>
        <BiodataEditor showSiteFooter={false} />
      </Suspense>
      <div className="landing">
        <HowItWorks />
        <DesignsStrip />
        <Pricing />
        <Faq />
        <SiteFooter />
      </div>
    </>
  );
}
