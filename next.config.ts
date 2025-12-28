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
};

export default nextConfig;
