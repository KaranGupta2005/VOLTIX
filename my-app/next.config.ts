import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove "output: export" for Vercel deployment with dynamic features
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
