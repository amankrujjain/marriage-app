import type { Metadata } from 'next';
import { TemplateDemo } from '@/features/demo/TemplateDemo';

export const metadata: Metadata = {
  title: 'Biodata Maker Demo — Vivah Patra',
  description:
    'Edit details on the left and watch a live A4 marriage biodata update on the right.',
};

export default function DemoPage() {
  return <TemplateDemo />;
}
