'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { formatDateDisplay } from '@/lib/formatDate';
import { loadEditorSections } from '@/features/biodata/components/editor/loadEditorSections';
import type { EditorSectionDef } from '@/features/biodata/components/editor/editorSectionModel';

type CheckKey = 'name' | 'dob' | 'phone' | 'photo';

function fieldBySync(sections: EditorSectionDef[], sync: string): string {
  for (const section of sections) {
    for (const field of section.fields) {
      if (field.sync === sync && field.value.trim()) {
        return field.value.trim();
      }
    }
  }
  return '';
}

export function DownloadChecklist() {
  const content = useAppSelector((state) => state.biodata.content);
  const [sections, setSections] = useState<EditorSectionDef[]>([]);
  const [checked, setChecked] = useState<Record<CheckKey, boolean>>({
    name: false,
    dob: false,
    phone: false,
    photo: false,
  });

  useEffect(() => {
    setSections(loadEditorSections());
  }, []);

  const details = useMemo(() => {
    const name =
      content.personal.fullName?.trim() ||
      fieldBySync(sections, 'personal.fullName') ||
      '—';
    const dobRaw =
      content.personal.dateOfBirth?.trim() ||
      fieldBySync(sections, 'personal.dateOfBirth');
    const phone =
      content.contact.phone?.trim() ||
      fieldBySync(sections, 'contact.phone') ||
      '—';
    const hasPhoto = Boolean(content.profilePhotoUrl);

    return {
      name,
      dob: dobRaw ? formatDateDisplay(dobRaw) : '—',
      phone,
      hasPhoto,
    };
  }, [content, sections]);

  const items: Array<{ key: CheckKey; label: string; detail: string }> = [
    { key: 'name', label: 'Name spelled correctly', detail: details.name },
    { key: 'dob', label: 'Date of birth', detail: details.dob },
    { key: 'phone', label: 'Mobile number works', detail: details.phone },
    {
      key: 'photo',
      label: 'Photo is clear and recent',
      detail: details.hasPhoto ? 'Photo added' : 'No photo',
    },
  ];

  return (
    <div className="dl-card">
      <b>Before you send it</b>
      {items.map((item) => (
        <label key={item.key} className="dl-check">
          <input
            type="checkbox"
            checked={checked[item.key]}
            onChange={(e) =>
              setChecked((prev) => ({ ...prev, [item.key]: e.target.checked }))
            }
          />
          <span>
            {item.label}{' '}
            <span className="dl-check-detail">· {item.detail}</span>
          </span>
        </label>
      ))}
    </div>
  );
}
