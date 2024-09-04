import TOCInline from 'pliny/ui/TOCInline'
import Pre from 'pliny/ui/Pre'
import BlogNewsletterForm from 'pliny/ui/BlogNewsletterForm'
import type { MDXComponents } from 'mdx/types'
import Image from './Image'
import CustomLink from './Link'
import TableWrapper from './TableWrapper'
import Wowhead from './custom/Wowhead'
import Talents from './custom/Talents'
import Checkbox from './custom/Checkbox'
import HeroTalentsHeader from './custom/HeroTalents/HeroTalentsHeader'
import BossCard from './custom/Dungeons/BossCard'
import Npc from './custom/Npc'
import CheckboxProvider from './custom/CheckboxProvider'
import Changelog from './custom/Changelog/Changelog'

export const components: MDXComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  li: ({ children, ...props }) => {
    let id = ''
    const regex = /^\[\*(.*?)\]/ //Matches [*text]
    const processChildren = (children) => {
      if (typeof children === 'string') {
        const regex = /^\[\*(.*?)\]/
        const match = children.match(regex)
        if (match) {
          id = match[1] // This will now hold the entire logical expression
          return children.replace(regex, '')
        }
      } else if (Array.isArray(children)) {
        const firstElement = [...children][0]
        if (typeof firstElement === 'string') {
          const match = firstElement.match(/^\[\*(.*?)\]/)
          if (match) {
            id = match[1]
            const modifiedFirstElement = firstElement.replace(regex, '')
            return [modifiedFirstElement, ...children.slice(1)]
          }
        }
      }
      return children
    }
    children = processChildren(children)
    return (
      <li id={`${id}-${Math.floor(Math.random() * 1000)}`} {...props}>
        {children}
      </li>
    )
  },
  pre: Pre,
  table: TableWrapper,
  Changelog,
  BlogNewsletterForm,
  Wowhead,
  Talents,
  Checkbox,
  HeroTalentsHeader,
  BossCard,
  Npc,
  CheckboxProvider,
}
