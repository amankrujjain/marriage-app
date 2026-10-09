import type { BiodataViewModel } from '../types/viewModel';
import { PhotoBlock } from '../components/shared/PhotoBlock';
import { SectionBlock } from '../components/shared/SectionBlock';

export function RoyalGoldRenderer({ model }: { model: BiodataViewModel }) {
  return (
    <article className="border-4 border-double border-gold bg-[#1f1410] p-6 text-[#f7efe2]">
      <header className="text-center">
        <p className="font-body text-xs tracking-[0.4em] text-gold uppercase">
          Royal biodata
        </p>
        <h2 className="mt-2 font-display text-3xl text-gold">{model.fullName}</h2>
        <PhotoBlock
          url={model.photoUrl}
          className="mx-auto mt-4 h-36 w-36 object-cover ring-2 ring-gold"
        />
      </header>
      {model.sections.map((section) => (
        <SectionBlock
          key={section.id}
          section={section}
          titleClassName="font-display text-lg text-gold"
        />
      ))}
    </article>
  );
}
