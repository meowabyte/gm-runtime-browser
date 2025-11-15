import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizeCss: true,
    ppr: true,
    reactCompiler: true
  },
};

export default nextConfig;
