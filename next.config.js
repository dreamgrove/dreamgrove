/* eslint-disable @typescript-eslint/no-require-imports */
const { withContentlayer } = require('next-contentlayer2')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const securityHeaders = [
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Local images may carry a ?v= cache-busting query (see lib/specArt.ts)
    localPatterns: [{ pathname: '/**' }],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wow.zamimg.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.simcode.dev',
      },
    ],
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 2592000,
    qualities: [75, 100],
  },
  async redirects() {
    return [
      // The content editor used to live under /admin
      { source: '/admin/select', destination: '/cms', permanent: true },
      { source: '/admin/edit', destination: '/cms/edit', permanent: true },
      {
        source: '/balance/compendium',
        destination: '/blog/balance/compendium',
        permanent: true, // use `true` for a 301 redirect, `false` for a 302 redirect
      },
      {
        source: '/feral/compendium',
        destination: '/blog/feral/compendium',
        permanent: true,
      },
      {
        source: '/resto/compendium',
        destination: '/blog/resto/compendium',
        permanent: true,
      },
      {
        source: '/guardian/diminishing-returns',
        destination: '/blog/guardian/diminishing-returns',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}

module.exports = () =>
  [withContentlayer, withBundleAnalyzer].reduce((acc, next) => next(acc), nextConfig)
