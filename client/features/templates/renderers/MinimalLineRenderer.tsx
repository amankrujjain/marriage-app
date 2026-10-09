import type { BiodataViewModel } from '../types/viewModel';
import { PhotoBlock } from '../components/shared/PhotoBlock';
import { SectionBlock } from '../components/shared/SectionBlock';

export function MinimalLineRenderer({ model }: { model: BiodataViewModel }) {
  return (
    <article className="border border-ink/20 bg-white p-6 text-ink">
      <div className="flex items-end justify-between gap-4 border-b border-ink/20 pb-4">
        <div>
          <h2 className="font-display text-3xl">{model.fullName}</h2>
          <p className="mt-1 font-body text-sm text-ink/50">Marriage biodata</p>
        </div>
        <PhotoBlock url={model.photoUrl} className="h-24 w-24 object-cover" />
      </div>
      {model.sections.map((section) => (
        <SectionBlock
          key={section.id}
          section={section}
          titleClassName="border-b border-ink/10 pb-1 font-body text-sm font-medium tracking-wide uppercase"
        />
      ))}
    </article>
  );
}
