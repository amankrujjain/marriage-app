import type { ReactNode } from 'react';
import { Suspense } from 'react';
import Link from 'next/link';
import type { SpokeFaq as SpokeFaqItem, SpokePageConfig } from '@/content/spokes/types';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { SiteHeader } from '@/components/landing/SiteHeader';
import { BiodataEditor } from '@/features/biodata/components/editor/BiodataEditor';
import { SpokePresetProvider } from '@/features/spokes/SpokePresetContext';
import { sampleImageMap } from '@/features/spokes/sampleImages';
import {
  absoluteUrl,
  breadcrumbJsonLd,
  SITE_URL,
  softwareApplicationJsonLd,
} from '@/lib/seo';
import { SpokeDownloads } from './SpokeDownloads';
import { SpokeFaq } from './SpokeFaq';
import { SpokeHeading } from './SpokeHeading';
import { hasOnlyUnpublishedLinks, stripLinks } from './SpokeInline';
import { SpokeRelatedLinks } from './SpokeRelatedLinks';
import { SpokeSamples } from './SpokeSamples';
import { SpokeSections } from './SpokeSections';
import { SpokeSteps } from './SpokeSteps';
import { SpokeTips } from './SpokeTips';

function EditorFallback({
  h1,
  lede,
  beforeMaker,
}: {
  h1: string;
  lede?: string;
  beforeMaker?: ReactNode;
}) {
  return (
    <div className="landing editor-page">
      <SiteHeader variant="editor" />
      <SpokeHeading h1={h1} lede={lede} />
      {beforeMaker}
      <p style={{ margin: '0 24px 48px', color: 'var(--ink-2)' }}>
        Loading editor…
      </p>
    </div>
  );
}

function shortLede(intro: string): string {
  const trimmed = intro.trim();
  if (!trimmed) return '';
  const sentence = trimmed.split(/(?<=\.)\s+/)[0];
  return sentence && sentence.length <= 220 ? sentence : trimmed.slice(0, 160);
}

function visibleFaqs(faqs: SpokeFaqItem[]): SpokeFaqItem[] {
  return faqs.filter(
    (f) => !(f.hideUnlinked && hasOnlyUnpublishedLinks(f.a)),
  );
}

function faqJsonLd(faqs: SpokeFaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: stripLinks(item.a),
      },
    })),
  };
}

function articleJsonLd(page: SpokePageConfig) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: page.h1,
    description: page.metaDescription,
    inLanguage: 'en-IN',
    mainEntityOfPage: absoluteUrl(page.path),
    datePublished: page.plannedDate,
    dateModified: page.plannedDate,
    author: {
      '@type': 'Organization',
      name: 'MarriageBio',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'MarriageBio',
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/icon-512.png'),
      },
    },
  };
}

function IntroBlock({
  intro,
  heading,
  compact,
}: {
  intro: string;
  heading?: string;
  /** Between H1 and maker — less padding than a full landing section. */
  compact?: boolean;
}) {
  return (
    <section
      className={compact ? 'sec spoke-intro-pre' : 'sec'}
      aria-labelledby="spoke-intro-h"
    >
      <div className="wrap">
        <div className="sec-head reveal">
          <h2 id="spoke-intro-h">{heading ?? 'About this format'}</h2>
        </div>
        <p
          className="reveal"
          style={{ maxWidth: 640, margin: '0 auto', color: 'var(--ink-2)' }}
        >
          {intro}
        </p>
      </div>
    </section>
  );
}

function LandingBody({
  page,
  imageBySlug,
  includeIntro,
  faqs,
}: {
  page: SpokePageConfig;
  imageBySlug: Record<string, string>;
  includeIntro: boolean;
  faqs: SpokeFaqItem[];
}) {
  return (
    <div className="landing">
      {includeIntro && page.intro ? (
        <IntroBlock intro={page.intro} heading={page.introHeading} />
      ) : null}
      <SpokeSections sections={page.sections ?? []} />
      <SpokeSteps steps={page.steps} />
      <SpokeSamples page={page} imageBySlug={imageBySlug} />
      <SpokeTips tips={page.tips} />
      <SpokeFaq faqs={faqs} />
      <SpokeRelatedLinks page={page} />
    </div>
  );
}

export function SpokePage({ page }: { page: SpokePageConfig }) {
  const crumbs = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: page.breadcrumbName, path: page.path },
  ]);
  const faqs = visibleFaqs(page.faqs);
  const faqLd = faqJsonLd(faqs);
  const downloadsFirst = page.makerPosition === 'afterDownloads';
  const afterIntro = page.makerPosition === 'afterIntro';
  const noMaker = page.makerPosition === 'none';
  const lede = downloadsFirst
    ? page.intro
    : afterIntro || noMaker
      ? undefined
      : shortLede(page.intro);
  const beforeMaker = downloadsFirst ? (
    <SpokeDownloads
      heading={page.downloadsHeading ?? ''}
      items={page.sampleDownloads}
    />
  ) : afterIntro && page.intro ? (
    <IntroBlock
      intro={page.intro}
      heading={page.introHeading}
      compact
    />
  ) : null;
  const imageBySlug = sampleImageMap(
    page.pageSlug,
    page.samples.designSlugs?.length
      ? page.samples.designSlugs
      : [],
  );

  const editor = (
    <Suspense
      fallback={
        <EditorFallback
          h1={page.h1}
          lede={lede || undefined}
          beforeMaker={beforeMaker}
        />
      }
    >
      <BiodataEditor
        showSiteFooter={false}
        preset={page.preset}
        pageSlug={page.pageSlug}
        h1={page.h1}
        lede={lede || undefined}
        beforeMaker={beforeMaker}
      />
    </Suspense>
  );

  const articleOnly = (
    <div className="landing">
      <SiteHeader variant="editor" />
      <SpokeHeading h1={page.h1} lede={page.intro} />
      {page.introCta ? (
        <div className="wrap" style={{ paddingBottom: 24 }}>
          <Link className="btn btn-primary" href={page.introCta.href}>
            {page.introCta.label}
          </Link>
        </div>
      ) : null}
    </div>
  );

  const body = (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplicationJsonLd()),
        }}
      />
      {page.articleSchema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleJsonLd(page)),
          }}
        />
      ) : null}
      {noMaker ? articleOnly : editor}
      <LandingBody
        page={page}
        imageBySlug={imageBySlug}
        includeIntro={!afterIntro && !downloadsFirst && !noMaker}
        faqs={faqs}
      />
      <div className="landing">
        <SiteFooter />
      </div>
    </>
  );

  const wrapped =
    page.language === 'en' ? (
      body
    ) : (
      <div lang={page.language}>{body}</div>
    );

  return (
    <SpokePresetProvider faith={page.preset.faith}>
      {wrapped}
    </SpokePresetProvider>
  );
}
