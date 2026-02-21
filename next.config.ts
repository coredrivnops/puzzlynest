import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent MIME-type sniffing
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  // Prevent clickjacking
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  // Enable XSS filter in legacy browsers
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  // Control referrer information
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  // Restrict browser feature access
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=()',
  },
  // Force HTTPS (max 1 year, include subdomains)
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },
];

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

  // Security headers applied to all routes
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
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
        permanent: true,
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
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
