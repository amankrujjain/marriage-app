import { Suspense } from 'react';
import type { Metadata } from 'next';
import { BiodataEditor } from '@/features/biodata/components/editor/BiodataEditor';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { DesignsStrip } from '@/components/landing/DesignsStrip';
import { Pricing } from '@/components/landing/Pricing';
import { Faq, FAQ_ITEMS } from '@/components/landing/Faq';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { SpokeRelatedLinks } from '@/features/spokes/components/SpokeRelatedLinks';
import {
  languageAlternates,
  organizationJsonLd,
  softwareApplicationJsonLd,
} from '@/lib/seo';

export const metadata: Metadata = {
  title: {
    absolute: 'Biodata for Marriage: Free Maker, Word & PDF',
  },
  description:
    'Create a print-ready Indian marriage biodata online. Free A4 designs, live preview, PDF and WhatsApp download.',
  alternates: languageAlternates('/'),
};

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
        Free Biodata for Marriage Maker
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
          Free Biodata for Marriage Maker
        </h1>
        <p style={{ marginTop: 10, color: 'var(--ink-2)', maxWidth: 560 }}>
          Fill in your details, preview live on A4 designs, and download a print-ready PDF or
          WhatsApp image.
        </p>
      </header>
      <Suspense fallback={<EditorFallback />}>
        <BiodataEditor showSiteFooter={false} pageSlug="home" />
      </Suspense>
      <div className="landing">
        <HowItWorks />
        <DesignsStrip />
        <Pricing />
        <Faq />
        <SpokeRelatedLinks variant="hub" />
        <SiteFooter />
      </div>
    </>
  );
}
