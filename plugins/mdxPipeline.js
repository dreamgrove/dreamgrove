import { remarkAlert } from 'remark-github-blockquote-alert'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import remarkSafeMdx from './remarkSafeMdx.js'
import remarkGroupCheckboxes from './remarkGroupCheckboxes.js'
import remarkSpell from './remarkSpell.js'
import remarkColor from './remarkColor.js'
import rehypeGroupHeaders from './rehypeGroupHeaders.js'

// The MDX pipeline shared by the contentlayer build and the editor's live preview,
// so the preview renders (and rejects) exactly what the site will. The build adds
// the plugins that need the filesystem or are too heavy for the browser.

/** @type {import('@mdx-js/mdx').CompileOptions['remarkPlugins'] & {}} */
export const remarkPlugins = [
  // First, so it only sees what the author wrote
  remarkSafeMdx,
  remarkAlert,
  remarkGroupCheckboxes,
  remarkGfm,
  // Also keeps LaTeX braces from being read as expressions
  remarkMath,
  remarkSpell,
  remarkColor,
]

/** @type {import('@mdx-js/mdx').CompileOptions['rehypePlugins'] & {}} */
export const rehypePlugins = [
  rehypeSlug,
  rehypeGroupHeaders,
  [
    rehypeAutolinkHeadings,
    {
      behavior: 'prepend',
      // h1.content-header is what numbers compendium sections (css/tailwind.css)
      headingProperties: { className: ['content-header'] },
      // An empty anchor: headings stay linkable without a visible icon.
      content: [],
    },
  ],
]
