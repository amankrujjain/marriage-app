import type { Metadata } from 'next';
import { templates } from '@/content/spokes/templates';
import { SiteHeader } from '@/components/landing/SiteHeader';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { TemplateGallery } from '@/features/templates/gallery/TemplateGallery';
import { SpokeFaq } from '@/features/spokes/components/SpokeFaq';
import { stripLinks } from '@/features/spokes/components/SpokeInline';
import { SpokeRelatedLinks } from '@/features/spokes/components/SpokeRelatedLinks';
import { SpokeSections } from '@/features/spokes/components/SpokeSections';
import { breadcrumbJsonLd, languageAlternates } from '@/lib/seo';
import { TemplatesPageContext } from './TemplatesPageContext';

export const metadata: Metadata = {
  title: {
    absolute: templates.title,
  },
  description: templates.metaDescription,
  alternates: languageAlternates('/templates/'),
};

const crumbs = breadcrumbJsonLd([
  { name: 'Home', path: '/' },
  { name: 'Designs', path: '/templates/' },
]);

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: templates.faqs.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: stripLinks(item.a),
    },
  })),
};

export default function TemplatesPage() {
  return (
    <div className="landing">
      <TemplatesPageContext />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <SiteHeader variant="gallery" />
      <main id="main">
        <TemplateGallery />
        <SpokeSections sections={templates.sections ?? []} />
        <SpokeFaq faqs={templates.faqs} />
        <SpokeRelatedLinks variant="hub" />
      </main>
      <SiteFooter />
    </div>
  );
}
