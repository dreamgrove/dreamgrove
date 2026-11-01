import type { Document, MDX } from 'contentlayer2/core'

export type MDXDocument = Document & { body: MDX }

export type CoreContent<T> = Omit<T, 'body' | '_raw' | '_id'>

const isProduction = process.env.NODE_ENV === 'production'

/** Drafts are visible in development and hidden in production builds. */
export function isPublished(doc: { draft?: boolean }): boolean {
  return !isProduction || doc.draft !== true
}

export function coreContent<T extends MDXDocument>(content: T): CoreContent<T> {
  const result = Object.assign({}, content)
  delete (result as Record<string, unknown>)['body']
  delete (result as Record<string, unknown>)['_raw']
  delete (result as Record<string, unknown>)['_id']
  return result as CoreContent<T>
}

/** Every published document, without the heavy MDX fields. Keeps contentlayer's order. */
export function allCoreContent<T extends MDXDocument>(contents: T[]): CoreContent<T>[] {
  return contents.filter((c) => isPublished(c as { draft?: boolean })).map((c) => coreContent(c))
}

/** `generateStaticParams` for a `[...slug]` route over a contentlayer collection. */
export function slugParams(docs: { slug: string }[]) {
  return docs.map((p) => ({ slug: p.slug.split('/').map((name) => decodeURI(name)) }))
}

/** The published document a `[...slug]` route's params point at, if any. */
export function findPublished<T extends { slug: string; draft?: boolean }>(
  docs: T[],
  slugSegments: string[]
): T | undefined {
  const slug = decodeURI(slugSegments.join('/'))
  const doc = docs.find((p) => p.slug === slug)
  return doc && isPublished(doc) ? doc : undefined
}
