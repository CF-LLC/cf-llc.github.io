/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/cooperfeatherstonellc.github.io',
  assetPrefix: '/cooperfeatherstonellc.github.io/',
}

module.exports = nextConfig