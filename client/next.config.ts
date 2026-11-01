import path from 'path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // Trace files from the monorepo root so @marriage/shared is included in standalone.
  outputFileTracingRoot: path.join(__dirname, '..'),
  trailingSlash: true,
  transpilePackages: ['@marriage/shared'],

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
