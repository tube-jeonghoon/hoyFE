/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: false,
  env: {
    API_URL: process.env.API_URL,
  },
  images: {
    domains: ['lh3.googleusercontent.com', 'api.hoy.im'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
        port: '',
      },
    ],
  },
};

module.exports = nextConfig;
