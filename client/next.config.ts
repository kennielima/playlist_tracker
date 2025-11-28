import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL('https://open.spotify.com/**/*'),
      // new URL('https://image-cdn-fa.spotifycdn.com/**/*'),
      // new URL('https://image-cdn-ak.spotifycdn.com/**/*'),
      // new URL('https://mosaic.scdn.co/**/*'),
      {
        protocol: 'https',
        hostname: '*.**.com',
      },
      {
        protocol: 'https',
        hostname: '*.**.co',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
