'use client';

import { useState } from 'react';
import { useAppSelector } from '@/store/hooks';

type CheckKey = 'name' | 'dob' | 'phone' | 'photo';

export function DownloadChecklist() {
  const content = useAppSelector((state) => state.biodata.content);
  const [checked, setChecked] = useState<Record<CheckKey, boolean>>({
    name: false,
    dob: false,
    phone: false,
    photo: false,
  });

  const name = content.personal.fullName?.trim() || '—';
  const dob = content.personal.dateOfBirth?.trim() || '—';
  const phone = content.contact.phone?.trim() || '—';
  const hasPhoto = Boolean(content.profilePhotoUrl);

  const items: Array<{ key: CheckKey; label: string; detail: string }> = [
    { key: 'name', label: 'Name spelled correctly', detail: name },
    { key: 'dob', label: 'Date of birth', detail: dob },
    { key: 'phone', label: 'Mobile number works', detail: phone },
    {
      key: 'photo',
      label: 'Photo is clear and recent',
      detail: hasPhoto ? 'Photo added' : 'No photo',
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
