import { defineDocumentType, ComputedFields, makeSource } from 'contentlayer2/source-files'
import { statSync } from 'fs'
import readingTime from 'reading-time'
import { slug } from 'github-slugger'
import { remarkPlugins, rehypePlugins } from './plugins/mdxPipeline.js'
import { remarkImgToJsx } from './plugins/remarkImgToJsx.js'
import { extractTocHeadings } from './plugins/extractTocHeadings.js'
// Rehype packages
import rehypeKatex from 'rehype-katex'
import rehypePrismPlus from 'rehype-prism-plus'
import siteMetadata from './data/siteMetadata'

const absoluteImageUrl = (img) => (img.startsWith('http') ? img : `${siteMetadata.siteUrl}${img}`)

function ordinal(n: number) {
  const j = n % 10
  const k = n % 100
  if (j === 1 && k !== 11) return `${n}st`
  if (j === 2 && k !== 12) return `${n}nd`
  if (j === 3 && k !== 13) return `${n}rd`
  return `${n}th`
}

/** "1st of May, 2025". UTC, so a date-only `lastmod` doesn't slip back a day. */
function formatUpdatedDate(date: Date) {
  const month = date.toLocaleString('en-US', { month: 'long', timeZone: 'UTC' })
  return `${ordinal(date.getUTCDate())} of ${month}, ${date.getUTCFullYear()}`
}

/** schema.org BlogPosting shared by every document type; `extra` adds or overrides fields. */
function blogPosting(doc, extra: Record<string, unknown> = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: doc.title,
    description: doc.summary,
    image: absoluteImageUrl(siteMetadata.socialBanner),
    url: `${siteMetadata.siteUrl}/${doc._raw.flattenedPath}`,
    ...extra,
  }
}

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
    // Frontmatter `lastmod` is stamped by the CMS on save. The file's mtime is
    // only a fallback: on the deploy server it is the checkout time, not an edit.
    resolve: (doc) =>
      formatUpdatedDate(
        doc.lastmod ? new Date(doc.lastmod) : statSync(`data/${doc._raw.sourceFilePath}`).mtime
      ),
  },
  changelogUrl: {
    type: 'string',
    resolve: (doc) => `${siteMetadata.github}/commits/master/data/${doc._raw.sourceFilePath}`,
  },
}

/**
 * Lists the <Encounter>/<BossCard> sections of a dungeon or raid guide so the
 * page can render its encounter rail without parsing the MDX at runtime.
 */
function extractEncounters(raw: string) {
  const encounters: { id: string; title: string; trash: boolean; empty: boolean }[] = []
  const re = /<(Encounter|BossCard)\b([^>]*?)(\/>|>([\s\S]*?)<\/\1>)/g
  let match: RegExpExecArray | null
  while ((match = re.exec(raw))) {
    const attrs = match[2]
    const titleMatch = attrs.match(/title=(?:"([^"]*)"|'([^']*)')/)
    if (!titleMatch) continue
    const title = titleMatch[1] ?? titleMatch[2]
    const trash = /(^|\s)trash(\s|=|$)/.test(attrs) || /^trash\b/i.test(title)
    const body = (match[4] || '').replace(/^\s*[-*]\s*/gm, '').trim()
    encounters.push({ id: slug(title), title, trash, empty: body === '' || /^tbd$/i.test(body) })
  }
  return encounters
}

const instanceFields = {
  title: { type: 'string', required: true },
  draft: { type: 'boolean' },
  summary: { type: 'string' },
  headerImage: { type: 'string' },
  layout: { type: 'string' },
  date: { type: 'date' },
  lastmod: { type: 'date' },
  patch: { type: 'string' },
  authors: { type: 'list', of: { type: 'string' } },
  specs: { type: 'list', of: { type: 'string' }, default: [] },
} as const

export const Blog = defineDocumentType(() => ({
  name: 'Blog',
  filePathPattern: 'blog/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    patch: { type: 'string' },
    date: { type: 'date' },
    specs: { type: 'list', of: { type: 'string' }, default: [] },
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
    kind: {
      type: 'string',
      resolve: (doc) => (doc._raw.flattenedPath.endsWith('/compendium') ? 'compendium' : 'article'),
    },
    structuredData: {
      type: 'json',
      resolve: (doc) =>
        blogPosting(doc, {
          datePublished: doc.date,
          dateModified: doc.lastmod || doc.date,
          image: absoluteImageUrl(doc.images ? doc.images[0] : siteMetadata.socialBanner),
        }),
    },
  },
}))

export const Dungeons = defineDocumentType(() => ({
  name: 'Dungeons',
  filePathPattern: 'dungeons/**/*.mdx',
  contentType: 'mdx',
  fields: instanceFields,
  computedFields: {
    ...computedFields,
    encounters: { type: 'json', resolve: (doc) => extractEncounters(doc.body.raw) },
    structuredData: {
      type: 'json',
      resolve: (doc) =>
        blogPosting(doc, { headerImage: doc.headerImage, dateModified: doc.lastmod }),
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
      resolve: (doc) => blogPosting(doc),
    },
  },
}))

export const Raids = defineDocumentType(() => ({
  name: 'Raids',
  filePathPattern: 'raids/**/*.mdx',
  contentType: 'mdx',
  fields: instanceFields,
  computedFields: {
    ...computedFields,
    encounters: { type: 'json', resolve: (doc) => extractEncounters(doc.body.raw) },
    structuredData: {
      type: 'json',
      resolve: (doc) =>
        blogPosting(doc, { headerImage: doc.headerImage, dateModified: doc.lastmod }),
    },
  },
}))

export default makeSource({
  contentDirPath: 'data',
  contentDirExclude: ['wowhead-cache.json'],
  documentTypes: [Blog, Dungeons, Raids, About],
  mdx: {
    cwd: process.cwd(),
    remarkPlugins: [...remarkPlugins, remarkImgToJsx],
    rehypePlugins: [
      ...rehypePlugins,
      rehypeKatex,
      [rehypePrismPlus, { defaultLanguage: 'text', ignoreMissing: true }],
    ],
  },
})
