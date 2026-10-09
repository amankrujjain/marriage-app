import type { BiodataViewModel } from '../types/viewModel';
import { PhotoBlock } from '../components/shared/PhotoBlock';
import { SectionBlock } from '../components/shared/SectionBlock';

export function ModernCleanRenderer({ model }: { model: BiodataViewModel }) {
  return (
    <article className="bg-white p-6 text-ink ring-1 ring-ink/10">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <PhotoBlock
          url={model.photoUrl}
          className="h-32 w-32 object-cover sm:h-40 sm:w-40"
        />
        <div className="flex-1">
          <p className="font-body text-xs tracking-[0.2em] text-ink/50 uppercase">
            Biodata
          </p>
          <h2 className="mt-1 font-display text-3xl text-ink">{model.fullName}</h2>
          {model.sections.map((section) => (
            <SectionBlock
              key={section.id}
              section={section}
              titleClassName="mt-5 font-body text-xs tracking-[0.18em] text-ink/50 uppercase"
            />
          ))}
        </div>
      </div>
    </article>
  );
}
