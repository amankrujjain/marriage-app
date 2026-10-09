'use client';

import { LANGUAGE_OPTIONS, getTemplateById } from '@marriage/shared';
import { useAppSelector } from '@/store/hooks';
import { LivePreview } from '@/features/templates/components/LivePreview';
import { ExportPanel } from '@/features/export/components/ExportPanel';

export function PreviewStep() {
  const templateId = useAppSelector((state) => state.template.selectedTemplateId);
  const language = useAppSelector((state) => state.language.exportLanguage);
  const provider = useAppSelector((state) => state.language.provider);
  const template = getTemplateById(templateId);
  const langLabel =
    LANGUAGE_OPTIONS.find((item) => item.code === language)?.nativeName ?? language;

  return (
    <div className="flex flex-col gap-4">
      <p className="font-body text-ink/75">
        Preview — {template?.name ?? 'Template'} · {langLabel}
        {provider ? ` · ${provider}` : ''}.
      </p>
      <LivePreview />
      <ExportPanel />
    </div>
  );
}
