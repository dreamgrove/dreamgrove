// An .mdx file as the editor holds it: the body in the editor, the
// frontmatter in the details form, authors as the comma-separated text typed.
import matter from 'gray-matter'
import { localeFromPath } from '@/lib/pageLocale'

export type Frontmatter = Record<string, any>

export interface EditorDocument {
  body: string
  frontmatter: Frontmatter
  authorsInput: string
}

export const splitAuthors = (input: string) =>
  input
    .split(',')
    .map((a) => a.trim())
    .filter(Boolean)

export function parseDocument(content: string): EditorDocument {
  try {
    const parsed = matter(content)
    const fm = parsed.data
    return {
      body: parsed.content.replace(/^\n/, ''),
      frontmatter: fm,
      authorsInput: Array.isArray(fm.authors) ? fm.authors.join(', ') : (fm.authors ?? ''),
    }
  } catch (err) {
    console.error('Error parsing markdown content:', err)
    return { body: content, frontmatter: {}, authorsInput: '' }
  }
}

/**
 * Serializes the editor state back into a single .mdx document. The loader,
 * the draft autosave and the save-to-GitHub path all go through this so they
 * agree on the exact bytes; otherwise "is this draft different from the file?"
 * would report spurious differences from frontmatter re-formatting alone.
 */
export function serializeDocument({ body, frontmatter, authorsInput }: EditorDocument): string {
  const data: Frontmatter = { ...frontmatter }
  const authors = splitAuthors(authorsInput)
  if (authors.length) data.authors = authors
  else delete data.authors
  if (Object.keys(data).length === 0) return body
  return matter.stringify(body, data)
}

/** Where the page is served, for pages that are already live (English only) */
/**
 * The page with frontmatter `lastmod` set to `date` (YYYY-MM-DD), which the site
 * shows as "Updated". Same gray-matter round trip as serializeDocument.
 */
export function withLastmod(content: string, date: string): string {
  const { content: body, data } = matter(content)
  // gray-matter caches parses by input, so its data object must not be mutated
  return matter.stringify(body, { ...data, lastmod: date })
}

export function livePageHref(filePath: string, isNew: boolean) {
  return !isNew && localeFromPath(filePath) === 'en' ? `/${filePath.replace(/\.mdx?$/, '')}` : null
}
