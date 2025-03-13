import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    PRISMA_LOG_LEVEL: "query",
  },
};

export default nextConfig;
