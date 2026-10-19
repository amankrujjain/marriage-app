import type { BiodataContent } from '@marriage/shared';

export function resolveTitle(title: string | undefined, content: BiodataContent): string {
  const fromName = content.personal?.fullName?.trim();
  // Prefer a real name over a stale "Untitled biodata" title.
  const existing = title?.trim();
  const resolved =
    fromName ||
    (existing && existing.toLowerCase() !== 'untitled biodata' ? existing : '') ||
    'Untitled biodata';
  return resolved.slice(0, 120);
}
