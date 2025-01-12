// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
    basePath: process.env.NODE_ENV === 'production' ? '/alidaho.github.io' : undefined,
    trailingSlash: true, // Works for both development and production
};

module.exports = nextConfig;
