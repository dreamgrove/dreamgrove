// Content listing and new-page templates, shared between the admin file browser
// (/admin/select), the editor (/admin/edit) and /api/compendium/list.
import matter from 'gray-matter'
import { SPECS, type SpecId } from '@/data/specs'

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

// --- Grouping for /admin/select ------------------------------------------------

const byTitle = (a: ContentFile, b: ContentFile) => a.title.localeCompare(b.title)
const byNewest = (a: ContentFile, b: ContentFile) =>
  (b.date ?? '').localeCompare(a.date ?? '') || byTitle(a, b)

// Same exclusions as lib/guides.ts: translations and the test page aren't listed as guides
const isListedArticle = (f: ContentFile) =>
  f.kind === 'article' && !f.locale && !f.path.startsWith('blog/test/')

/** Whether `file` matches a lowercased search query */
function matchesQuery(file: ContentFile, query: string) {
  if (!query) return true
  return [file.title, file.path, file.summary ?? '', ...file.specs].some((s) =>
    s.toLowerCase().includes(query)
  )
}

/** The file browser's sections, filtered by a lowercased search query */
export function groupContentFiles(files: ContentFile[], query: string) {
  const shown = files.filter((f) => matchesQuery(f, query))
  const compendia = SPECS.map((spec) => ({
    spec,
    file: files.find((f) => f.path === `blog/${spec.id}/compendium.mdx`),
    translations: files.filter(
      (f) => f.kind === 'compendium' && f.locale && f.path.startsWith(`blog/${spec.id}/`)
    ),
  })).filter((c) => !query || [c.file, ...c.translations].some((f) => f && matchesQuery(f, query)))
  const articles = shown.filter(isListedArticle)
  // Everything the sections above already list; the rest goes under "Other pages"
  const listed = new Set<string>([
    ...files
      .filter(
        (f) => f.kind === 'compendium' && SPECS.some((s) => f.path.startsWith(`blog/${s.id}/`))
      )
      .map((f) => f.path),
    ...files.filter(isListedArticle).map((f) => f.path),
  ])
  return {
    compendia,
    bySpec: SPECS.map((spec) => ({
      spec,
      files: articles.filter((f) => f.specs.includes(spec.id)).sort(byNewest),
    })),
    general: articles.filter((f) => f.specs.length === 0).sort(byNewest),
    dungeons: shown.filter((f) => f.kind === 'dungeon').sort(byTitle),
    raids: shown.filter((f) => f.kind === 'raid').sort(byTitle),
    other: shown
      .filter((f) => !listed.has(f.path) && f.kind !== 'dungeon' && f.kind !== 'raid')
      .sort(byTitle),
  }
}
