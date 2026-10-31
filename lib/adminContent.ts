// Shared between the admin file browser (/admin/select), the editor (/admin/edit)
// and /api/compendium/list.
import matter from 'gray-matter'
import type { SpecId } from '@/data/specs'

export type ContentKind = 'compendium' | 'article' | 'dungeon' | 'raid' | 'page'

export interface ContentFile {
  /** Relative to data/, always with forward slashes (e.g. blog/feral/compendium.mdx) */
  path: string
  name: string
  kind: ContentKind
  title: string
  summary?: string
  specs: string[]
  draft: boolean
  date?: string
  /** Set for translated copies, e.g. 'kr' for blog/<spec>/kr/compendium.mdx */
  locale?: string
}

/** Pages that can be created from /admin/select */
export type NewPageKind = 'article' | 'dungeon' | 'raid'

export interface NewPageInput {
  kind: NewPageKind
  title: string
  slug: string
  summary: string
  authors: string[]
  specs: SpecId[]
  draft: boolean
}

export const SLUG_PATTERN = /^[a-z0-9]+(?:[-_][a-z0-9]+)*$/

// Dungeon and raid files use underscores (the_dreamrift.mdx), blog posts use dashes
export function slugify(title: string, kind: NewPageKind): string {
  const sep = kind === 'article' ? '-' : '_'
  return title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, sep)
    .replace(new RegExp(`^\\${sep}+|\\${sep}+$`, 'g'), '')
}

/**
 * Articles go in the folder of the first spec they're tagged with, or at the
 * top of blog/ when they're general guides; the folder is only for tidiness,
 * listing is driven by the `specs` frontmatter.
 */
export function newPagePath({ kind, slug, specs }: Pick<NewPageInput, 'kind' | 'slug' | 'specs'>) {
  if (kind === 'dungeon') return `dungeons/${slug}.mdx`
  if (kind === 'raid') return `raids/${slug}.mdx`
  return specs.length > 0 ? `blog/${specs[0]}/${slug}.mdx` : `blog/${slug}.mdx`
}

const BODY: Record<NewPageKind, string> = {
  article: '## Introduction\n\nStart writing here.\n',
  dungeon:
    '<BossCard title="Trash">\n- TBD\n</BossCard>\n\n<BossCard title="First boss">\n- TBD\n</BossCard>\n',
  raid: '<BossCard title="First boss">\n- TBD\n</BossCard>\n',
}

export function newPageDocument(input: NewPageInput, today = new Date()): string {
  const data: Record<string, unknown> = { title: input.title.trim() }
  if (input.summary.trim()) data.summary = input.summary.trim()
  if (input.authors.length) data.authors = input.authors
  data.date = today.toISOString().slice(0, 10)
  data.draft = input.draft
  if (input.specs.length) data.specs = input.specs
  return matter.stringify(BODY[input.kind], data)
}

const NEW_PAGE_PREFIX = 'dreamgrove:new-page:v1:'

export function stashNewPage(filePath: string, document: string) {
  try {
    window.sessionStorage.setItem(NEW_PAGE_PREFIX + filePath, document)
  } catch {
    // Storage blocked
  }
}

export function readNewPage(filePath: string): string | null {
  try {
    return window.sessionStorage.getItem(NEW_PAGE_PREFIX + filePath)
  } catch {
    return null
  }
}

export function clearNewPage(filePath: string) {
  try {
    window.sessionStorage.removeItem(NEW_PAGE_PREFIX + filePath)
  } catch {
    // Nothing to clean up if storage is unavailable
  }
}
