/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Voorkom hydration issues met Supabase
  experimental: {
    appDir: true,
    serverActions: true,
  }
}

module.exports = nextConfig
