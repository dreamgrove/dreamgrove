// Quality colors for reference
export const qualityToColor = {
  1: '#ffffff',
  2: '#1eff00',
  3: '#0070dd',
  4: '#a335ee',
  5: '#ff8000',
}

// The types Link.tsx turns into a <Wowhead>. Wowhead has many more
// (achievement=, quest=, currency=, ...); those stay plain anchors and get only
// what wow.zamimg.com/js/tooltips.js gives every wowhead.com link on the page.
const WOWHEAD_LINK_TYPES = ['item', 'spell', 'npc'] as const

export type WowheadLinkType = (typeof WOWHEAD_LINK_TYPES)[number]

const isWowheadLinkType = (value: string): value is WowheadLinkType =>
  (WOWHEAD_LINK_TYPES as readonly string[]).includes(value)

export interface WowheadUrlParts {
  type: WowheadLinkType
  /** Digits only. The parser rejects any other id. */
  id: string
  /** Percent-decoded slug after the id, or '' when the URL has none. */
  slug: string
}

export function titleCase(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

function decodeSlug(segment: string): string {
  try {
    return decodeURIComponent(segment)
  } catch {
    // Malformed escape sequence. The raw segment is a worse name but a better
    // outcome than throwing out of a component that renders every MDX link.
    return segment
  }
}

/**
 * Finds the `type=id` segment of a Wowhead URL, wherever it sits in the path.
 *
 * Accepts any wowhead.com host, since each locale gets its own subdomain, and
 * does not require the optional slug that may follow the id. Returns null for
 * anything that is not a Wowhead link to a supported type.
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

  // pathname has already dropped the query string and the hash; filter(Boolean)
  // drops the empty segments a leading or trailing slash produces.
  const segments = parsed.pathname.split('/').filter(Boolean)

  // Scans every segment rather than a fixed position, so a `ptr/` or `beta/`
  // prefix, or anything else Wowhead puts in front, simply does not match.
  for (let i = 0; i < segments.length; i++) {
    const [type, id] = segments[i].split('=')
    if (isWowheadLinkType(type) && /^\d+$/.test(id ?? '')) {
      const slug = segments[i + 1]
      return { type, id, slug: slug ? decodeSlug(slug) : '' }
    }
  }

  return null
}

/**
 * Display name for a link whose tooltip JSON came back without a name. This is
 * not the failure path: when the lookup itself fails, server-function throws and
 * Wowhead.tsx supplies the fallback name instead.
 */
export function formatUrl(url: string): string {
  const parsed = parseWowheadUrl(url)
  if (parsed) {
    return parsed.slug ? titleCase(parsed.slug) : `${parsed.type}-${parsed.id}`
  }
  // Not a Wowhead link, so there is no id to name it by. Best effort.
  return titleCase(url.split('/').pop() || '')
}

export function extractIdFromUrl(url: string): string {
  return parseWowheadUrl(url)?.id ?? ''
}
