/* eslint-disable @typescript-eslint/no-require-imports */
const { withContentlayer } = require('next-contentlayer2')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

// You might need to insert additional domains in script-src if you are using external services
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' giscus.app analytics.umami.is;
  style-src 'self' 'unsafe-inline';
  img-src * blob: data:;
  media-src *.s3.amazonaws.com;
  connect-src *;
  font-src 'self';
  frame-src giscus.app github.com
`

const securityHeaders = [
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\n/g, ''),
  },
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
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://wow.zamimg.com https://www.raidbots.com https://mimiron.raidbots.com https://www.youtube.com https://s.ytimg.com https://www.youtube-nocookie.com;
      style-src 'self' 'unsafe-inline' 'unsafe-eval' https://wow.zamimg.com;
      img-src 'self' data: https://wow.zamimg.com https://i.ytimg.com https://img.youtube.com;
      connect-src 'self' https://nether.wowhead.com;
      frame-src 'self' https://www.raidbots.com https://mimiron.raidbots.com https://www.youtube.com https://www.youtube-nocookie.com;
    `
      .replace(/\s{2,}/g, ' ')
      .trim(),
  },
]

/**
 * @type {import('next/dist/next-server/server/config').NextConfig}
 **/
module.exports = () => {
  const plugins = [withContentlayer, withBundleAnalyzer]
  return plugins.reduce((acc, next) => next(acc), {
    reactStrictMode: true,
    pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
    eslint: {
      dirs: ['app', 'components', 'layouts', 'scripts'],
    },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'wow.zamimg.com',
        },
        {
          protocol: 'https',
          hostname: 'avatars.githubusercontent.com',
        },
      ],
      formats: ['image/webp'],
      deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
      minimumCacheTTL: 60,
    },
    env: {
      GITHUB_ID: process.env.GITHUB_ID,
      GITHUB_SECRET: process.env.GITHUB_SECRET,
      GITHUB_REPO_OWNER: process.env.GITHUB_REPO_OWNER || 'dreamgrove',
      GITHUB_REPO_NAME: process.env.GITHUB_REPO_NAME || 'dreamgrove',
      GITHUB_BRANCH: process.env.GITHUB_BRANCH || 'master',
    },
    experimental: {
      serverComponentsHmrCache: true,

      turbo: {
        rules: {
          // Configure Turbopack to handle WebP images
          '*.webp': ['@next/third-parties/loader'],
        },
      },
    },
    // Add a custom fetch timeout for the Node.js environment during builds
    // This helps prevent the build from hanging indefinitely on failed fetch requests
    onDemandEntries: {
      // period (in ms) where the server will keep pages in the buffer
      maxInactiveAge: 25 * 1000,
      // number of pages that should be kept simultaneously without being disposed
      pagesBufferLength: 2,
    },
    async redirects() {
      return [
        {
          source: '/balance/compendium',
          destination: '/blog/balance/compendium',
          permanent: true, // use `true` for a 301 redirect, `false` for a 302 redirect
        },
        {
          source: '/balance',
          destination: '/blog/balance/compendium',
          permanent: true,
        },
        {
          source: '/feral/compendium',
          destination: '/blog/feral/compendium',
          permanent: true,
        },
        {
          source: '/feral',
          destination: '/blog/feral/compendium',
          permanent: true,
        },
        {
          source: '/resto/compendium',
          destination: '/blog/resto/compendium',
          permanent: true,
        },
        {
          source: '/resto',
          destination: '/blog/resto/compendium',
          permanent: true,
        },
        {
          source: '/guardian',
          destination: '/blog/guardian/compendium',
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
    webpack: (config, options) => {
      config.module.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      })

      return config
    },
  })
}
