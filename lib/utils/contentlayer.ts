import type { Document, MDX } from 'contentlayer2/core'

export type MDXDocument = Document & { body: MDX }
export type MDXDocumentDate = MDXDocument & { date: string }

export type CoreContent<T> = Omit<T, 'body' | '_raw' | '_id'>

const isProduction = process.env.NODE_ENV === 'production'

export function sortPosts<T extends MDXDocumentDate>(allBlogs: T[], dateKey = 'date'): T[] {
  return allBlogs.sort((a, b) => {
    if (a[dateKey] > b[dateKey]) return -1
    if (a[dateKey] < b[dateKey]) return 1
    return 0
  })
}

export function coreContent<T extends MDXDocument>(content: T): CoreContent<T> {
  const result = Object.assign({}, content)
  delete (result as Record<string, unknown>)['body']
  delete (result as Record<string, unknown>)['_raw']
  delete (result as Record<string, unknown>)['_id']
  return result as CoreContent<T>
}

export function allCoreContent<T extends MDXDocument>(contents: T[]): CoreContent<T>[] {
  if (isProduction)
    return contents.map((c) => coreContent(c)).filter((c) => !('draft' in c && c.draft === true))
  return contents.map((c) => coreContent(c))
}
