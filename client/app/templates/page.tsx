import type { Metadata } from 'next';
import { SiteHeader } from '@/components/landing/SiteHeader';
import { TemplateGallery } from '@/features/templates/gallery/TemplateGallery';

export const metadata: Metadata = {
  title: 'Marriage biodata designs — Vivah Patra',
  description:
    'Browse traditional, royal, floral and modern A4 marriage biodata designs. Filter by community and layout.',
};

export default function TemplatesPage() {
  return (
    <div className="landing">
      <SiteHeader variant="gallery" />
      <TemplateGallery />
    </div>
  );
}
