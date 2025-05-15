// next.config.js

/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
    output: 'export',
    images: {
        unoptimized: true,
    },
    basePath: isProd ? '/alidaho.github.io' : '',
    assetPrefix: isProd ? '/alidaho.github.io/' : '',
    trailingSlash: true,
};

module.exports = nextConfig;