import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'static-cdn.jtvnw.net' },
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: 'dplmiinqmubpjbhepgfo.supabase.co' },
    ],
  },
};

export default nextConfig;
