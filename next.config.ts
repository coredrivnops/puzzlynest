import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Output standalone for Docker/Cloud Run deployment
  output: 'standalone',

  // Performance optimizations
  poweredByHeader: false,

  // Image optimization settings
  images: {
    domains: [],
    unoptimized: false,
  },

  // Redirects for SEO - www to non-www
  async redirects() {
    return [
      // Redirect www to non-www (301 permanent)
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.puzzlynest.com',
          },
        ],
        destination: 'https://puzzlynest.com/:path*',
        permanent: true, // 301 redirect
      },
      // Redirect puzzlynest.io to puzzlynest.com (301 permanent)
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'puzzlynest.io',
          },
        ],
        destination: 'https://puzzlynest.com/:path*',
        permanent: true, // 301 redirect
      },
    ];
  },
};

export default nextConfig;
