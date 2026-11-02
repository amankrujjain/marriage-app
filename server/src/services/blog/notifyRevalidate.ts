import { env } from '../../config/env';
import { logger } from '../../utils/logger';

function revalidateSecret(): string {
  return (
    process.env.REVALIDATE_SECRET?.trim() ||
    env.CRON_SECRET ||
    ''
  );
}

function revalidateUrl(): string {
  const base = (
    process.env.REVALIDATE_BASE_URL?.trim() ||
    env.CLIENT_URL
  ).replace(/\/$/, '');
  return `${base}/api/revalidate/`;
}

/** Fire-and-forget Next.js cache bust for blog paths. */
export async function notifyBlogRevalidate(
  paths: string[],
): Promise<void> {
  const secret = revalidateSecret();
  if (!secret) {
    logger.warn('blog.revalidate.skipped', { reason: 'secret_missing' });
    return;
  }

  const unique = [
    ...new Set(
      paths
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p) => (p.endsWith('/') || p.includes('.') ? p : `${p}/`)),
    ),
  ];
  if (unique.length === 0) return;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8_000);

  try {
    const response = await fetch(revalidateUrl(), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secret}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ paths: unique }),
      signal: controller.signal,
    });
    if (!response.ok) {
      const text = await response.text().catch(() => '');
      logger.warn('blog.revalidate.failed', {
        status: response.status,
        body: text.slice(0, 300),
        paths: unique,
      });
      return;
    }
    logger.info('blog.revalidate.ok', { paths: unique });
  } catch (error) {
    logger.warn('blog.revalidate.error', {
      message: error instanceof Error ? error.message : String(error),
      paths: unique,
    });
  } finally {
    clearTimeout(timer);
  }
}

export function blogRevalidatePaths(input: {
  slug?: string | null;
  previousSlug?: string | null;
}): string[] {
  const paths = ['/blog/', '/sitemap.xml'];
  if (input.slug) paths.push(`/blog/${input.slug}/`);
  if (input.previousSlug && input.previousSlug !== input.slug) {
    paths.push(`/blog/${input.previousSlug}/`);
  }
  return paths;
}
