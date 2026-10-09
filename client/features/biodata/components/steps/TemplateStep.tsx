'use client';

import { TemplateGallery } from '@/features/templates/components/TemplateGallery';

export function TemplateStep() {
  return (
    <div className="flex flex-col gap-4">
      <p className="font-body text-ink/75">
        Choose a design. Your details stay the same across every template.
      </p>
      <TemplateGallery />
    </div>
  );
}
