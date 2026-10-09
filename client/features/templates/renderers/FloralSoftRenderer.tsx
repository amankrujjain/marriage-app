import type { BiodataViewModel } from '../types/viewModel';
import { PhotoBlock } from '../components/shared/PhotoBlock';
import { SectionBlock } from '../components/shared/SectionBlock';

export function FloralSoftRenderer({ model }: { model: BiodataViewModel }) {
  return (
    <article className="relative overflow-hidden bg-[#fff5f3] p-6 text-ink ring-1 ring-[#c47a7a]/40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle at 10% 10%, #c47a7a 0 2px, transparent 3px), radial-gradient(circle at 90% 20%, #c47a7a 0 2px, transparent 3px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="relative">
        <header className="text-center">
          <h2 className="font-display text-3xl text-[#9a4d4d]">{model.fullName}</h2>
          <p className="mt-1 font-body text-sm text-[#9a4d4d]/80">Marriage biodata</p>
          <PhotoBlock
            url={model.photoUrl}
            className="mx-auto mt-4 h-36 w-36 rounded-full object-cover ring-2 ring-[#c47a7a]/50"
          />
        </header>
        {model.sections.map((section) => (
          <SectionBlock
            key={section.id}
            section={section}
            titleClassName="font-display text-lg text-[#9a4d4d]"
          />
        ))}
      </div>
    </article>
  );
}
