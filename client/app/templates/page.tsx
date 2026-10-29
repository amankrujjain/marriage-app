import type { Metadata } from 'next';
import { SiteHeader } from '@/components/landing/SiteHeader';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { TemplateGallery } from '@/features/templates/gallery/TemplateGallery';
import { breadcrumbJsonLd, languageAlternates } from '@/lib/seo';

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }}
      />
      <SiteHeader variant="gallery" />
      <main id="main">
        <TemplateGallery />
      </main>
      <SiteFooter />
    </div>
  );
}
