'use client';

import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import { buildViewModel } from '../utils/buildViewModel';
import { renderTemplate } from '../engine/renderTemplate';

export function LivePreview() {
  const original = useAppSelector((state) => state.biodata.content);
  const translated = useAppSelector((state) => state.language.translatedContent);
  const templateId = useAppSelector((state) => state.template.selectedTemplateId);
  const content = translated ?? original;
  const model = useMemo(() => buildViewModel(content), [content]);

  return (
    <div className="overflow-hidden rounded-sm bg-white/40 p-2 sm:p-4">
      <div data-biodata-preview className="mx-auto max-w-lg">
        {renderTemplate(templateId, model)}
      </div>
    </div>
  );
}
