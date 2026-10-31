import fs from 'fs';
import path from 'path';

const IMAGE_EXTS = ['webp', 'png', 'jpg', 'jpeg'] as const;

/** True when `publicPath` (e.g. `/downloads/foo.docx`) exists under `client/public`. */
export function publicFileExists(publicPath: string): boolean {
  const relative = publicPath.replace(/^\//, '');
  return fs.existsSync(path.join(process.cwd(), 'public', relative));
}

/** Map design slug → public URL when `public/samples/<pageSlug>/<slug>.*` exists. */
export function sampleImageMap(
  pageSlug: string,
  designSlugs: string[],
): Record<string, string> {
  const dir = path.join(process.cwd(), 'public', 'samples', pageSlug);
  if (!fs.existsSync(dir)) return {};

  const out: Record<string, string> = {};
  for (const slug of designSlugs) {
    for (const ext of IMAGE_EXTS) {
      const file = path.join(dir, `${slug}.${ext}`);
      if (fs.existsSync(file)) {
        out[slug] = `/samples/${pageSlug}/${slug}.${ext}`;
        break;
      }
    }
  }
  return out;
}
