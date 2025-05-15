// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
    basePath: process.env.NODE_ENV === 'production' ? '/alidaho.github.io' : '',
    trailingSlash: true,
    assetPrefix: process.env.NODE_ENV === 'production' ? '/alidaho.github.io/' : '',
};

module.exports = nextConfig;