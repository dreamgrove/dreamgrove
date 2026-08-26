// Quality colors for reference
export const qualityToColor = {
  1: '#ffffff',
  2: '#1eff00',
  3: '#0070dd',
  4: '#a335ee',
  5: '#ff8000',
}

// Types we can render an icon and a tooltip for. Wowhead has many more
// (achievement=, quest=, currency=, ...), which stay plain links.
const WOWHEAD_LINK_TYPES = ['item', 'spell', 'npc']

export interface WowheadUrlParts {
  type: string
  id: string
  /** The human-readable segment after the id, or '' when the URL has none. */
  slug: string
}

function titleCase(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

/**
 * Finds the `type=id` segment of a Wowhead URL, wherever it sits.
 *
 * Wowhead URLs are not uniform in two ways that broke the old positional
 * parsing. The slug after the id is optional, so `/item=271884` and
 * `/item=271884/silvermoon-elixir` are the same page but only the second has
 * the id in the second-to-last segment. And every locale gets its own host,
 * so `ko.wowhead.com/spell=1822/rake` never matched a `www.` prefix check.
 * Either shape used to fall through to a plain anchor with no icon, no quality
 * color and no tooltip.
 *
 * Returns null for anything that is not a Wowhead link to a supported type.
 */
export function parseWowheadUrl(url: string): WowheadUrlParts | null {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return null // relative, anchor-only or otherwise not an absolute URL
  }

  const { hostname } = parsed
  if (hostname !== 'wowhead.com' && !hostname.endsWith('.wowhead.com')) {
    return null
  }

  // Skips leading segments like `ptr/` or `beta/`, and drops the query string
  // (`?crafting-quality=5`) and hash along with it.
  const segments = parsed.pathname.split('/').filter(Boolean)
  const index = segments.findIndex((segment) => {
    const [type, id] = segment.split('=')
    return WOWHEAD_LINK_TYPES.includes(type) && /^\d+$/.test(id ?? '')
  })
  if (index === -1) return null

  const [type, id] = segments[index].split('=')
  return { type, id, slug: segments[index + 1] ?? '' }
}

/** Last-resort display name for a link whose tooltip lookup returned nothing. */
export function formatUrl(url: string): string {
  const parsed = parseWowheadUrl(url)
  if (parsed) {
    return parsed.slug ? titleCase(parsed.slug) : `${parsed.type}-${parsed.id}`
  }
  return titleCase(url.split('/').pop() || '')
}

export function extractIdFromUrl(url: string): string {
  return parseWowheadUrl(url)?.id ?? ''
}
