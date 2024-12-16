import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '/pvm-rpg',
  assetPrefix: '/pvm-rpg/',
  output: 'export',
  eslint: {
    ignoreDuringBuilds: false,
  }
};

export default nextConfig;
