import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
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
