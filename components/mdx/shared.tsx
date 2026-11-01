import type { ComponentType } from 'react'
import type { MDXComponents } from 'mdx/types'
import Image from '@/components/Image'
import Pre from '@/components/ui/Pre'
import TableWrapper from '@/components/TableWrapper'
import ConditionalElement from '@/components/custom/ConditionalElement'
import CheckboxProvider from '@/components/custom/CheckboxProvider'
import Collapsible from '@/components/custom/Collapsible/Collapsible'
import Color from '@/components/custom/Color'
import HeroTalentsHeader from '@/components/custom/HeroTalents/HeroTalentsHeader'
import Npc from '@/components/custom/Npc'
import Talents from '@/components/custom/Talents/Talents'
import YouTube from '@/components/custom/YouTube'
import Encounter from '@/components/spec/Encounter'
import SpecNote from '@/components/spec/SpecNote'
import type { PageLocale } from '@/lib/pageLocale'

// `[*id]` at the start of an image alt, list item, paragraph or div shows the
// element only while checkbox `id` is checked (see ConditionalElement).
const SELECTOR = /^\[\*(.*?)\]/

/**
 * MDX components that render the same on the live site and in the editor's
 * client-side preview. Components that fetch from Wowhead on the server
 * (Wowhead, Checkbox, Timeline, PlannerEmbed, links) are added by each side.
 */
export const sharedComponents: MDXComponents = {
  Image: ({ src, alt, ...props }) => {
    let id = ''

    if (typeof alt === 'string') {
      const match = alt.trim().match(SELECTOR)
      if (match) {
        id = match[1]
        alt = alt.replace(SELECTOR, '').trim()
      }
    }

    const wrappedImage = <Image src={src} alt={alt} {...props} />
    return id ? (
      <ConditionalElement type="img" id={id}>
        {wrappedImage}
      </ConditionalElement>
    ) : (
      wrappedImage
    )
  },
  div: ({ children, ...props }) => {
    let id = ''

    const processChildren = (children) => {
      if (typeof children === 'string') {
        const match = children.trim().match(SELECTOR)
        if (match) {
          id = match[1]
          return children.replace(SELECTOR, '').trim()
        }
      } else if (Array.isArray(children)) {
        const firstElement = children[0]
        if (typeof firstElement === 'string') {
          const match = firstElement.trim().match(SELECTOR)
          if (match) {
            id = match[1]
            return children.filter((_, index) => index !== 0)
          }
        }
      }
      return children
    }

    children = processChildren(children)

    return id ? (
      <ConditionalElement id={id} {...props}>
        {children}
      </ConditionalElement>
    ) : (
      <div {...props}>{children}</div>
    )
  },
  li: ({ children, ...props }) => {
    let id = ''
    const processChildren = (children) => {
      if (typeof children === 'string') {
        const match = children.match(SELECTOR)
        if (match) {
          id = match[1]
          // Remove only leading space after the tag, keep the rest
          const afterSelector = children.slice(match[0].length)
          return afterSelector.charAt(0) === ' ' ? afterSelector.slice(1) : afterSelector
        }
      } else if (Array.isArray(children)) {
        // Find the first text node that contains the selector
        const selectorIndex = children.findIndex(
          (child) => typeof child === 'string' && child.match(SELECTOR)
        )

        if (selectorIndex !== -1) {
          const match = children[selectorIndex].match(SELECTOR)
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
      <ConditionalElement type="li" id={id} {...props}>
        {children}
      </ConditionalElement>
    ) : (
      <li {...props}>{children}</li>
    )
  },
  p: ({ children, ...props }) => {
    let id = ''
    const processChildren = (children) => {
      if (typeof children === 'string') {
        const match = children.match(SELECTOR)
        if (match) {
          id = match[1]
          return children.replace(SELECTOR, '')
        }
      } else if (Array.isArray(children)) {
        const firstElement = [...children][0]
        if (typeof firstElement === 'string') {
          const match = firstElement.match(SELECTOR)
          if (match) {
            id = match[1]
            const modifiedFirstElement = firstElement.replace(SELECTOR, '')
            return [modifiedFirstElement, ...children.slice(1)]
          }
        }
      }
      return children
    }
    children = processChildren(children)
    return id ? (
      <ConditionalElement id={id} {...props}>
        {children}
      </ConditionalElement>
    ) : (
      <p {...props}>{children}</p>
    )
  },
  pre: Pre,
  table: TableWrapper,
  CheckboxProvider,
  Talents,
  HeroTalentsHeader,
  Encounter,
  // Legacy name for <Encounter>, kept so older guides keep rendering
  BossCard: Encounter,
  SpecNote,
  Npc,
  Collapsible,
  YouTube,
  Color,
}

// Widgets whose UI strings or Wowhead hrefs have no other language signal get the
// page locale as a prop. Wowhead and plain links rely on the Hangul label check in
// buildWowheadUrl instead.
const LOCALE_AWARE = ['Talents', 'Timeline', 'PlannerEmbed', 'Npc'] as const

export function withLocale(base: MDXComponents, locale: PageLocale): MDXComponents {
  const localized: MDXComponents = { ...base }
  for (const name of LOCALE_AWARE) {
    const Component = base[name] as ComponentType<Record<string, unknown>> | undefined
    if (Component) {
      localized[name] = (props: Record<string, unknown>) => <Component {...props} locale={locale} />
    }
  }
  return localized
}
