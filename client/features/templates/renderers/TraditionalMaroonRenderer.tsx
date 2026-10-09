import type { BiodataViewModel } from '../types/viewModel';
import { PhotoBlock } from '../components/shared/PhotoBlock';
import { SectionBlock } from '../components/shared/SectionBlock';

export function TraditionalMaroonRenderer({ model }: { model: BiodataViewModel }) {
  return (
    <article className="border-[3px] border-maroon bg-[#fffaf5] p-6 text-ink shadow-sm">
      <header className="border-b border-gold pb-4 text-center">
        <p className="font-display text-xs tracking-[0.35em] text-maroon uppercase">
          Marriage Biodata
        </p>
        <h2 className="mt-2 font-display text-3xl text-maroon">{model.fullName}</h2>
        <div className="mx-auto mt-3 h-px w-20 bg-gold" />
      </header>
      <div className="mt-5 flex flex-col gap-4 sm:flex-row">
        <PhotoBlock
          url={model.photoUrl}
          className="mx-auto h-36 w-36 object-cover ring-2 ring-gold sm:mx-0"
        />
        <div className="flex-1">
          {model.sections.map((section) => (
            <SectionBlock
              key={section.id}
              section={section}
              titleClassName="font-display text-lg text-maroon"
            />
          ))}
        </div>
      </div>
    </article>
  );
}
