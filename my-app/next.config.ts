import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove "output: export" for Vercel deployment with dynamic features
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
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
