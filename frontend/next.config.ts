import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  reactStrictMode: true,
  devIndicators:false,
};

export default nextConfig;
