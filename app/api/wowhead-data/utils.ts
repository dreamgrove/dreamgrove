// Quality colors for reference
export const qualityToColor = {
  1: '#ffffff',
  2: '#1eff00',
  3: '#0070dd',
  4: '#a335ee',
  5: '#ff8000',
}

// The types parseWowheadUrl recognizes, and therefore the only types Link.tsx
// turns into a <Wowhead> and extractIdFromUrl can pull an id from. Wowhead has
// many more (achievement=, quest=, currency=, ...); those stay plain anchors and
// get only what wow.zamimg.com/js/tooltips.js gives wowhead.com links on the
// pages that load it.
const WOWHEAD_LINK_TYPES = ['item', 'spell', 'npc'] as const

export type WowheadLinkType = (typeof WOWHEAD_LINK_TYPES)[number]

const isWowheadLinkType = (value: string): value is WowheadLinkType =>
  (WOWHEAD_LINK_TYPES as readonly string[]).includes(value)

export interface WowheadUrlParts {
  type: WowheadLinkType
  /** Digits only. The parser rejects any other id. */
  id: string
  /**
   * Slug after the id, percent-decoded when the escape is valid and kept raw
   * otherwise, or '' when the URL has none.
   */
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
  // Not a supported Wowhead link (other host, other type, or a bad id), so
  // there is no id to name it by. Best effort.
  return titleCase(url.split('/').pop() || '')
}

export function extractIdFromUrl(url: string): string {
  return parseWowheadUrl(url)?.id ?? ''
}

/**
 * Fallback href used by the Wowhead link/icon components when the author gave
 * no explicit URL (bare spell markers, direct <Wowhead> usage without `url`).
 * Widgets that build their own hrefs (Npc, the talent tree, Timeline's
 * synthetic labels) are not routed through here. Hosted on ko.wowhead.com when
 * the authored label is Korean, so Wowhead's tooltip script serves the Korean
 * tooltip for that link. The site ships English and Korean guides only, which
 * makes Hangul in the label a reliable locale signal; if more locales ever
 * appear, thread a real page locale down from the MDX pipeline instead of
 * extending this heuristic.
 */
export function buildWowheadUrl(
  type: string,
  id: string | number,
  name?: unknown,
  beta = false
): string {
  const host =
    typeof name === 'string' && /[가-힣]/.test(name) ? 'ko.wowhead.com' : 'www.wowhead.com'
  return `https://${host}/${beta ? 'beta/' : ''}${type}=${id}`
}
