import * as _jsx_runtime from 'react/jsx-runtime'
import { getComponents } from './MDXComponents'
import type { PageLocale } from '@/lib/pageLocale'

function getMDXComponent(code: string) {
  const fn = new Function('_jsx_runtime', code)
  return fn(_jsx_runtime).default
}

export const MDXLayoutRenderer = ({
  code,
  components,
  locale,
  ...rest
}: {
  code: string
  components?: Record<string, React.ComponentType>
  locale?: PageLocale
  [key: string]: unknown
}) => {
  const MDXContent = getMDXComponent(code)
  const hasMath = code.includes('katex')
  return (
    <>
      {hasMath && (
        // eslint-disable-next-line @next/next/no-css-tags -- loaded per page on purpose
        <link rel="stylesheet" href="/static/katex/katex.min.css" precedence="default" />
      )}
      {/* eslint-disable-next-line react-hooks/static-components -- compiled per post; stateless server render */}
      <MDXContent components={{ ...getComponents(locale), ...components }} {...rest} />
    </>
  )
}
