'use client';

import { listTemplates } from '@marriage/shared';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectTemplate } from '../store/templateSlice';
import { TemplateCard } from './TemplateCard';

export function TemplateGallery() {
  const dispatch = useAppDispatch();
  const selected = useAppSelector((state) => state.template.selectedTemplateId);
  const templates = listTemplates();

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          selected={selected === template.id}
          onSelect={() => dispatch(selectTemplate(template.id))}
        />
      ))}
    </div>
  );
}
