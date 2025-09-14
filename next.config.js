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
    // Remove basePath and assetPrefix for Vercel deployment
    // These are only needed for GitHub Pages
};

module.exports = nextConfig;