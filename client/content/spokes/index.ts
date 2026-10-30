import { formatBoy } from './format-boy';
import { formatGirl } from './format-girl';
import { formatPdf } from './format-pdf';
import { formatWord } from './format-word';
import { hi } from './hi';
import { hindu } from './hindu';
import { home } from './home';
import { howToMake } from './how-to-make';
import { marathi } from './marathi';
import { muslim } from './muslim';
import { templates } from './templates';
import type { SpokeHub, SpokePageConfig } from './types';

export type {
  SpokeFaith,
  SpokeFaq,
  SpokeHub,
  SpokePageConfig,
  SpokePreset,
  SpokeSampleDownload,
  SpokeSamples,
  SpokeStep,
  SpokeTip,
} from './types';

export const ALL_PAGES: SpokePageConfig[] = [
  home,
  templates,
  formatWord,
  formatPdf,
  formatBoy,
  formatGirl,
  hindu,
  muslim,
  hi,
  marathi,
  howToMake,
];

const byId = new Map(ALL_PAGES.map((page) => [page.id, page]));

function collectStrings(value: unknown, out: string[]): void {
  if (typeof value === 'string') {
    out.push(value);
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectStrings(item, out);
    return;
  }
  if (value && typeof value === 'object') {
    for (const child of Object.values(value)) collectStrings(child, out);
  }
}

/** Build-time: published pages must not ship with TODO_COPY placeholders. */
export function assertNoTodoCopyInPublished(
  pages: SpokePageConfig[] = ALL_PAGES,
): void {
  for (const page of pages) {
    if (!page.published) continue;
    const strings: string[] = [];
    collectStrings(page, strings);
    if (strings.some((s) => s.includes('TODO_COPY'))) {
      throw new Error(
        `Published spoke page "${page.id}" contains TODO_COPY`,
      );
    }
  }
}

/** Build-time: every path must be unique and end with `/`. */
export function assertUniqueTrailingSlashPaths(
  pages: SpokePageConfig[] = ALL_PAGES,
): void {
  const seen = new Set<string>();
  for (const page of pages) {
    if (!page.path.endsWith('/')) {
      throw new Error(
        `Spoke page "${page.id}" path must end with "/": ${page.path}`,
      );
    }
    if (seen.has(page.path)) {
      throw new Error(`Duplicate spoke path: ${page.path}`);
    }
    seen.add(page.path);
  }
}

assertUniqueTrailingSlashPaths();
assertNoTodoCopyInPublished();

export function publishedPages(): SpokePageConfig[] {
  return ALL_PAGES.filter((page) => page.published);
}

export function spokePages(): SpokePageConfig[] {
  return ALL_PAGES.filter((page) => page.kind === 'spoke');
}

export function pageById(id: string): SpokePageConfig | undefined {
  return byId.get(id);
}

export function pageByPath(path: string): SpokePageConfig | undefined {
  if (path === '/') {
    return ALL_PAGES.find((page) => page.path === '/');
  }
  const normalized = path.endsWith('/') ? path : `${path}/`;
  return ALL_PAGES.find((page) => page.path === normalized);
}

export function pageBySegments(segments: string[]): SpokePageConfig | undefined {
  const key = segments.join('/');
  return ALL_PAGES.find((page) => page.segments.join('/') === key);
}

/** Related pages for internal links; drops missing and unpublished ids. */
export function relatedFor(page: SpokePageConfig): SpokePageConfig[] {
  return page.relatedIds
    .map((id) => byId.get(id))
    .filter((related): related is SpokePageConfig =>
      Boolean(related && related.published),
    );
}

/** Published spoke pages grouped by hub (empty hubs omitted). */
export function hubLinks(): Partial<Record<SpokeHub, SpokePageConfig[]>> {
  const out: Partial<Record<SpokeHub, SpokePageConfig[]>> = {};
  for (const page of spokePages()) {
    if (!page.published) continue;
    const list = out[page.hub] ?? [];
    list.push(page);
    out[page.hub] = list;
  }
  return out;
}
