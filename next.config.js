// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
    images: {
        unoptimized: true,
    },
    basePath: process.env.NODE_ENV === 'production' ? '/alidaho.github.io' : '',
    assetPrefix: process.env.NODE_ENV === 'production' ? '/alidaho.github.io/' : '',
};

module.exports = nextConfig;
