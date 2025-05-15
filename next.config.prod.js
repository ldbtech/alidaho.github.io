next./** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
        unoptimized: true,
    },
    basePath: '/alidaho.github.io',
    assetPrefix: '/alidaho.github.io/',
    trailingSlash: true,
};

module.exports = nextConfig; 