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
    onDemandEntries: {
        // period (in ms) where the server will keep pages in the buffer
        maxInactiveAge: 25 * 1000,
        // number of pages that should be kept simultaneously without being disposed
        pagesBufferLength: 2,
    },
};

module.exports = nextConfig;