import type { BiodataViewModel } from '../types/viewModel';
import { PhotoBlock } from '../components/shared/PhotoBlock';
import { SectionBlock } from '../components/shared/SectionBlock';

export function ElegantSerifRenderer({ model }: { model: BiodataViewModel }) {
  return (
    <article className="bg-[#fbf7f2] px-6 py-8 text-ink">
      <header className="text-center">
        <PhotoBlock
          url={model.photoUrl}
          className="mx-auto h-36 w-36 rounded-full object-cover"
        />
        <h2 className="mt-5 font-display text-4xl font-medium text-[#8a5a44]">
          {model.fullName}
        </h2>
        <p className="mt-2 font-body text-sm tracking-[0.25em] text-ink/50 uppercase">
          Marriage biodata
        </p>
      </header>
      <div className="mx-auto mt-8 max-w-md">
        {model.sections.map((section) => (
          <SectionBlock
            key={section.id}
            section={section}
            titleClassName="font-display text-xl text-[#8a5a44]"
          />
        ))}
      </div>
    </article>
  );
}
