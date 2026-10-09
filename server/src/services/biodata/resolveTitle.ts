import type { BiodataContent } from '@marriage/shared';

export function resolveTitle(title: string | undefined, content: BiodataContent): string {
  const fromName = content.personal.fullName?.trim();
  const resolved = title?.trim() || fromName || 'Untitled biodata';
  return resolved.slice(0, 120);
}
