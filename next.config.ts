import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  poweredByHeader: false,
  distDir: process.env.TRANSIT_QA === '1' ? '.next-qa' : '.next',
  reactStrictMode: true,
  devIndicators: false,
};
export default nextConfig;
