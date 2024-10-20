/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/cooperfeatherstonellc',
  assetPrefix: '/cooperfeatherstonellc/',
}

module.exports = nextConfig