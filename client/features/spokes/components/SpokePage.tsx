import { Suspense } from 'react';
import type { SpokePageConfig } from '@/content/spokes/types';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { BiodataEditor } from '@/features/biodata/components/editor/BiodataEditor';
import { SpokePresetProvider } from '@/features/spokes/SpokePresetContext';
import { sampleImageMap } from '@/features/spokes/sampleImages';
import { breadcrumbJsonLd } from '@/lib/seo';
import { SpokeFaq } from './SpokeFaq';
import { SpokeRelatedLinks } from './SpokeRelatedLinks';
import { SpokeSamples } from './SpokeSamples';
import { SpokeSteps } from './SpokeSteps';
import { SpokeTips } from './SpokeTips';

function EditorFallback() {
  return (
    <div className="landing editor-page" style={{ padding: '48px 24px' }}>
      <p style={{ margin: 0, color: 'var(--ink-2)' }}>Loading editor…</p>
    </div>
  );
}

function shortLede(intro: string): string {
  const trimmed = intro.trim();
  if (!trimmed) return '';
  const sentence = trimmed.split(/(?<=\.)\s+/)[0];
  return sentence && sentence.length <= 220 ? sentence : trimmed.slice(0, 160);
}

function faqJsonLd(page: SpokePageConfig) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faqs.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };
}

function LandingBody({
  page,
  imageBySlug,
  includeIntro,
}: {
  page: SpokePageConfig;
  imageBySlug: Record<string, string>;
  includeIntro: boolean;
}) {
  return (
    <div className="landing">
      {includeIntro && page.intro ? (
        <section className="sec" aria-labelledby="spoke-intro-h">
          <div className="wrap">
            <div className="sec-head reveal">
              <h2 id="spoke-intro-h">About this format</h2>
            </div>
            <p className="reveal" style={{ maxWidth: 640, color: 'var(--ink-2)' }}>
              {page.intro}
            </p>
          </div>
        </section>
      ) : null}
      <SpokeSteps steps={page.steps} />
      <SpokeSamples page={page} imageBySlug={imageBySlug} />
      <SpokeTips tips={page.tips} />
      <SpokeFaq faqs={page.faqs} />
      <SpokeRelatedLinks page={page} />
    </div>
  );
}

export function SpokePage({ page }: { page: SpokePageConfig }) {
  const crumbs = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: page.breadcrumbName, path: page.path },
  ]);
  const faqLd = faqJsonLd(page);
  const lede = shortLede(page.intro);
  const imageBySlug = sampleImageMap(
    page.pageSlug,
    page.samples.designSlugs?.length
      ? page.samples.designSlugs
      : [],
  );
  const afterIntro = page.makerPosition === 'afterIntro';

  const header = (
    <header className="wrap" style={{ paddingTop: 28, paddingBottom: 8 }}>
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
          margin: 0,
          lineHeight: 1.2,
        }}
      >
        {page.h1}
      </h1>
      {lede ? (
        <p style={{ marginTop: 10, color: 'var(--ink-2)', maxWidth: 560 }}>
          {lede}
        </p>
      ) : null}
    </header>
  );

  const editor = (
    <Suspense fallback={<EditorFallback />}>
      <BiodataEditor
        showSiteFooter={false}
        preset={page.preset}
        pageSlug={page.pageSlug}
        heading={page.h1}
      />
    </Suspense>
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
      {header}
      {afterIntro ? (
        <>
          {page.intro ? (
            <div className="landing">
              <section className="sec" aria-labelledby="spoke-intro-h">
                <div className="wrap">
                  <div className="sec-head reveal">
                    <h2 id="spoke-intro-h">About this format</h2>
                  </div>
                  <p
                    className="reveal"
                    style={{ maxWidth: 640, color: 'var(--ink-2)' }}
                  >
                    {page.intro}
                  </p>
                </div>
              </section>
            </div>
          ) : null}
          {editor}
          <LandingBody page={page} imageBySlug={imageBySlug} includeIntro={false} />
        </>
      ) : (
        <>
          {editor}
          <LandingBody page={page} imageBySlug={imageBySlug} includeIntro />
        </>
      )}
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
