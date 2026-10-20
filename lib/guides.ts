import { allBlogs, allDungeons, allRaids } from 'contentlayer/generated'
import { SPECS, type SpecId } from '@/data/specs'

export type GuideType = 'Article' | 'Dungeon' | 'Raid'

export interface GuideEntry {
  title: string
  summary?: string
  date?: string
  type: GuideType
  href: string
}

const isProduction = process.env.NODE_ENV === 'production'
const visible = (doc: { draft?: boolean }) => !isProduction || doc.draft !== true

interface TaggedGuide extends GuideEntry {
  specs: string[]
}

/** Non-compendium blog articles plus dungeon and raid guides, newest first. */
function getAllGuides(): TaggedGuide[] {
  const articles: TaggedGuide[] = allBlogs
    .filter(
      (p) =>
        p.kind === 'article' && !p.slug.includes('kr/') && !p.slug.startsWith('test/') && visible(p)
    )
    .map((p) => ({
      title: p.title,
      summary: p.summary,
      date: p.date,
      type: 'Article',
      href: `/${p.path}`,
      specs: p.specs ?? [],
    }))

  const instances = (docs: typeof allDungeons | typeof allRaids, type: GuideType): TaggedGuide[] =>
    docs.filter(visible).map((p) => ({
      title: p.title,
      summary: p.summary,
      date: p.date,
      type,
      href: `/${p.path}`,
      specs: p.specs ?? [],
    }))

  return [...articles, ...instances(allDungeons, 'Dungeon'), ...instances(allRaids, 'Raid')].sort(
    (a, b) => (b.date ?? '').localeCompare(a.date ?? '')
  )
}

const strip = ({ specs: _specs, ...guide }: TaggedGuide): GuideEntry => guide

/**
 * Everything tagged with `specs: [<spec>]` in its frontmatter, newest first.
 */
export function getGuidesForSpec(spec: SpecId): GuideEntry[] {
  const roles = SPECS.find((s) => s.id === spec)?.checkboxKey
  return getAllGuides()
    .filter((g) => g.specs.includes(spec))
    .map(strip)
    .map((g) => (roles && g.type !== 'Article' ? { ...g, href: `${g.href}?roles=${roles}` } : g))
}

/**
 * Articles not tagged with any spec, newest first.
 */
export function getOtherGuides(): GuideEntry[] {
  return getAllGuides()
    .filter((g) => g.specs.length === 0 && g.type === 'Article')
    .map(strip)
}

export function getLatestHeaderImage(docs: typeof allDungeons | typeof allRaids) {
  return docs
    .filter((p) => visible(p) && p.headerImage)
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))[0]?.headerImage
}
