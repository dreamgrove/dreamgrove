'use client'

import React, { useState, useEffect, memo, ComponentType, useRef } from 'react'
import * as runtime from 'react/jsx-runtime'
import * as devRuntime from 'react/jsx-dev-runtime'
import { evaluate, EvaluateOptions } from '@mdx-js/mdx'
import { MDXComponents } from 'mdx/types'

import ErrorBoundary from '@/components/custom/ErrorBoundary'
import CheckboxProvider from '@/components/custom/CheckboxProvider'
import CheckboxClientVersion from '@/components/csm/CheckboxClientVersion'
import WowheadClientVersion from '@/components/csm/WowheadClientVersion'
import TimelineClientVersion from '@/components/csm/TimelineClientVersion'
import PlannerEmbedClientVersion from '@/components/csm/PlannerEmbedClientVersion'
import { sharedComponents, withLocale } from '@/components/mdx/shared'
import { remarkPlugins, rehypePlugins } from '../plugins/mdxPipeline.js'
import type { PageLocale } from '@/lib/pageLocale'

interface MDXPreviewProps {
  content: string
  setErrorLine?: (line: number | null) => void
  // Locale of the edited file, so the preview matches the published page
  locale?: PageLocale
}

interface MdxModule {
  default: ComponentType<{ components?: MDXComponents }>
  [key: string]: unknown
}

const COMPILE_DELAY_MS = 500

// The live site's registry, with client-side stand-ins for the components that
// fetch from Wowhead on the server.
const components: MDXComponents = {
  ...sharedComponents,
  Checkbox: CheckboxClientVersion,
  Wowhead: WowheadClientVersion,
  Timeline: TimelineClientVersion,
  PlannerEmbed: PlannerEmbedClientVersion,
}

const koComponents = withLocale(components, 'ko')

const isDevelopment = process.env.NODE_ENV === 'development'

const evaluateOptions: EvaluateOptions = {
  ...(isDevelopment ? devRuntime : runtime),
  Fragment: isDevelopment ? devRuntime.Fragment : runtime.Fragment,
  development: isDevelopment,
  remarkPlugins,
  rehypePlugins,
}

/** The source line a compile error points at; MDX errors are VFileMessages. */
function errorLine(err: unknown): number | null {
  const message = err as { line?: number; place?: { line?: number; start?: { line?: number } } }
  return message.line ?? message.place?.line ?? message.place?.start?.line ?? null
}

function PreviewRenderError() {
  return (
    <div className="not-prose my-2 rounded-md border border-red-400 bg-red-50 p-3 text-red-700 dark:border-red-600 dark:bg-red-900 dark:text-red-300">
      Preview Error: this content failed to render. Check the browser console for details.
    </div>
  )
}

const MDXPreview = memo(function MDXPreview({ content, setErrorLine, locale }: MDXPreviewProps) {
  // The last finished compile and the content it was for. `version` counts
  // successful compiles; it keys the error boundary below.
  const [result, setResult] = useState<{
    content: string
    module: MdxModule | null
    error: string | null
    version: number
  } | null>(null)
  // Passed to the compiled MDX when it renders, so switching locale doesn't re-evaluate
  const mdxComponents = locale === 'ko' ? koComponents : components
  const latestRun = useRef(0)
  // Read through a ref so a parent passing a fresh callback doesn't restart the compile
  const setErrorLineRef = useRef(setErrorLine)
  useEffect(() => {
    setErrorLineRef.current = setErrorLine
  }, [setErrorLine])

  useEffect(() => {
    const run = ++latestRun.current
    if (!content) return

    const timer = setTimeout(async () => {
      try {
        const compiled = (await evaluate(content, evaluateOptions)) as MdxModule
        // A slower compile of older content must not replace a newer one.
        if (run !== latestRun.current) return
        setErrorLineRef.current?.(null)
        setResult((prev) => ({
          content,
          module: compiled,
          error: null,
          version: (prev?.version ?? 0) + 1,
        }))
      } catch (err: unknown) {
        if (run !== latestRun.current) return
        const message =
          err instanceof Error
            ? err.message
            : 'An unknown error occurred during preview generation.'
        setErrorLineRef.current?.(errorLine(err))
        setResult((prev) => ({
          content,
          module: null,
          error: `Preview Error: ${message}`,
          version: prev?.version ?? 0,
        }))
      }
    }, COMPILE_DELAY_MS)

    return () => clearTimeout(timer)
  }, [content])

  const isEvaluating = !!content && result?.content !== content
  const error = content ? (result?.error ?? null) : null
  const LiveComponent = (content && result?.module?.default) || null

  return (
    <div className="mdx-preview divide-gray-200 bg-transparent pb-8 text-gray-900 dark:divide-gray-700 dark:text-gray-100">
      {error && (
        <div className="my-2 rounded-md border border-red-400 bg-red-50 p-3 text-red-700 dark:border-red-600 dark:bg-red-900 dark:text-red-300">
          {error}
        </div>
      )}
      {isEvaluating && !LiveComponent && (
        <div className="text-gray-500 italic dark:text-gray-400">Generating preview...</div>
      )}
      <div
        // Reset the heading counter here (as PostLayout does for real pages) so
        // h1.content-header::before numbers 1, 2, 3… instead of restarting each
        // header-group and always showing "1.".
        style={{ counterReset: 'heading' }}
        className={`${LiveComponent && !error ? 'prose mx-0 max-w-none pt-4 pb-8 text-base sm:pt-0 lg:mx-8 dark:prose-invert' : ''}`}
      >
        {LiveComponent ? (
          // Some errors (e.g. an MDX element with no matching component) only throw
          // while rendering, after `evaluate` has already resolved. Without a boundary
          // they escape the try/catch above and take the whole editor down, so each
          // compile gets a fresh boundary. The last good render stays up while the
          // next compile runs.
          <ErrorBoundary key={result?.version} fallback={<PreviewRenderError />}>
            <CheckboxProvider>
              <LiveComponent components={mdxComponents} />
            </CheckboxProvider>
          </ErrorBoundary>
        ) : (
          !error &&
          !isEvaluating && (
            <p className="text-gray-500 italic dark:text-gray-400">
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
