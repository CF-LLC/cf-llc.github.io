/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/cooperfeatherstonellc.github.io',
  assetPrefix: '/cooperfeatherstonellc.github.io/',
}

module.exports = nextConfig