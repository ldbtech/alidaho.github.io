// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
        domains: ['firebasestorage.googleapis.com'],
    },
    basePath: process.env.NODE_ENV === 'production' ? '/alidaho.github.io' : '',
    trailingSlash: true,
    assetPrefix: process.env.NODE_ENV === 'production' ? '/alidaho.github.io/' : '',
};

module.exports = nextConfig;