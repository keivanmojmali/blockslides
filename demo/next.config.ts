import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: "../",
  },
  // Ensure workspace packages are transpiled (TS/ESM)
  transpilePackages: [
    "@blockslides/ai-context",
    "@blockslides/core",
    "@blockslides/react",
    "@blockslides/extension-kit",
  ],
};

export default nextConfig;
