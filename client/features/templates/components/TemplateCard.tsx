'use client';

import type { TemplateDefinition } from '@marriage/shared';

export function TemplateCard({
  template,
  selected,
  onSelect,
}: {
  template: TemplateDefinition;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full border p-3 text-left transition ${
        selected
          ? 'border-maroon bg-ivory ring-1 ring-maroon'
          : 'border-maroon/15 bg-ivory/60 hover:border-maroon/40'
      }`}
    >
      <div
        className="mb-3 h-20 w-full"
        style={{
          background: `linear-gradient(145deg, ${template.previewTone} 0%, #faf6ef 70%)`,
        }}
      />
      <p className="font-display text-lg text-maroon">{template.name}</p>
      <p className="mt-1 font-body text-xs tracking-wide text-ink/50 uppercase">
        {template.category}
      </p>
      <p className="mt-2 font-body text-sm text-ink/70">{template.description}</p>
    </button>
  );
}
