import {
  getTalentDataForSpec,
  base64ToBinaryString,
  TalentNode,
  SubTreeEntry,
} from './TalentTreeUtils'

import { ClassTreeLayout, SpecTreeLayout, HeroTreeLayout } from './TalentTreeLayout'
import TalentsDropdown from './TalentsDropdown'
import TalentTreeClient from './TalentTreeClient'

// Add type definition at the top
interface ColorConfig {
  color: string
  nodes: string[]
}

// Loading component for the talent tree
function TalentTreeLoading() {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="mb-4 h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
      <p className="text-gray-600">Loading talent tree...</p>
    </div>
  )
}

// Error component for the talent tree
function TalentTreeError({ error }: { error: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg bg-red-50 p-8">
      <div className="mb-4 text-5xl text-red-500">⚠️</div>
      <h3 className="mb-2 text-xl font-semibold text-red-700">Error Loading Talent Tree</h3>
      <p className="text-center text-gray-700">{error}</p>
    </div>
  )
}

// Function to determine if a hero node belongs to the active hero tree
function determineHeroNodeSubTree(nodeId: number, allHeroNodes: TalentNode[]) {
  const node = allHeroNodes.find((n) => n.id === nodeId)
  return node?.subTreeId || 0
}

// Function to check if a node can be selected based on its requirements
function canSelectNode(
  nodeId: number,
  nodeMap: Map<number, TalentNode>,
  selectedNodes: number[],
  nodeChoices: Record<number, number>
): boolean {
  const node = nodeMap.get(nodeId)
  if (!node) return false

  // If the node has no requirements, it can be selected
  if (!node.requirements || node.requirements.length === 0) return true

  // Check if all requirements are met
  return node.requirements.every((req) => {
    // If the requirement is a node ID, check if it's selected
    if (typeof req === 'number') {
      return selectedNodes.includes(req)
    }

    // If the requirement is an object with a node ID and choice, check if the node is selected with the correct choice
    if (req && typeof req === 'object' && 'nodeId' in req) {
      const reqNodeId = (req as { nodeId: number }).nodeId
      const reqChoice = (req as { choice: number }).choice

      // If the node is not selected, the requirement is not met
      if (!selectedNodes.includes(reqNodeId)) return false

      // If the node is selected but doesn't have a choice, the requirement is not met
      if (!(reqNodeId in nodeChoices)) return false

      // If the node is selected with a different choice than required, the requirement is not met
      return nodeChoices[reqNodeId] === reqChoice
    }

    // If we can't determine the requirement, assume it's not met
    return false
  })
}

// Function to toggle a node selection
function toggleNodeSelection(
  nodeId: number,
  nodeMap: Map<number, TalentNode>,
  selectedNodes: number[],
  nodeChoices: Record<number, number>,
  nodeRanks: Record<number, number>
): {
  selectedNodes: number[]
  nodeChoices: Record<number, number>
  nodeRanks: Record<number, number>
} {
  const node = nodeMap.get(nodeId)
  if (!node) {
    return { selectedNodes, nodeChoices, nodeRanks }
  }

  // Create copies of the arrays and objects to avoid mutating the originals
  const newSelectedNodes = [...selectedNodes]
  const newNodeChoices = { ...nodeChoices }
  const newNodeRanks = { ...nodeRanks }

  // Check if the node is already selected
  const isSelected = selectedNodes.includes(nodeId)

  if (isSelected) {
    // If the node is already selected, remove it
    const index = newSelectedNodes.indexOf(nodeId)
    if (index !== -1) {
      newSelectedNodes.splice(index, 1)
    }

    // Remove the node's choice and rank
    delete newNodeChoices[nodeId]
    delete newNodeRanks[nodeId]
  } else {
    // If the node is not selected, check if it can be selected
    if (canSelectNode(nodeId, nodeMap, selectedNodes, nodeChoices)) {
      // Add the node to the selected nodes
      newSelectedNodes.push(nodeId)

      // If the node has choices, set the default choice (0)
      if (node.choices && node.choices.length > 0) {
        newNodeChoices[nodeId] = 0
      }

      // Set the initial rank to 1
      newNodeRanks[nodeId] = 1
    }
  }

  return {
    selectedNodes: newSelectedNodes,
    nodeChoices: newNodeChoices,
    nodeRanks: newNodeRanks,
  }
}

// Function to update a node's rank
function updateNodeRank(
  nodeId: number,
  rank: number,
  nodeMap: Map<number, TalentNode>,
  nodeRanks: Record<number, number>
): Record<number, number> {
  const node = nodeMap.get(nodeId)
  if (!node) {
    return nodeRanks
  }

  // Create a copy of the nodeRanks object to avoid mutating the original
  const newNodeRanks = { ...nodeRanks }

  // If the node has a maxRanks property, ensure the rank doesn't exceed it
  const maxRank = node.maxRanks || 1
  const newRank = Math.min(Math.max(1, rank), maxRank)

  // Update the node's rank
  newNodeRanks[nodeId] = newRank

  return newNodeRanks
}

// Function to update a node's choice
function updateNodeChoice(
  nodeId: number,
  choice: number,
  nodeMap: Map<number, TalentNode>,
  nodeChoices: Record<number, number>
): Record<number, number> {
  const node = nodeMap.get(nodeId)
  if (!node) {
    return nodeChoices
  }

  // Create a copy of the nodeChoices object to avoid mutating the original
  const newNodeChoices = { ...nodeChoices }

  // If the node has choices, ensure the choice is valid
  if (node.choices && node.choices.length > 0) {
    const maxChoice = node.choices.length - 1
    const newChoice = Math.min(Math.max(0, choice), maxChoice)

    // Update the node's choice
    newNodeChoices[nodeId] = newChoice
  }

  return newNodeChoices
}

// Function to parse talent string and update node data
function parseTalentString(talentString: string) {
  try {
    // If no talent string is provided, return empty data
    if (!talentString || talentString.length === 0) {
      return {
        classNodes: [],
        specNodes: [],
        heroNodes: [],
        selectedClassNodes: [],
        selectedSpecNodes: [],
        selectedHeroNodes: [],
        nodeChoices: {},
        nodeRanks: {},
        error: 'No talent string provided',
      }
    }

    // Convert from base64 to binary string and extract specID
    const binaryString = base64ToBinaryString(talentString)

    // Extract the specID from the binary string (at bits 8-24)
    const specId = parseInt(binaryString.substring(8, 24), 2)

    // Get the talent data for the spec
    const druidData = getTalentDataForSpec(specId)

    if (!druidData) {
      console.error(`Could not find Druid data for specID ${specId}`)
      return {
        classNodes: [],
        specNodes: [],
        heroNodes: [],
        selectedClassNodes: [],
        selectedSpecNodes: [],
        selectedHeroNodes: [],
        nodeChoices: {},
        nodeRanks: {},
        error: `Could not find talent data for spec ID ${specId}`,
      }
    }

    // Skip header (152 bits: 8 bits version + 16 bits specID + 128 bits treeHash)
    const headerLength = 152

    // Take everything after the header
    const nodeSelectionBits = binaryString.substring(headerLength)

    // Create a map of all nodes by ID for quick lookup
    const nodeMap = new Map<number, TalentNode>()

    // Collect class nodes
    if (druidData.classNodes && Array.isArray(druidData.classNodes)) {
      druidData.classNodes.forEach((node) => {
        if (!nodeMap.has(node.id)) {
          nodeMap.set(node.id, node)
        }
      })
    }

    // Collect spec nodes
    if (druidData.specNodes && Array.isArray(druidData.specNodes)) {
      druidData.specNodes.forEach((node) => {
        if (!nodeMap.has(node.id)) {
          nodeMap.set(node.id, node)
        }
      })
    }

    // Collect hero nodes if they exist
    if (druidData.heroNodes && Array.isArray(druidData.heroNodes)) {
      druidData.heroNodes.forEach((node) => {
        if (!nodeMap.has(node.id)) {
          nodeMap.set(node.id, node)
        }
      })
    }

    // Track subTree information
    let subTreeNodeId: number | undefined
    let subTrees: number[] = []
    let selectedHeroSubTreeId: number | undefined

    if (druidData && druidData.subTreeNodes) {
      subTreeNodeId = druidData.subTreeNodes[0].id
      subTrees = druidData.subTreeNodes[0].entries.map(
        (entry) => (entry as unknown as SubTreeEntry['entries'][0]).traitSubTreeId || 0
      )
    }
    if (druidData.subTreeNodes && Array.isArray(druidData.subTreeNodes)) {
      druidData.subTreeNodes.forEach((node) => {
        if (!nodeMap.has(node.id)) {
          // Cast the node to TalentNode type
          nodeMap.set(node.id, node as unknown as TalentNode)
        }
      })
    }

    // New arrays to store selected nodes
    const selectedClassNodes: number[] = []
    const selectedSpecNodes: number[] = []
    const selectedHeroNodes: number[] = []

    // New map to store choice selections
    const nodeChoices: Record<number, number> = {}

    // New map to store node ranks
    const nodeRanks: Record<number, number> = {}

    // Map to track which hero subTreeIds have selected nodes
    const selectedHeroSubTreeIds = new Set<number>()

    // Check if fullNodeOrder exists and is valid
    if (
      !druidData.fullNodeOrder ||
      !Array.isArray(druidData.fullNodeOrder) ||
      druidData.fullNodeOrder.length === 0
    ) {
      console.error('fullNodeOrder is missing or invalid in the talent data')
      return {
        classNodes: druidData.classNodes || [],
        specNodes: druidData.specNodes || [],
        heroNodes: druidData.heroNodes || [],
        selectedClassNodes: [],
        selectedSpecNodes: [],
        selectedHeroNodes: [],
        nodeChoices: {},
        nodeRanks: {},
        error: 'Invalid talent data: missing or invalid node order',
      }
    }

    // Process each node in the order specified by fullNodeOrder
    let currentPosition = 0
    let totalSelected = 0

    for (let i = 0; i < druidData.fullNodeOrder.length; i++) {
      const nodeId = druidData.fullNodeOrder[i]
      const node = nodeMap.get(nodeId)

      // Skip if node not found in the map
      if (!node) {
        // Still need to process the bit for this node even if we don't have the node data
        if (currentPosition < nodeSelectionBits.length) {
          const isSelectedBit = nodeSelectionBits.charAt(currentPosition)
          const isNodeSelected = isSelectedBit === '1'
          currentPosition++

          if (isNodeSelected) {
            // Skip additional bits for selected nodes
            // Is Node Purchased (1 bit)
            if (currentPosition < nodeSelectionBits.length) {
              const isPurchasedBit = nodeSelectionBits.charAt(currentPosition)
              const isNodePurchased = isPurchasedBit === '1'
              currentPosition++

              if (isNodePurchased) {
                // Is Partially Ranked (1 bit)
                if (currentPosition < nodeSelectionBits.length) {
                  const isPartiallyRankedBit = nodeSelectionBits.charAt(currentPosition)
                  const isPartiallyRanked = isPartiallyRankedBit === '1'
                  currentPosition++

                  if (isPartiallyRanked && currentPosition + 6 <= nodeSelectionBits.length) {
                    // Ranks Purchased (6 bits)
                    currentPosition += 6
                  }
                }

                // Is Choice Node (1 bit)
                if (currentPosition < nodeSelectionBits.length) {
                  const isChoiceNodeBit = nodeSelectionBits.charAt(currentPosition)
                  const isChoiceNode = isChoiceNodeBit === '1'
                  currentPosition++

                  if (isChoiceNode && currentPosition + 2 <= nodeSelectionBits.length) {
                    // Choice Entry Index (2 bits)
                    currentPosition += 2
                  }
                }
              }
            }
          }
        }

        continue
      }

      // Check if we have enough bits left
      if (currentPosition >= nodeSelectionBits.length) {
        break
      }

      // Is Node Selected (1 bit)
      const isSelectedBit = nodeSelectionBits.charAt(currentPosition)
      const isNodeSelected = isSelectedBit === '1'
      currentPosition++

      // isTargetNode is our choice node for the Hero Talents
      const isTargetNode = nodeId === subTreeNodeId

      if (isNodeSelected) {
        totalSelected++

        // Determine if it's a class, spec or hero node
        const isClassNode = druidData.classNodes.some((classNode) => classNode.id === nodeId)
        const isHeroNode = druidData.heroNodes?.some((heroNode) => heroNode.id === nodeId) || false
        const isSpecNode = druidData.specNodes.some((specNode) => specNode.id === nodeId)

        if (isClassNode) {
          selectedClassNodes.push(nodeId)
          // Set initial rank to 1
          nodeRanks[nodeId] = 1
        } else if (isHeroNode) {
          // Track which hero subTree this node belongs to
          const heroSubTreeId = determineHeroNodeSubTree(nodeId, druidData.heroNodes || [])
          if (heroSubTreeId) {
            selectedHeroSubTreeIds.add(heroSubTreeId)
          }

          selectedHeroNodes.push(nodeId)
          // Set initial rank to 1
          nodeRanks[nodeId] = 1
        } else if (isSpecNode) {
          selectedSpecNodes.push(nodeId)
          // Set initial rank to 1
          nodeRanks[nodeId] = 1
        }

        // Is Node Purchased (1 bit)
        const isPurchasedBit = nodeSelectionBits.charAt(currentPosition)
        const isNodePurchased = isPurchasedBit === '1'
        currentPosition++

        if (isNodePurchased) {
          // Is Partially Ranked (1 bit)
          const isPartiallyRankedBit = nodeSelectionBits.charAt(currentPosition)
          const isPartiallyRanked = isPartiallyRankedBit === '1'
          currentPosition++

          if (isPartiallyRanked && currentPosition + 6 <= nodeSelectionBits.length) {
            // Ranks Purchased (6 bits)
            const ranksPurchasedBits = nodeSelectionBits.substring(
              currentPosition,
              currentPosition + 6
            )
            // Reverse the bits before parsing
            const reversedBits = ranksPurchasedBits.split('').reverse().join('')
            const ranksPurchased = parseInt(reversedBits, 2)
            currentPosition += 6

            // Update the node rank based on the ranks purchased
            nodeRanks[nodeId] = ranksPurchased
          } else {
            // If not partially ranked, set to max ranks if available
            const node = nodeMap.get(nodeId)
            if (node && node.maxRanks && node.maxRanks > 1) {
              nodeRanks[nodeId] = node.maxRanks
            }
          }

          // Is Choice Node (1 bit)
          const isChoiceNodeBit = nodeSelectionBits.charAt(currentPosition)
          const isChoiceNode = isChoiceNodeBit === '1'
          currentPosition++

          if (isChoiceNode && currentPosition + 2 <= nodeSelectionBits.length) {
            // Choice Entry Index (2 bits)
            const choiceEntryIndexBits = nodeSelectionBits.substring(
              currentPosition,
              currentPosition + 2
            )
            const choiceEntryIndex = parseInt(choiceEntryIndexBits.split('').reverse().join(''), 2)
            currentPosition += 2

            if (isTargetNode) {
              selectedHeroSubTreeId = subTrees[choiceEntryIndex]
            }

            // Update the node choice
            nodeChoices[nodeId] = choiceEntryIndex
          }
        }
      }
    }

    // Clean up hero nodes - only include nodes from the chosen hero subTree
    if (selectedHeroSubTreeIds.size > 0 && druidData.heroNodes) {
      // Filter the hero nodes to keep only those from selected subTreeIds
      const filteredHeroNodes = selectedHeroNodes.filter((nodeId) => {
        const node = druidData.heroNodes?.find((n) => n.id === nodeId)
        if (
          node?.subTreeId &&
          (!selectedHeroSubTreeIds.has(node.subTreeId) || node.subTreeId !== selectedHeroSubTreeId)
        ) {
          return false
        }
        return true
      })

      if (filteredHeroNodes.length !== selectedHeroNodes.length) {
        selectedHeroNodes.length = 0 // Clear the array
        selectedHeroNodes.push(...filteredHeroNodes) // Add back only the filtered nodes
      }
    }

    // Return the parsed data
    return {
      classNodes: druidData.classNodes || [],
      specNodes: druidData.specNodes || [],
      heroNodes: druidData.heroNodes || [],
      selectedClassNodes,
      selectedSpecNodes,
      selectedHeroNodes,
      nodeChoices,
      nodeRanks,
      error: null,
      specId,
    }
  } catch (error) {
    console.error('Failed to parse talent string:', error)
    return {
      classNodes: [],
      specNodes: [],
      heroNodes: [],
      selectedClassNodes: [],
      selectedSpecNodes: [],
      selectedHeroNodes: [],
      nodeChoices: {},
      nodeRanks: {},
      error: error instanceof Error ? error.message : 'Unknown error parsing talent string',
      specId: 102, // Default to Balance Druid
    }
  }
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
    return <TalentTreeError error={activeData.error} />
  }

  // Mark extra nodes as selected for highlighting
  const extraClassNodes = markExtraNodes(activeData.classNodes, activeData.selectedClassNodes)
  const extraSpecNodes = markExtraNodes(activeData.specNodes, activeData.selectedSpecNodes)
  const extraHeroNodes = markExtraNodes(activeData.heroNodes, activeData.selectedHeroNodes)

  // Generate the HTML structure for the three trees
  const classTree = (
    <ClassTreeLayout
      nodes={activeData.classNodes}
      selectedNodes={extraClassNodes}
      activeSelectedNodes={activeData.selectedClassNodes}
      nodeChoices={activeData.nodeChoices}
      nodeRanks={activeData.nodeRanks}
      viewOnly={viewOnly}
      nodeColors={nodeColors}
    />
  )

  const specTree = (
    <SpecTreeLayout
      nodes={activeData.specNodes}
      selectedNodes={extraSpecNodes}
      activeSelectedNodes={activeData.selectedSpecNodes}
      nodeChoices={activeData.nodeChoices}
      nodeRanks={activeData.nodeRanks}
      viewOnly={viewOnly}
      nodeColors={nodeColors}
    />
  )

  const heroTree = (
    <HeroTreeLayout
      nodes={activeData.heroNodes}
      selectedNodes={extraHeroNodes}
      activeSelectedNodes={activeData.selectedHeroNodes}
      nodeChoices={activeData.nodeChoices}
      nodeRanks={activeData.nodeRanks}
      viewOnly={viewOnly}
      nodeColors={nodeColors}
    />
  )

  return (
    <TalentsDropdown name={name} defaultTree={defaultTree} open={open}>
      <div className="flex flex-col gap-4">
        <TalentTreeClient
          comment={comment}
          classTree={classTree}
          specTree={specTree}
          heroTree={heroTree}
          talentString={talents}
          viewOnly={viewOnly}
          defaultTree={defaultTree}
        >
          {children}
        </TalentTreeClient>
      </div>
    </TalentsDropdown>
  )
}
