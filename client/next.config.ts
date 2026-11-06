import path from 'path';
import { loadEnvConfig } from '@next/env';
import type { NextConfig } from 'next';

// Monorepo: root `.env` lives one level up; Next only auto-loads `client/.env*`.
loadEnvConfig(path.join(__dirname, '..'));

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // Trace files from the monorepo root so @marriage/shared is included in standalone.
  outputFileTracingRoot: path.join(__dirname, '..'),
  // Lint via `npm run lint -w client`; don't fail Docker/production image builds on ESLint.
  eslint: { ignoreDuringBuilds: true },
  trailingSlash: true,
  transpilePackages: ['@marriage/shared'],
  // Ensure root NEXT_PUBLIC_* values are available to the client bundle.
  // Never bake "" for API_URL — that makes fetch() hit Next itself (404 /auth/me).
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL?.trim() ||
      'http://localhost:4000/api/v1',
    NEXT_PUBLIC_GOOGLE_CLIENT_ID:
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim() || '',
  },

  async redirects() {
    return [
      {
        source: '/marriage-biodata-maker',
        destination: '/',
        permanent: true,
      },
      {
        source: '/marriage-biodata-maker/',
        destination: '/',
        permanent: true,
      },
      {
        source: '/marriage-biodata-maker/:path*',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
