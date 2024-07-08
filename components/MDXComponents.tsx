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
import HeroTalents from './custom/HeroTalents/HeroTalents'
import HeroTalentsPicker from './custom/HeroTalents/HeroTalentsPicker'
import BossCard from './custom/Dungeons/BossCard'
import Npc from './custom/Npc'
import CheckboxProvider from './custom/CheckboxProvider'

export const components: MDXComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  li: ({ children, ...props }) => {
    let id = ''
    const regex = /^\[\*(.*?)\]/ //Matches [*text]
    const processChildren = (children) => {
      if (typeof children === 'string') {
        const match = children.match(regex)
        if (match) {
          id = match[1]
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
  BlogNewsletterForm,
  Wowhead,
  Talents,
  Checkbox,
  HeroTalents,
  HeroTalentsPicker,
  BossCard,
  Npc,
  CheckboxProvider,
}
