import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  // experimental: {
  //   ppr: 'incremental'
  // }
};

export default nextConfig;

module.exports = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // the project has ESLint errors.
    ignoreDuringBuilds: true,
  },
}
