import { defineDocumentType, ComputedFields, makeSource } from 'contentlayer2/source-files'
import { writeFileSync, statSync } from 'fs'
import readingTime from 'reading-time'
import { slug } from 'github-slugger'
import path from 'path'
import { fromHtmlIsomorphic } from 'hast-util-from-html-isomorphic'
// Remark packages
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { remarkAlert } from 'remark-github-blockquote-alert'

import {
  remarkExtractFrontmatter,
  remarkCodeTitles,
  remarkImgToJsx,
  extractTocHeadings,
} from 'pliny/mdx-plugins/index.js'
// Rehype packages
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeKatex from 'rehype-katex'
import rehypeCitation from 'rehype-citation'
import rehypePrismPlus from 'rehype-prism-plus'
import siteMetadata from './data/siteMetadata'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer.js'
import remarkSpell from './plugins/remarkSpell.js'
import rehypeGroupHeaders from './plugins/rehypeGroupHeaders.js'

const root = process.cwd()
const isProduction = process.env.NODE_ENV === 'production'

/**
 * Custom plugin to preserve spaces after closing tags
 * This plugin runs through the HTML AST and ensures spaces are preserved
 * where they're semantically important (after tags followed by text)
 */
function rehypePreserveSpaces() {
  return (tree) => {
    // Process the tree to modify HTML elements
    function processNode(node) {
      // Skip non-element nodes
      if (!node || !node.children) return

      // Process all children
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i]

        // If this is a text node following an element, and starts with a letter/number
        if (
          i > 0 &&
          node.children[i - 1].type === 'element' &&
          child.type === 'text' &&
          child.value &&
          /^[a-zA-Z0-9]/.test(child.value.trimStart()) &&
          !child.value.startsWith(' ')
        ) {
          // Add a space before the text to preserve spacing
          child.value = ' ' + child.value
        }

        // Recursively process child elements
        if (child.type === 'element' && child.children) {
          processNode(child)
        }
      }
    }

    // Start processing from the root
    processNode(tree)
  }
}

// heroicon mini link
const icon = fromHtmlIsomorphic(
  `
  <!--
  <span class="content-header-link">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 linkicon">
  <path d="M12.232 4.232a2.5 2.5 0 0 1 3.536 3.536l-1.225 1.224a.75.75 0 0 0 1.061 1.06l1.224-1.224a4 4 0 0 0-5.656-5.656l-3 3a4 4 0 0 0 .225 5.865.75.75 0 0 0 .977-1.138 2.5 2.5 0 0 1-.142-3.667l3-3Z" />
  <path d="M11.603 7.963a.75.75 0 0 0-.977 1.138 2.5 2.5 0 0 1 .142 3.667l-3 3a2.5 2.5 0 0 1-3.536-3.536l1.225-1.224a.75.75 0 0 0-1.061-1.06l-1.224 1.224a4 4 0 1 0 5.656 5.656l3-3a4 4 0 0 0-.225-5.865Z" />
  </svg>
  </span>
  -->
`,
  { fragment: true }
)

const computedFields: ComputedFields = {
  readingTime: { type: 'json', resolve: (doc) => readingTime(doc.body.raw) },
  slug: {
    type: 'string',
    resolve: (doc) => doc._raw.flattenedPath.replace(/^.+?(\/)/, ''),
  },
  path: {
    type: 'string',
    resolve: (doc) => doc._raw.flattenedPath,
  },
  filePath: {
    type: 'string',
    resolve: (doc) => doc._raw.sourceFilePath,
  },
  toc: { type: 'string', resolve: (doc) => extractTocHeadings(doc.body.raw) },
  lastModified: {
    type: 'date',
    resolve: (doc) => {
      const stats = statSync(`data/${doc._raw.sourceFilePath}`)
      const date = new Date(stats.mtime)

      const getOrdinalSuffix = (n) => {
        const j = n % 10,
          k = n % 100
        if (j === 1 && k !== 11) {
          return n + 'st'
        }
        if (j === 2 && k !== 12) {
          return n + 'nd'
        }
        if (j === 3 && k !== 13) {
          return n + 'rd'
        }
        return n + 'th'
      }

      const dayWithSuffix = getOrdinalSuffix(date.getDate())
      const monthName = date.toLocaleString('default', { month: 'long' })
      const year = date.getFullYear()

      return `${dayWithSuffix} of ${monthName}, ${year}`
    },
  },
  changelogUrl: {
    type: 'string',
    resolve: (doc) => `${siteMetadata.github}/commits/master/data/${doc._raw.sourceFilePath}`,
  },
}

/**
 * Count the occurrences of all tags across blog posts and write to json file
 */
function createTagCount(allBlogs) {
  const tagCount: Record<string, number> = {}
  allBlogs.forEach((file) => {
    if (file.tags && (!isProduction || file.draft !== true)) {
      file.tags.forEach((tag) => {
        const formattedTag = slug(tag)
        if (formattedTag in tagCount) {
          tagCount[formattedTag] += 1
        } else {
          tagCount[formattedTag] = 1
        }
      })
    }
  })
  writeFileSync('./app/tag-data.json', JSON.stringify(tagCount))
}

function createSearchIndex(allBlogs) {
  if (
    siteMetadata?.search?.provider === 'kbar' &&
    siteMetadata.search.kbarConfig.searchDocumentsPath
  ) {
    writeFileSync(
      `public/${siteMetadata.search.kbarConfig.searchDocumentsPath}`,
      JSON.stringify(allCoreContent(sortPosts(allBlogs)))
    )
    console.log('Local search index generated...')
  }
}

export const Blog = defineDocumentType(() => ({
  name: 'Blog',
  filePathPattern: 'blog/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    patch: { type: 'string', required: true },
    date: { type: 'date' },
    tags: { type: 'list', of: { type: 'string' }, default: [] },
    lastmod: { type: 'date' },
    draft: { type: 'boolean' },
    summary: { type: 'string' },
    images: { type: 'json' },
    authors: { type: 'list', of: { type: 'string' } },
    translator: { type: 'string' },
    layout: { type: 'string' },
  },
  computedFields: {
    ...computedFields,
    structuredData: {
      type: 'json',
      resolve: (doc) => ({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: doc.title,
        datePublished: doc.date,
        dateModified: doc.lastmod || doc.date,
        description: doc.summary,
        image: doc.images ? doc.images[0] : siteMetadata.socialBanner,
        url: `${siteMetadata.siteUrl}/${doc._raw.flattenedPath}`,
      }),
    },
  },
}))

export const Dungeons = defineDocumentType(() => ({
  name: 'Dungeons',
  filePathPattern: 'dungeons/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    draft: { type: 'boolean' },
    summary: { type: 'string' },
    headerImage: { type: 'string' },
    layout: { type: 'string' },
  },
  computedFields: {
    ...computedFields,
    structuredData: {
      type: 'json',
      resolve: (doc) => ({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: doc.title,
        description: doc.summary,
        image: siteMetadata.socialBanner,
        headerImage: doc.headerImage,
        url: `${siteMetadata.siteUrl}/${doc._raw.flattenedPath}`,
      }),
    },
  },
}))

export const Changelog = defineDocumentType(() => ({
  name: 'Changelog',
  filePathPattern: 'changelog.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    summary: { type: 'string' },
    layout: { type: 'string' },
  },
  computedFields: {
    ...computedFields,
    structuredData: {
      type: 'json',
      resolve: (doc) => ({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: doc.title,
        description: doc.summary,
        image: siteMetadata.socialBanner,
        url: `${siteMetadata.siteUrl}/${doc._raw.flattenedPath}`,
      }),
    },
  },
}))

export const About = defineDocumentType(() => ({
  name: 'About',
  filePathPattern: 'about.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    summary: { type: 'string' },
    layout: { type: 'string' },
  },
  computedFields: {
    ...computedFields,
    structuredData: {
      type: 'json',
      resolve: (doc) => ({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: doc.title,
        description: doc.summary,
        image: siteMetadata.socialBanner,
        url: `${siteMetadata.siteUrl}/${doc._raw.flattenedPath}`,
      }),
    },
  },
}))

export const Raids = defineDocumentType(() => ({
  name: 'Raids',
  filePathPattern: 'raids/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    draft: { type: 'boolean' },
    summary: { type: 'string' },
    headerImage: { type: 'string' },
    layout: { type: 'string' },
  },
  computedFields: {
    ...computedFields,
    structuredData: {
      type: 'json',
      resolve: (doc) => ({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: doc.title,
        description: doc.summary,
        image: siteMetadata.socialBanner,
        headerImage: doc.headerImage,
        url: `${siteMetadata.siteUrl}/${doc._raw.flattenedPath}`,
      }),
    },
  },
}))

export default makeSource({
  contentDirPath: 'data',
  documentTypes: [Blog, Dungeons, Raids, About, Changelog],
  mdx: {
    cwd: process.cwd(),
    remarkPlugins: [
      remarkExtractFrontmatter,
      remarkAlert,
      remarkGfm,
      remarkCodeTitles,
      remarkMath,
      remarkImgToJsx,
      remarkSpell,
    ],
    rehypePlugins: [
      rehypeSlug,
      rehypeGroupHeaders,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'prepend',
          headingProperties: {
            className: ['content-header'],
          },
          content: icon,
        },
      ],
      rehypeKatex,
      [rehypeCitation, { path: path.join(root, 'data') }],
      [rehypePrismPlus, { defaultLanguage: 'js', ignoreMissing: true }],
      rehypePreserveSpaces, // Add our whitespace preservation plugin
    ],
  },
  onSuccess: async (importData) => {
    const { allBlogs } = await importData()
    createTagCount(allBlogs)
    createSearchIndex(allBlogs)
  },
})
