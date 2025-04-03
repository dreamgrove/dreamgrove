'use client'

import { useState, useEffect, memo, Fragment, ComponentType, useRef } from 'react'
import * as runtime from 'react/jsx-runtime'
import * as devRuntime from 'react/jsx-dev-runtime'
import { evaluate, EvaluateOptions } from '@mdx-js/mdx'
import { MDXComponents } from 'mdx/types'

import Talents from '@/components/custom/Talents/Talents'
import Collapsible from '@/components/custom/Collapsible/Collapsible'

import CheckboxClientVersion from './csm/CheckboxClientVersion'
import WowheadClientVersion from './csm/WowheadClientVersion'
import HeroTalentsHeader from './custom/HeroTalents/HeroTalentsHeader'

import remarkSpell from '../plugins/remarkSpell.js'
import remarkGroupCheckboxes from '../plugins/remarkGroupCheckboxes.js'
import ConditionalElement from './custom/ConditionalElement'
import TimelineClientVersion from './csm/TimelineClientVersion'

import { remarkAlert } from 'remark-github-blockquote-alert'
import YouTube from './custom/YouTube'
import Image from 'next/image'
import TableWrapper from './TableWrapper'

interface MDXPreviewProps {
  content: string
}

interface MdxModule {
  default: ComponentType
  [key: string]: unknown
}

function debounce(func: (...args: string[]) => void, wait: number): (...args: string[]) => void {
  let timeoutId: NodeJS.Timeout | null = null
  return (...args: string[]) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

const components: MDXComponents = {
  table: TableWrapper,
  Image: ({ src, alt, ...props }) => {
    let id = ''
    const regex = /^\[\*(.*?)\]/ //Matches [*text]

    if (typeof alt === 'string') {
      const match = alt.trim().match(regex)
      if (match) {
        id = match[1]
        alt = alt.replace(regex, '').trim()
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
    const regex = /^\[\*(.*?)\]/ //Matches [*text]

    const processChildren = (children) => {
      if (typeof children === 'string') {
        const match = children.trim().match(regex)
        if (match) {
          id = match[1]
          return children.replace(regex, '').trim()
        }
      } else if (Array.isArray(children)) {
        const firstElement = children[0]
        if (typeof firstElement === 'string') {
          const match = firstElement.trim().match(regex)
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
  Talents,
  Collapsible,
  YouTube: YouTube,
  Checkbox: CheckboxClientVersion,
  Wowhead: WowheadClientVersion,
  Timeline: TimelineClientVersion,
  HeroTalentsHeader,
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
      <ConditionalElement id={id} {...props}>
        {children}
      </ConditionalElement>
    ) : (
      <p {...props}>{children}</p>
    )
  },
  li: ({ children, ...props }) => {
    let id = ''
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
      <ConditionalElement type="li" id={id} {...props}>
        {children}
      </ConditionalElement>
    ) : (
      <li {...props}>{children}</li>
    )
  },
}

const isDevelopment = process.env.NODE_ENV === 'development'

const MDXPreview = memo(function MDXPreview({ content }: MDXPreviewProps) {
  const [mdxModule, setMdxModule] = useState<MdxModule | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false)
  const evaluateMdxRef = useRef<((...args: string[]) => void) | null>(null)

  useEffect(() => {
    evaluateMdxRef.current = debounce(async (mdxContent: string) => {
      setIsEvaluating(true)
      try {
        setError(null)

        const evaluateOptions: EvaluateOptions = {
          ...(isDevelopment ? devRuntime : runtime),
          Fragment: isDevelopment ? devRuntime.Fragment : runtime.Fragment,
          useMDXComponents: () => components,
          development: isDevelopment,
          remarkPlugins: [remarkAlert, remarkSpell, remarkGroupCheckboxes],
        }

        const evaluated = await evaluate(mdxContent, evaluateOptions)
        setMdxModule(evaluated as MdxModule)
      } catch (err: unknown) {
        console.error('MDX Evaluation Error:', err)
        const message =
          err instanceof Error
            ? err.message
            : 'An unknown error occurred during preview generation.'
        setError(`Preview Error: ${message}`)
        setMdxModule(null)
      } finally {
        setIsEvaluating(false)
      }
    }, 500)
  }, [])

  useEffect(() => {
    if (content && evaluateMdxRef.current) {
      evaluateMdxRef.current(content)
    } else {
      setMdxModule(null)
      setError(null)
      setIsEvaluating(false)
    }
  }, [content])

  const LiveComponent = mdxModule ? mdxModule.default : null

  return (
    <div className="mdx-preview text-gray-800 dark:text-gray-200">
      {error && (
        <div className="my-2 rounded-md border border-red-400 bg-red-50 p-3 text-red-700 dark:border-red-600 dark:bg-red-900 dark:text-red-300">
          {error}
        </div>
      )}
      {isEvaluating && (
        <div className="italic text-gray-500 dark:text-gray-400">Generating preview...</div>
      )}
      <div
        className={`${LiveComponent && !error ? 'prose max-w-none px-16 pb-8 pt-4 text-base dark:prose-invert sm:pt-0' : ''}`}
      >
        {LiveComponent && !isEvaluating ? (
          <LiveComponent />
        ) : (
          !error &&
          !isEvaluating && (
            <p className="italic text-gray-500 dark:text-gray-400">
              Start typing to see preview...
            </p>
          )
        )}
      </div>
    </div>
  )
})

MDXPreview.displayName = 'MDXPreview'

export default MDXPreview
