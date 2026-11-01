import sanitizeHtml from 'sanitize-html';

const SITE_HOSTS = new Set(['marriagebio.in', 'www.marriagebio.in']);

const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    'h2',
    'h3',
    'h4',
    'p',
    'br',
    'hr',
    'ul',
    'ol',
    'li',
    'a',
    'strong',
    'em',
    'blockquote',
    'code',
    'pre',
    'img',
    'figure',
    'figcaption',
    'table',
    'thead',
    'tbody',
    'tr',
    'th',
    'td',
  ],
  allowedAttributes: {
    a: ['href', 'title', 'rel', 'target'],
    img: ['src', 'alt', 'width', 'height', 'loading'],
    th: ['colspan', 'rowspan'],
    td: ['colspan', 'rowspan'],
  },
  allowedClasses: {
    code: ['language-*'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  allowedSchemesByTag: {
    img: ['http', 'https'],
  },
  allowProtocolRelative: false,
  transformTags: {
    h1: 'h2',
    h5: 'h4',
    h6: 'h4',
    b: 'strong',
    i: 'em',
    a: (tagName, attribs) => {
      const href = attribs.href ?? '';
      let rel = 'noopener noreferrer';
      const out: Record<string, string> = {};
      if (href) out.href = href;
      if (attribs.title) out.title = attribs.title;

      try {
        if (/^https?:\/\//i.test(href)) {
          const host = new URL(href).hostname.toLowerCase();
          if (!SITE_HOSTS.has(host)) {
            rel = 'noopener noreferrer nofollow';
            out.target = '_blank';
          }
        }
      } catch {
        // keep default rel for unparseable hrefs
      }

      out.rel = rel;
      return { tagName, attribs: out };
    },
    img: (tagName, attribs) => {
      const out: Record<string, string> = {
        loading: 'lazy',
      };
      if (attribs.src) out.src = attribs.src;
      if (attribs.alt) out.alt = attribs.alt;
      if (attribs.width && /^\d{1,4}$/.test(attribs.width)) {
        out.width = attribs.width;
      }
      if (attribs.height && /^\d{1,4}$/.test(attribs.height)) {
        out.height = attribs.height;
      }
      return { tagName, attribs: out };
    },
  },
  exclusiveFilter: (frame) => {
    if (frame.tag === 'img') {
      const src = frame.attribs.src ?? '';
      return !(src.startsWith('http://') || src.startsWith('https://'));
    }
    return false;
  },
};

export function sanitizeBlogHtml(html: string): string {
  return sanitizeHtml(html, OPTIONS).trim();
}
