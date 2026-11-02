import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/** Soft gate only — API still enforces admin role. */
const ACCESS_COOKIE = 'vivah_at';

export function middleware(request: NextRequest) {
  const token = request.cookies.get(ACCESS_COOKIE)?.value;
  if (token) {
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
