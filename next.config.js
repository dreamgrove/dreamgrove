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
  frame-src giscus.app
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
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://wow.zamimg.com https://www.raidbots.com https://mimiron.raidbots.com;
      style-src 'self' 'unsafe-inline' 'unsafe-eval' https://wow.zamimg.com;
      img-src 'self' data: https://wow.zamimg.com;
      connect-src 'self' https://nether.wowhead.com;
      frame-src 'self' https://www.raidbots.com https://mimiron.raidbots.com;
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
      ],
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
