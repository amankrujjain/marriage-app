import { Suspense } from 'react';
import type { Metadata } from 'next';
import { home } from '@/content/spokes/home';
import { BiodataEditor } from '@/features/biodata/components/editor/BiodataEditor';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { DesignsStrip } from '@/components/landing/DesignsStrip';
import { Pricing } from '@/components/landing/Pricing';
import { Faq, FAQ_ITEMS } from '@/components/landing/Faq';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { SiteHeader } from '@/components/landing/SiteHeader';
import { SpokeHeading } from '@/features/spokes/components/SpokeHeading';
import { SpokeRelatedLinks } from '@/features/spokes/components/SpokeRelatedLinks';
import { SpokeSections } from '@/features/spokes/components/SpokeSections';
import {
  languageAlternates,
  organizationJsonLd,
  softwareApplicationJsonLd,
} from '@/lib/seo';

export const metadata: Metadata = {
  title: {
    absolute: home.title,
  },
  description: home.metaDescription,
  alternates: languageAlternates('/'),
};

const HOME_H1 = home.h1;
const HOME_LEDE = home.intro;

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
  const topSections = (home.sections ?? []).filter(
    (s) => s.id === 'what-is' || s.id === 'what-to-put',
  );
  const bottomSections = (home.sections ?? []).filter(
    (s) => s.id === 'every-family' || s.id === 'why',
  );

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
          preset={home.preset}
          h1={HOME_H1}
          lede={HOME_LEDE}
        />
      </Suspense>
      <div className="landing">
        <SpokeSections sections={topSections} />
        <HowItWorks />
        <DesignsStrip />
        <SpokeSections sections={bottomSections} />
        <Pricing />
        <Faq />
        <SpokeRelatedLinks variant="hub" />
        <SiteFooter />
      </div>
    </>
  );
}
