'use client';

import { ExportFormat } from '@marriage/shared';
import { useExportBiodata } from '../hooks/useExportBiodata';
import { useAppSelector } from '@/store/hooks';

const FORMATS = [
  { format: ExportFormat.PDF, label: 'PDF' },
  { format: ExportFormat.PNG, label: 'PNG' },
  { format: ExportFormat.JPG, label: 'JPG' },
];

export function ExportActions() {
  const { exportAs } = useExportBiodata();
  const status = useAppSelector((state) => state.export.status);
  const busy = status === 'capturing' || status === 'exporting';

  return (
    <div className="flex flex-wrap gap-2">
      {FORMATS.map((item) => (
        <button
          key={item.format}
          type="button"
          disabled={busy}
          onClick={() => void exportAs(item.format)}
          className="min-h-11 bg-maroon px-4 font-body text-sm text-ivory disabled:opacity-60"
        >
          Download {item.label}
        </button>
      ))}
    </div>
  );
}
