import type { BiodataSectionView } from '../../types/viewModel';

export function SectionBlock({
  section,
  titleClassName,
  rowClassName,
}: {
  section: BiodataSectionView;
  titleClassName: string;
  rowClassName?: string;
}) {
  return (
    <section className="mt-4">
      <h3 className={titleClassName}>{section.title}</h3>
      <dl className={rowClassName ?? 'mt-2 space-y-1.5'}>
        {section.rows.map((row) => (
          <div key={row.key} className="grid grid-cols-[40%_1fr] gap-2 text-sm">
            <dt className="opacity-70">{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
