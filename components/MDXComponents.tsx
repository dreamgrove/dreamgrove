import type { MDXComponents } from 'mdx/types'
import ContentLink from './mdx/ContentLink'
import Wowhead from './custom/Wowhead'
import Checkbox from './custom/Checkbox'
import Timeline from './custom/Timeline'
import PlannerEmbed from './custom/PlannerEmbed'
import { sharedComponents, withLocale } from './mdx/shared'
import type { PageLocale } from '@/lib/pageLocale'

// English registry. getComponents() below derives the Korean one from it.
export const components: MDXComponents = {
  ...sharedComponents,
  a: ContentLink,
  Wowhead,
  Checkbox,
  Timeline,
  PlannerEmbed,
}

const koComponents = withLocale(components, 'ko')

// English pages (and an undefined locale) get the plain registry object, so their
// render is unchanged.
export function getComponents(locale?: PageLocale): MDXComponents {
  return locale === 'ko' ? koComponents : components
}
