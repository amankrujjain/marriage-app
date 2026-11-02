export type TocItem = {
  id: string;
  level: 2 | 3 | 4;
  text: string;
};

function slugifyHeading(text: string): string {
  return text
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

/**
 * Inject id attributes on H2–H4 and build a table of contents.
 * Input HTML is already sanitized on the server.
 */
export function prepareBlogContentWithToc(html: string): {
  html: string;
  toc: TocItem[];
} {
  const toc: TocItem[] = [];
  const seen = new Set<string>();

  const nextHtml = html.replace(
    /<h([2-4])(\b[^>]*)>([\s\S]*?)<\/h\1>/gi,
    (_full, levelRaw: string, attrs: string, inner: string) => {
      const level = Number(levelRaw) as 2 | 3 | 4;
      const text = stripTags(inner);
      let id = slugifyHeading(text) || `section-${toc.length + 1}`;
      let n = 2;
      while (seen.has(id)) {
        id = `${slugifyHeading(text)}-${n}`;
        n += 1;
      }
      seen.add(id);
      toc.push({ id, level, text });

      if (/\sid\s*=/.test(attrs)) {
        return `<h${level}${attrs}>${inner}</h${level}>`;
      }
      return `<h${level}${attrs} id="${id}">${inner}</h${level}>`;
    },
  );

  return { html: nextHtml, toc };
}
