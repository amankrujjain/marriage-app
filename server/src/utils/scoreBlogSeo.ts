export type SeoCheckLevel = 'pass' | 'warn' | 'fail';

export type SeoCheckResult = {
  id: string;
  label: string;
  level: SeoCheckLevel;
  detail: string;
};

export type BlogSeoScoreInput = {
  title: string;
  slug: string;
  excerpt: string;
  contentHtml: string;
  seoTitle: string;
  seoDescription: string;
  focusKeyword: string;
  coverAlt: string;
};

export type BlogSeoScoreResult = {
  score: number;
  checks: SeoCheckResult[];
};

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function levelScore(level: SeoCheckLevel): number {
  if (level === 'pass') return 1;
  if (level === 'warn') return 0.5;
  return 0;
}

function keywordPresent(haystack: string, keyword: string): boolean {
  if (!keyword.trim()) return false;
  return haystack.toLowerCase().includes(keyword.trim().toLowerCase());
}

function countWords(text: string): number {
  const t = text.trim();
  if (!t) return 0;
  return t.split(/\s+/).length;
}

function extractAttrs(tag: string, name: string): string | null {
  const re = new RegExp(`${name}\\s*=\\s*["']([^"']*)["']`, 'i');
  const m = re.exec(tag);
  return m?.[1] ?? null;
}

/**
 * Pure SEO scorer for blog drafts (Alignlie-style weighted checklist).
 * Average of checks × 100; no AI.
 */
export function scoreBlogSeo(input: BlogSeoScoreInput): BlogSeoScoreResult {
  const title = input.title.trim();
  const slug = input.slug.trim().toLowerCase();
  const excerpt = input.excerpt.trim();
  const html = input.contentHtml ?? '';
  const seoTitle = (input.seoTitle || title).trim();
  const seoDescription = (input.seoDescription || excerpt).trim();
  const focus = input.focusKeyword.trim();
  const coverAlt = input.coverAlt.trim();
  const plain = stripHtml(html);
  const words = countWords(plain);

  const h1Matches = html.match(/<h1\b[^>]*>/gi) ?? [];
  const h2Matches = html.match(/<h2\b[^>]*>/gi) ?? [];
  const headingTags = html.match(/<h([1-4])\b[^>]*>/gi) ?? [];
  const imgTags = html.match(/<img\b[^>]*>/gi) ?? [];
  const aTags = html.match(/<a\b[^>]*>/gi) ?? [];
  const paragraphs = html.match(/<p\b[^>]*>[\s\S]*?<\/p>/gi) ?? [];

  let headingOrderOk = true;
  let lastLevel = 0;
  for (const tag of headingTags) {
    const m = /<h([1-4])\b/i.exec(tag);
    const level = m ? Number(m[1]) : 0;
    if (lastLevel > 0 && level > lastLevel + 1) headingOrderOk = false;
    lastLevel = level;
  }

  const checks: SeoCheckResult[] = [];

  checks.push({
    id: 'body-h1',
    label: 'No H1 in body',
    level: h1Matches.length === 0 ? 'pass' : 'fail',
    detail:
      h1Matches.length === 0
        ? 'Page title is the H1; body uses H2–H4.'
        : `Found ${h1Matches.length} H1 in the body.`,
  });

  checks.push({
    id: 'heading-order',
    label: 'Heading order',
    level: headingOrderOk ? 'pass' : 'warn',
    detail: headingOrderOk
      ? 'Headings do not skip levels.'
      : 'Heading levels skip (e.g. H2 → H4).',
  });

  checks.push({
    id: 'has-h2',
    label: 'Has H2 sections',
    level: h2Matches.length > 0 ? 'pass' : words < 200 ? 'warn' : 'fail',
    detail:
      h2Matches.length > 0
        ? `${h2Matches.length} H2 heading(s).`
        : 'Add H2 sections to structure the article.',
  });

  const titleLen = seoTitle.length;
  checks.push({
    id: 'meta-title-length',
    label: 'Meta title length',
    level:
      titleLen >= 50 && titleLen <= 60
        ? 'pass'
        : titleLen >= 40 && titleLen <= 70
          ? 'warn'
          : 'fail',
    detail: `${titleLen} chars (ideal 50–60).`,
  });

  const descLen = seoDescription.length;
  checks.push({
    id: 'meta-description-length',
    label: 'Meta description length',
    level:
      descLen >= 140 && descLen <= 160
        ? 'pass'
        : descLen >= 110 && descLen <= 170
          ? 'warn'
          : 'fail',
    detail: `${descLen} chars (ideal 140–160).`,
  });

  const slugOk =
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) &&
    slug.length > 0 &&
    slug.length <= 60 &&
    !slug.includes('--');
  checks.push({
    id: 'slug',
    label: 'Slug quality',
    level: slugOk ? 'pass' : slug.length <= 80 ? 'warn' : 'fail',
    detail: slugOk
      ? 'Short hyphenated slug.'
      : 'Prefer a short lowercase hyphenated slug (≤60).',
  });

  if (!focus) {
    checks.push({
      id: 'focus-keyword',
      label: 'Focus keyword set',
      level: 'fail',
      detail: 'Set a focus keyword to score placement and density.',
    });
  } else {
    const inTitle = keywordPresent(seoTitle, focus);
    const inSlug = keywordPresent(slug.replace(/-/g, ' '), focus);
    const intro = plain.slice(0, 160);
    const inIntro = keywordPresent(intro, focus);
    const headingText = headingTags
      .map((t) => stripHtml(t))
      .join(' ');
    // Re-extract heading inner text from html
    const headingBodies =
      html.match(/<h[2-4]\b[^>]*>[\s\S]*?<\/h[2-4]>/gi)?.map(stripHtml).join(' ') ??
      '';
    const inHeadings = keywordPresent(headingBodies || headingText, focus);
    // simpler density: occurrences / words
    const occ =
      plain.toLowerCase().split(focus.toLowerCase()).length - 1;
    const densPct = words > 0 ? (occ / words) * 100 : 0;

    checks.push({
      id: 'kw-in-title',
      label: 'Keyword in title',
      level: inTitle ? 'pass' : 'fail',
      detail: inTitle ? 'Found in SEO/title.' : 'Add focus keyword to the title.',
    });
    checks.push({
      id: 'kw-in-slug',
      label: 'Keyword in slug',
      level: inSlug ? 'pass' : 'warn',
      detail: inSlug ? 'Found in slug.' : 'Consider including the keyword in the slug.',
    });
    checks.push({
      id: 'kw-in-intro',
      label: 'Keyword in intro',
      level: inIntro ? 'pass' : 'warn',
      detail: inIntro
        ? 'Found near the start.'
        : 'Mention the keyword in the first ~160 characters.',
    });
    checks.push({
      id: 'kw-in-headings',
      label: 'Keyword in a heading',
      level: inHeadings ? 'pass' : 'warn',
      detail: inHeadings
        ? 'Found in an H2–H4.'
        : 'Use the keyword in at least one heading.',
    });
    checks.push({
      id: 'kw-density',
      label: 'Keyword density',
      level:
        densPct >= 0.5 && densPct <= 2.5
          ? 'pass'
          : densPct > 0 && densPct < 4
            ? 'warn'
            : 'fail',
      detail: `${densPct.toFixed(1)}% (${occ} occurrence(s); ideal ~0.5–2.5%).`,
    });

    const imgsMissingAlt = imgTags.filter((tag) => {
      const alt = extractAttrs(tag, 'alt');
      return alt === null || alt.trim() === '';
    }).length;
    const kwInImgAlt = imgTags.some((tag) =>
      keywordPresent(extractAttrs(tag, 'alt') ?? '', focus),
    );
    checks.push({
      id: 'kw-in-image-alt',
      label: 'Keyword in an image alt',
      level:
        imgTags.length === 0 ? 'warn' : kwInImgAlt ? 'pass' : 'warn',
      detail:
        imgTags.length === 0
          ? 'No images in the body yet.'
          : kwInImgAlt
            ? 'Found in an image alt.'
            : 'Include the keyword in at least one image alt.',
    });
    void imgsMissingAlt;
  }

  const missingAlt = imgTags.filter((tag) => {
    const alt = extractAttrs(tag, 'alt');
    return alt === null || alt.trim() === '';
  }).length;
  checks.push({
    id: 'image-alts',
    label: 'All images have alt',
    level:
      imgTags.length === 0
        ? 'pass'
        : missingAlt === 0
          ? 'pass'
          : 'fail',
    detail:
      imgTags.length === 0
        ? 'No body images.'
        : missingAlt === 0
          ? `All ${imgTags.length} image(s) have alt text.`
          : `${missingAlt} of ${imgTags.length} image(s) missing alt.`,
  });

  checks.push({
    id: 'cover-alt',
    label: 'Cover alt text',
    level: coverAlt.length > 0 ? 'pass' : 'fail',
    detail: coverAlt.length > 0 ? 'Cover alt is set.' : 'Add cover image alt text.',
  });

  let internalLinks = 0;
  let externalLinks = 0;
  for (const tag of aTags) {
    const href = extractAttrs(tag, 'href') ?? '';
    if (!href || href.startsWith('#') || href.startsWith('mailto:')) continue;
    try {
      const host = new URL(href, 'https://marriagebio.in').hostname;
      if (host === 'marriagebio.in' || host.endsWith('.marriagebio.in')) {
        internalLinks += 1;
      } else {
        externalLinks += 1;
      }
    } catch {
      /* ignore bad href */
    }
  }
  checks.push({
    id: 'internal-links',
    label: 'Internal links',
    level: internalLinks > 0 ? 'pass' : 'warn',
    detail:
      internalLinks > 0
        ? `${internalLinks} internal link(s).`
        : 'Add at least one link to your own site.',
  });
  checks.push({
    id: 'external-links',
    label: 'External links',
    level: externalLinks > 0 ? 'pass' : 'warn',
    detail:
      externalLinks > 0
        ? `${externalLinks} external link(s).`
        : 'A trusted external citation helps readers.',
  });

  checks.push({
    id: 'length',
    label: 'Article length',
    level: words >= 600 ? 'pass' : words >= 350 ? 'warn' : 'fail',
    detail: `${words} words (aim for 600+).`,
  });

  const longParas = paragraphs.filter((p) => countWords(stripHtml(p)) > 120).length;
  checks.push({
    id: 'paragraph-length',
    label: 'Paragraph length',
    level: longParas === 0 ? 'pass' : longParas <= 2 ? 'warn' : 'fail',
    detail:
      longParas === 0
        ? 'Paragraphs stay readable (≤120 words).'
        : `${longParas} paragraph(s) over 120 words.`,
  });

  const headingEvery =
    words === 0 || headingTags.length === 0
      ? words < 350
      : words / headingTags.length <= 350;
  checks.push({
    id: 'heading-spacing',
    label: 'Headings frequency',
    level: headingEvery ? 'pass' : 'warn',
    detail: headingEvery
      ? 'Headings appear often enough.'
      : 'Aim for a heading roughly every 350 words.',
  });

  const claimy =
    /\b(guaranteed|100%|best|#1|number one|miracle)\b/i.test(plain);
  checks.push({
    id: 'claims',
    label: 'Avoid absolute claims',
    level: claimy ? 'warn' : 'pass',
    detail: claimy
      ? 'Soft absolute marketing claims found; tone them down if possible.'
      : 'No strong absolute claims detected.',
  });

  const avg =
    checks.reduce((sum, c) => sum + levelScore(c.level), 0) / checks.length;
  const score = Math.round(avg * 100);

  return { score, checks };
}
