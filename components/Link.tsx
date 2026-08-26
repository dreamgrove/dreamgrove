import Link from 'next/link'
import type { LinkProps } from 'next/link'
import { AnchorHTMLAttributes } from 'react'
import Wowhead from './custom/Wowhead'
import { parseWowheadUrl } from '../app/api/wowhead-data/utils'

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
        // Falls back to '' for a slugless URL, which lets Wowhead use the name
        // from the tooltip rather than inventing one from the path.
        name={rest && rest.children ? rest.children : capitalize(wowhead.slug)}
      />
    )
  }

  return <a target="_blank" rel="noopener noreferrer" href={href} {...rest} />
}

export default CustomLink

const capitalize = (url) => {
  if (!url) return ''
  return url
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}
