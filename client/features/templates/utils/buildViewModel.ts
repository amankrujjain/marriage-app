import type { BiodataContent } from '@marriage/shared';
import type { BiodataSectionView, BiodataViewModel } from '../types/viewModel';
import { FIELD_LABELS } from './fieldLabels';

function rowsFrom(
  prefix: string,
  data: Record<string, unknown>,
  hidden: string[],
): BiodataSectionView['rows'] {
  return Object.entries(data)
    .filter(([, value]) => value !== undefined && value !== null && String(value) !== '')
    .map(([key, value]) => {
      const path = `${prefix}.${key}`;
      return {
        key: path,
        label: FIELD_LABELS[path] ?? key,
        value: String(value),
        skip: hidden.includes(path) || path === 'personal.fullName',
      };
    })
    .filter((row) => !row.skip)
    .map(({ key, label, value }) => ({ key, label, value }));
}

function section(
  id: string,
  title: string,
  prefix: string,
  data: Record<string, unknown>,
  hidden: string[],
): BiodataSectionView | null {
  const rows = rowsFrom(prefix, data, hidden);
  return rows.length ? { id, title, rows } : null;
}

function asRecord(value: object): Record<string, unknown> {
  return value as Record<string, unknown>;
}

export function buildViewModel(content: BiodataContent): BiodataViewModel {
  const hidden = content.hiddenFields;
  const sections = [
    section('personal', 'Personal', 'personal', asRecord(content.personal), hidden),
    section('education', 'Education', 'education', asRecord(content.education), hidden),
    section('career', 'Career', 'career', asRecord(content.career), hidden),
    section('family', 'Family', 'family', asRecord(content.family), hidden),
    section('about', 'About', 'about', asRecord(content.about), hidden),
    section('contact', 'Contact', 'contact', asRecord(content.contact), hidden),
  ].filter((item): item is BiodataSectionView => item !== null);

  return {
    fullName: content.personal.fullName?.trim() || 'Marriage Biodata',
    photoUrl: content.profilePhotoUrl,
    sections,
  };
}
