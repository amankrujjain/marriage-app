import type { CookieOptions, Response } from 'express';
import { env } from '../config/env';
import { authConfig } from '../config/authEnv';

function cookieBase(): CookieOptions {
  const isProd = env.NODE_ENV === 'production';
  // Cross-origin SPA (e.g. :3000 → :4000) needs SameSite=None; Secure.
  // localhost is a secure context for cookies in modern Chromium.
  return {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    ...(isProd ? {} : {}),
  };
}

function parseDurationMs(spec: string): number {
  const match = /^(\d+)([smhd])$/i.exec(spec.trim());
  if (!match) return 15 * 60 * 1000;
  const n = Number(match[1]);
  const unit = match[2]!.toLowerCase();
  const mult =
    unit === 's' ? 1000 : unit === 'm' ? 60_000 : unit === 'h' ? 3_600_000 : 86_400_000;
  return n * mult;
}

export function setAuthCookies(
  res: Response,
  tokens: { accessToken: string; refreshToken: string },
): void {
  const base = cookieBase();
  res.cookie(authConfig.cookies.accessName, tokens.accessToken, {
    ...base,
    maxAge: parseDurationMs(authConfig.accessExpiresIn),
  });
  res.cookie(authConfig.cookies.refreshName, tokens.refreshToken, {
    ...base,
    maxAge: parseDurationMs(authConfig.refreshExpiresIn),
  });
}

export function clearAuthCookies(res: Response): void {
  const base = cookieBase();
  res.clearCookie(authConfig.cookies.accessName, base);
  res.clearCookie(authConfig.cookies.refreshName, base);
}

export function readAccessTokenFromRequest(req: {
  cookies?: Record<string, string>;
  headers: { authorization?: string };
}): string | null {
  // Cookie-only for the SPA — avoids Bearer tokens leaking via logs/referrers.
  const fromCookie = req.cookies?.[authConfig.cookies.accessName];
  if (fromCookie && fromCookie.length > 0) return fromCookie;
  return null;
}

export function readRefreshTokenFromRequest(req: {
  cookies?: Record<string, string>;
}): string | null {
  const token = req.cookies?.[authConfig.cookies.refreshName];
  return token && token.length > 0 ? token : null;
}
