import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    PRISMA_LOG_LEVEL: "query",
  },

  webpack: (config) => {
    config.ignoreWarnings = [/Failed to parse source map/];

    config.module.rules.push({
      test: /\.html$/,
      include: /node_modules\/@mapbox\/node-pre-gyp/,
      use: 'ignore-loader',
    });

    return config;
  },
};

export default nextConfig;
