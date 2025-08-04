import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://open.spotify.com/**/*')],
  },
};

export default nextConfig;
