import type { TalentNode } from './TalentTreeUtils'
import { parseTalentString } from '@/lib/talents/parseTalentString'

import { buildClassTree, buildSpecTree, buildHeroTree } from './TalentTreeModel'
import TalentsDropdown from './TalentsDropdown'
import TalentTreeClient from './TalentTreeClient'
import { talentStrings } from './strings'
import type { PageLocale } from '@/lib/pageLocale'

interface ColorConfig {
  color: string
  nodes: string[]
}

// Error component for the talent tree
function TalentTreeError({ error, locale }: { error: string; locale?: PageLocale }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg bg-red-50 p-8">
      <div className="mb-4 text-5xl text-red-500">⚠️</div>
      <h3 className="mb-2 text-xl font-semibold text-red-700">{talentStrings(locale).loadError}</h3>
      <p className="text-center text-gray-700">{error}</p>
    </div>
  )
}

export default function Talents({
  talents = '',
  viewOnly = false,
  name = '',
  comment = '',
  children,
  colors = [],
  extra = [],
  defaultTree = 'Full',
  open = false,
  hideCopy = false,
  forceTree,
  locale,
}: {
  talents?: string
  viewOnly?: boolean
  name?: string
  comment?: string
  children?: React.ReactNode
  colors?: ColorConfig[]
  extra?: string[]
  defaultTree?: 'Full' | 'Class' | 'Spec' | 'Hero'
  open?: boolean
  hideCopy?: boolean
  forceTree?: 'full' | 'class' | 'spec' | 'hero'
  locale?: PageLocale
}) {
  // Parse the talent string and get the active data
  const activeData = parseTalentString(talents)

  // Process color configurations
  const nodeColors = colors.reduce<Record<string, string>>((acc, config) => {
    config.nodes.forEach((nodeName) => {
      acc[nodeName.toLowerCase()] = config.color
    })
    return acc
  }, {})

  // Create a set of extra node names for quick lookup (case-insensitive)
  const extraNodeNames = new Set(extra.map((name) => name.toLowerCase()))

  // Mark extra nodes as "selected" for highlighting
  const markExtraNodes = (nodes: TalentNode[], selectedNodes: number[]) => {
    const extraSelectedNodes = [...selectedNodes]

    nodes.forEach((node) => {
      if (
        extraNodeNames.size > 0 &&
        [...extraNodeNames].some((name) => node.name.toLowerCase().includes(name))
      ) {
        if (!extraSelectedNodes.includes(node.id)) {
          extraSelectedNodes.push(node.id)
        }
      }
    })

    return extraSelectedNodes
  }

  // If there's an error, display the error component
  if (activeData.error) {
    return <TalentTreeError error={activeData.error} locale={locale} />
  }

  // Mark extra nodes as selected for highlighting
  const extraClassNodes = markExtraNodes(activeData.classNodes, activeData.selectedClassNodes)
  const extraSpecNodes = markExtraNodes(activeData.specNodes, activeData.selectedSpecNodes)
  const extraHeroNodes = markExtraNodes(activeData.heroNodes, activeData.selectedHeroNodes)

  // Build compact tree models; TalentTreeClient draws them once the dropdown opens
  const classTree = buildClassTree({
    nodes: activeData.classNodes,
    selectedNodes: extraClassNodes,
    activeSelectedNodes: activeData.selectedClassNodes,
    nodeChoices: activeData.nodeChoices,
    nodeRanks: activeData.nodeRanks,
    viewOnly,
    nodeColors,
    locale,
  })

  const specTree = buildSpecTree({
    nodes: activeData.specNodes,
    selectedNodes: extraSpecNodes,
    activeSelectedNodes: activeData.selectedSpecNodes,
    nodeChoices: activeData.nodeChoices,
    nodeRanks: activeData.nodeRanks,
    viewOnly,
    nodeColors,
    locale,
  })

  const heroTree = buildHeroTree({
    nodes: activeData.heroNodes,
    selectedNodes: extraHeroNodes,
    activeSelectedNodes: activeData.selectedHeroNodes,
    nodeChoices: activeData.nodeChoices,
    nodeRanks: activeData.nodeRanks,
    viewOnly,
    nodeColors,
    locale,
  })

  // Client components get the locale only on Korean pages, so the serialized props
  // of English pages stay exactly as they were.
  const localeProp = locale === 'ko' ? { locale } : {}

  return (
    <TalentsDropdown name={name} defaultTree={defaultTree} open={open} {...localeProp}>
      <div className="flex flex-col gap-4">
        <TalentTreeClient
          comment={comment}
          classTree={classTree}
          specTree={specTree}
          heroTree={heroTree}
          talentString={talents}
          viewOnly={viewOnly}
          defaultTree={defaultTree}
          hideCopy={hideCopy}
          forceTree={forceTree}
          {...localeProp}
        >
          {children}
        </TalentTreeClient>
      </div>
    </TalentsDropdown>
  )
}
