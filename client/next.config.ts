import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL('https://open.spotify.com/**/*'),
      new URL('https://image-cdn-fa.spotifycdn.com/**/*'),
      new URL('https://image-cdn-ak.spotifycdn.com/**/*')
    ],
  },
};

export default nextConfig;
