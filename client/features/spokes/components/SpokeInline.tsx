import type { ReactNode } from 'react';
import Link from 'next/link';
import { ALL_PAGES } from '@/content/spokes';

const LINK_RE = /\[\[(P\d+)\|([^\]]+)\]\]/g;

function isPublished(id: string): boolean {
  return Boolean(ALL_PAGES.find((page) => page.id === id)?.published);
}

export function stripLinks(text: string): string {
  return text.replace(LINK_RE, (_m, _id: string, words: string) => words);
}

/** True when the text has at least one marker and none of its targets are published. */
export function hasOnlyUnpublishedLinks(text: string): boolean {
  const re = new RegExp(LINK_RE.source, 'g');
  let match: RegExpExecArray | null;
  let found = false;
  while ((match = re.exec(text)) !== null) {
    found = true;
    const id = match[1];
    if (id && isPublished(id)) return false;
  }
  return found;
}

export function SpokeInline({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  const re = new RegExp(LINK_RE.source, 'g');
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = re.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index));
    }
    const id = match[1] ?? '';
    const words = match[2] ?? '';
    const page = ALL_PAGES.find((p) => p.id === id);
    if (page?.published) {
      parts.push(
        <Link key={key++} href={page.path}>
          {words}
        </Link>,
      );
    } else {
      parts.push(words);
    }
    last = match.index + match[0].length;
  }

  if (last < text.length) {
    parts.push(text.slice(last));
  }

  return <>{parts}</>;
}
