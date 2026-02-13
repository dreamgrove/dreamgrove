import * as _jsx_runtime from 'react/jsx-runtime'
import { components as mdxComponents } from './MDXComponents'

function getMDXComponent(code: string) {
  const fn = new Function('_jsx_runtime', code)
  return fn(_jsx_runtime).default
}

export const MDXLayoutRenderer = ({
  code,
  components,
  ...rest
}: {
  code: string
  components?: Record<string, React.ComponentType>
  [key: string]: unknown
}) => {
  const MDXContent = getMDXComponent(code)
  return <MDXContent components={{ ...mdxComponents, ...components }} {...rest} />
}
