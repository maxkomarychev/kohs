import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Remove basePath and assetPrefix as they're causing issues
  trailingSlash: true,
  basePath: '/kohs',
  assetPrefix: '/kohs/',
};

export default nextConfig;
