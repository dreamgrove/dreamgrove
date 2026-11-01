import type { LinkProps } from 'next/link'
import type { AnchorHTMLAttributes } from 'react'
import Link from '@/components/Link'
import Wowhead from '@/components/custom/Wowhead'
import { parseWowheadUrl, titleCase } from '@/lib/wowhead/urls'

/**
 * Links in guide content: Wowhead links render as <Wowhead> (fetched on the
 * server), everything else as a site link. Server only; client components use
 * components/Link directly.
 */
const ContentLink = ({ href, ...rest }: LinkProps & AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const wowhead = typeof href === 'string' ? parseWowheadUrl(href) : null
  if (wowhead) {
    return (
      <Wowhead
        type={wowhead.type}
        id={wowhead.id}
        url={href}
        // A slugless URL gives '', which fetchWowheadData reads as "caller gave
        // no name" and fills from the tooltip JSON (or, failing that, type-id).
        name={rest && rest.children ? rest.children : titleCase(wowhead.slug)}
      />
    )
  }
  return <Link href={href} {...rest} />
}

export default ContentLink
