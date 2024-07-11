/** @type {import("pliny/config").PlinyConfig } */
const siteMetadata = {
  title: 'Dreamgrove',
  author: 'Dreamgrove',
  headerTitle: 'Dreamgrove',
  description:
    'A website for resources, guides, theorycrafting, and discussion about all things Druid.',
  language: 'en-us',
  theme: 'system', // system, dark or light
  siteUrl: 'https://druid.thevinter.com',
  siteRepo: 'https://github.com/thevinter/react-dreamgrove',
  siteLogo: '/static/images/logo.png',
  socialBanner: '/static/images/twitter-card.png',
  github: 'https://github.com/thevinter/react-dreamgrove',
  locale: 'en-US',
  analytics: {
    umamiAnalytics: {
      umamiWebsiteId: process.env.NEXT_UMAMI_ID,
    },
  },
  newsletter: {
    //provider: 'buttondown',
  },
  comments: {
    //provider: 'giscus', // supported providers: giscus, utterances, disqus
    //giscusConfig: {
    //  repo: process.env.NEXT_PUBLIC_GISCUS_REPO,
    //  repositoryId: process.env.NEXT_PUBLIC_GISCUS_REPOSITORY_ID,
    //  category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY,
    //  categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID,
    //  mapping: 'pathname',
    //  reactions: '0',
    //  metadata: '0',
    //  theme: 'light',
    //  darkTheme: 'transparent_dark',
    //  themeURL: '',
    //  lang: 'en',
    //},
  },
  search: {
    provider: 'kbar',
    kbarConfig: {
      searchDocumentsPath: 'search.json',
    },
    // provider: 'algolia',
    // algoliaConfig: {
    //   // The application ID provided by Algolia
    //   appId: 'R2IYF7ETH7',
    //   // Public API key: it is safe to commit it
    //   apiKey: '599cec31baffa4868cae4e79f180729b',
    //   indexName: 'docsearch',
    // },
  },
}

module.exports = siteMetadata
