'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useAppSelector } from '@/store/hooks';
import { formatDateDisplay } from '@/lib/formatDate';
import { loadEditorSections } from '@/features/biodata/components/editor/loadEditorSections';
import type { EditorSectionDef } from '@/features/biodata/components/editor/editorSectionModel';
import { getOriginPath } from '@/lib/analytics';

function fieldBySync(sections: EditorSectionDef[], sync: string): string {
  for (const section of sections) {
    for (const field of section.fields) {
      if (field.sync === sync && field.value.trim()) return field.value.trim();
    }
  }
  return '';
}

function maskPhone(phone: string): string {
  const n = phone.replace(/[^0-9]/g, '');
  if (n.length < 6) return '';
  const last = n.slice(-3);
  const mid = n.slice(-10, -8);
  return `+91 ${mid}••• ••${last}`;
}

export function DownloadChecklist() {
  const content = useAppSelector((state) => state.biodata.content);
  const [sections, setSections] = useState<EditorSectionDef[]>([]);
  const [editHref, setEditHref] = useState('/');

  useEffect(() => {
    setSections(loadEditorSections());
  }, []);

  useEffect(() => {
    const origin = getOriginPath();
    if (origin && origin.startsWith('/') && !origin.startsWith('//')) {
      setEditHref(origin);
    }
  }, []);

  const items = useMemo(() => {
    const name =
      content.personal.fullName?.trim() ||
      fieldBySync(sections, 'personal.fullName');
    const dobRaw =
      content.personal.dateOfBirth?.trim() ||
      fieldBySync(sections, 'personal.dateOfBirth');
    const phoneRaw =
      content.contact.phone?.trim() || fieldBySync(sections, 'contact.phone');
    const phone = maskPhone(phoneRaw);
    const hasPhoto = Boolean(content.profilePhotoUrl);

    return [
      {
        label: 'Name',
        value: name,
        ok: Boolean(name),
      },
      {
        label: 'Date of birth',
        value: dobRaw ? formatDateDisplay(dobRaw) : '',
        ok: Boolean(dobRaw),
      },
      {
        label: 'Mobile',
        value: phone,
        ok: Boolean(phone),
      },
      {
        label: 'Photo added',
        value: hasPhoto ? 'Yes' : 'No',
        ok: hasPhoto,
      },
    ];
  }, [content, sections]);

  return (
    <div className="card">
      <h3>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M8 12.5l3 3 5-6" />
        </svg>
        Before you send it
      </h3>
      <p className="note" style={{ margin: 0 }}>
        Please review the details before downloading.
      </p>
      <ul className="ck">
        {items.map((item) => (
          <li key={item.label} className={item.ok ? '' : 'miss'}>
            <i>{item.ok ? '✓' : '!'}</i>
            {item.label}
            <b>
              {item.ok ? (
                item.value
              ) : item.label === 'Photo added' ? (
                <>
                  No · <Link href={editHref}>Add</Link>
                </>
              ) : (
                <>
                  Missing · <Link href={editHref}>Add</Link>
                </>
              )}
            </b>
          </li>
        ))}
      </ul>
      <div className="info">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden
          style={{ flex: 'none' }}
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v5M12 16.5v.01" />
        </svg>
        <span>This is how your biodata will appear in the PDF.</span>
      </div>
    </div>
  );
}
