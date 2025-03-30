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
import Collapsible from './custom/Collapsible/Collapsible'
import Timeline from './custom/Timeline'
import TalentTree from './custom/TalentTree'
import YouTube from './custom/YouTube'
import Alert from './custom/Alert'
import MDXBlockquote from './custom/MDXBlockquote'

export const components: MDXComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  blockquote: MDXBlockquote,
  li: ({ children, ...props }) => {
    let id = ''
    const regex = /^\[\*(.*?)\]/ //Matches [*text]
    const processChildren = (children) => {
      if (typeof children === 'string') {
        const regex = /^\[\*(.*?)\]/
        const match = children.match(regex)
        if (match) {
          id = match[1] // This will now hold the entire logical expression
          // Remove only leading space after the tag, keep the rest
          const afterSelector = children.slice(match[0].length)
          return afterSelector.charAt(0) === ' ' ? afterSelector.slice(1) : afterSelector
        }
      } else if (Array.isArray(children)) {
        // Find the first text node that contains the selector
        const selectorIndex = children.findIndex(
          (child) => typeof child === 'string' && child.match(/^\[\*(.*?)\]/)
        )

        if (selectorIndex !== -1) {
          const match = children[selectorIndex].match(/^\[\*(.*?)\]/)
          id = match[1]

          // Preserve the remaining text in the matched node, but trim leading space
          let remainingText = children[selectorIndex].slice(match[0].length)
          if (remainingText.charAt(0) === ' ') {
            remainingText = remainingText.slice(1)
          }

          // Create a new array with the remaining text and everything after
          const newChildren = [
            ...(remainingText ? [remainingText] : []),
            ...children.slice(selectorIndex + 1),
          ]

          return newChildren
        }
        // If no match, return the children array exactly as is
        return children
      }
      return children
    }
    children = processChildren(children)
    return id ? (
      <li
        id={`${id}-${Math.floor(Math.random() * 1000)}`}
        {...props}
        style={{ whiteSpace: 'pre-wrap' }}
      >
        {children}
      </li>
    ) : (
      <li {...props} style={{ whiteSpace: 'pre-wrap' }}>
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
  Collapsible,
  TalentTree,
  Timeline,
  YouTube,
  Alert,
  p: ({ children, ...props }) => {
    let id = ''
    const regex = /^\[\*(.*?)\]/ //Matches [*text]
    const processChildren = (children) => {
      if (typeof children === 'string') {
        const regex = /^\[\*(.*?)\]/
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
    return id ? (
      <div id={`${id}-${Math.floor(Math.random() * 1000)}`} {...props}>
        {children}
      </div>
    ) : (
      <p {...props}>{children}</p>
    )
  },
}
