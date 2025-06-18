import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nextui.org',
        port: '',
        pathname: '/images/*',
      },
      {
        protocol: 'https',
        hostname: '414duiw16e.ufs.sh',
        port: '',
        pathname: '/f/**'
      }
    ]
  }
};

export default nextConfig;
