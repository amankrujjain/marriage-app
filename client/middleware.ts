import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { UserRole } from '@marriage/shared';

/** Soft gate — API still enforces admin via authenticate + requireAdmin. */
const ACCESS_COOKIE = 'vivah_at';

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const b64 = parts[1]!.replace(/-/g, '+').replace(/_/g, '/');
    const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
    return JSON.parse(atob(padded)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/** Reject obviously non-admin / expired access cookies before loading admin UI. */
function isAdminAccessCookie(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload) return false;
  if (payload.typ !== 'access') return false;
  if (payload.role !== UserRole.ADMIN) return false;
  if (typeof payload.exp === 'number' && payload.exp * 1000 < Date.now()) {
    return false;
  }
  return true;
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get(ACCESS_COOKIE)?.value;
  if (token && isAdminAccessCookie(token)) {
    return NextResponse.next();
  }

  const login = new URL('/login/', request.url);
  login.searchParams.set(
    'next',
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
  );
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
