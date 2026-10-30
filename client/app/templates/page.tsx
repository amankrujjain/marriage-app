import type { Metadata } from 'next';
import { SiteHeader } from '@/components/landing/SiteHeader';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { TemplateGallery } from '@/features/templates/gallery/TemplateGallery';
import { SpokeRelatedLinks } from '@/features/spokes/components/SpokeRelatedLinks';
import { breadcrumbJsonLd, languageAlternates } from '@/lib/seo';
import { TemplatesPageContext } from './TemplatesPageContext';

export const metadata: Metadata = {
  title: 'Marriage Biodata Designs',
  description:
    'Browse traditional, royal, floral and modern A4 marriage biodata designs for Indian families.',
  alternates: languageAlternates('/templates/'),
};

const crumbs = breadcrumbJsonLd([
  { name: 'Home', path: '/' },
  { name: 'Designs', path: '/templates/' },
]);

export default function TemplatesPage() {
  return (
    <div className="landing">
      <TemplatesPageContext />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }}
      />
      <SiteHeader variant="gallery" />
      <main id="main">
        <TemplateGallery />
        <SpokeRelatedLinks variant="hub" />
      </main>
      <SiteFooter />
    </div>
  );
}
