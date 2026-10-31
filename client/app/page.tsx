import { Suspense } from 'react';
import type { Metadata } from 'next';
import { BiodataEditor } from '@/features/biodata/components/editor/BiodataEditor';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { DesignsStrip } from '@/components/landing/DesignsStrip';
import { Pricing } from '@/components/landing/Pricing';
import { Faq, FAQ_ITEMS } from '@/components/landing/Faq';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { SiteHeader } from '@/components/landing/SiteHeader';
import { SpokeHeading } from '@/features/spokes/components/SpokeHeading';
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

const HOME_H1 = 'Free Biodata for Marriage Maker';
const HOME_LEDE =
  'Fill in your details, preview live on A4 designs, and download a print-ready PDF or WhatsApp image.';

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
    <div className="landing editor-page">
      <SiteHeader variant="editor" />
      <SpokeHeading h1={HOME_H1} lede={HOME_LEDE} />
      <p style={{ margin: '0 24px 48px', color: 'var(--ink-2)' }}>
        Loading editor…
      </p>
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
      <Suspense fallback={<EditorFallback />}>
        <BiodataEditor
          showSiteFooter={false}
          pageSlug="home"
          h1={HOME_H1}
          lede={HOME_LEDE}
        />
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
