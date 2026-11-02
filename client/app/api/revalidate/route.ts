import { createHash, timingSafeEqual } from 'crypto';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

function digest(value: string): Buffer {
  return createHash('sha256').update(value).digest();
}

function secretsMatch(provided: string, expected: string): boolean {
  const a = digest(provided);
  const b = digest(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function resolveSecret(): string {
  return (
    process.env.REVALIDATE_SECRET?.trim() ||
    process.env.CRON_SECRET?.trim() ||
    ''
  );
}

function isAllowedPath(path: string): boolean {
  if (path === '/sitemap.xml' || path === '/robots.txt') return true;
  if (path === '/blog' || path === '/blog/') return true;
  return path.startsWith('/blog/');
}

export async function POST(request: Request) {
  const expected = resolveSecret();
  if (!expected) {
    return NextResponse.json(
      { ok: false, error: 'REVALIDATE_SECRET not configured' },
      { status: 503 },
    );
  }

  const auth = request.headers.get('authorization') ?? '';
  const match = /^Bearer\s+(.+)$/i.exec(auth);
  const token = match?.[1]?.trim() ?? '';
  if (!token || !secretsMatch(token, expected)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const paths = (body as { paths?: unknown })?.paths;
  if (!Array.isArray(paths) || paths.length === 0) {
    return NextResponse.json(
      { ok: false, error: 'paths must be a non-empty array' },
      { status: 400 },
    );
  }

  const allowed: string[] = [];
  for (const raw of paths) {
    if (typeof raw !== 'string') continue;
    const path = raw.trim();
    if (!path || !isAllowedPath(path)) continue;
    allowed.push(path);
  }

  if (allowed.length === 0) {
    return NextResponse.json(
      { ok: false, error: 'No allowed paths' },
      { status: 400 },
    );
  }

  for (const path of allowed) {
    revalidatePath(path);
  }

  return NextResponse.json({ ok: true, revalidated: allowed });
}
