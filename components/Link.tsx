/* eslint-disable jsx-a11y/anchor-has-content */
import Link from 'next/link'
import type { LinkProps } from 'next/link'
import { AnchorHTMLAttributes } from 'react'
import Wowhead from './custom/Wowhead'

const capitalize = (url) => {
  if (!url) return ''
  return url
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

const CustomLink = ({ href, ...rest }: LinkProps & AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const isInternalLink = href && href.startsWith('/')
  const isAnchorLink = href && href.startsWith('#')

  if (isInternalLink) {
    return <Link href={href} {...rest} />
  }

  if (isAnchorLink) {
    return <a href={href} {...rest} />
  }

  if (href.startsWith('https://www.wowhead.com')) {
    const parts = href.split('/')
    const validTypes = ['item', 'spell', 'npc']
    const possibleType = parts.at(-2)?.split('=')
    const possibleName = parts.at(-1)?.split('?')[0]
    if (
      possibleType &&
      possibleType[0] &&
      possibleType[1] &&
      validTypes.includes(possibleType[0])
    ) {
      return (
        <Wowhead
          type={possibleType[0]}
          id={possibleType[1]}
          url={href}
          name={rest && rest.children ? rest.children : capitalize(possibleName)}
        />
      )
    }
  }

  return <a target="_blank" rel="noopener noreferrer" href={href} {...rest} />
}

export default CustomLink
