import Link from 'next/link'
import type { LinkProps } from 'next/link'
import { AnchorHTMLAttributes } from 'react'
import Wowhead from './custom/Wowhead'
import { parseWowheadUrl, titleCase } from '../app/api/wowhead-data/utils'

const CustomLink = ({ href, ...rest }: LinkProps & AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const isInternalLink = href && href.startsWith('/')
  const isAnchorLink = href && href.startsWith('#')

  if (isInternalLink) {
    return <Link href={href} {...rest} />
  }

  if (isAnchorLink) {
    return <a href={href} {...rest} />
  }

  const wowhead = parseWowheadUrl(href)
  if (wowhead) {
    return (
      <Wowhead
        type={wowhead.type}
        id={wowhead.id}
        url={href}
        // A slugless URL gives '', which fetchWowheadData reads as "caller gave
        // no name" and fills from the tooltip JSON instead of from the path.
        name={rest && rest.children ? rest.children : titleCase(wowhead.slug)}
      />
    )
  }

  return <a target="_blank" rel="noopener noreferrer" href={href} {...rest} />
}

export default CustomLink
