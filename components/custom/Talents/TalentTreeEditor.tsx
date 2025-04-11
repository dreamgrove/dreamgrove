'use client'
import { useState, useCallback } from 'react'
import { getTalentDataForSpec, TalentNode } from './TalentTreeUtils'
import { ClassTreeLayout, SpecTreeLayout, HeroTreeLayout } from './TalentTreeLayout'
import TalentsDropdown from './TalentsDropdown'
import TalentTreeClient from './TalentTreeClient'
import Talents from './Talents'

interface ColorConfig {
  color: string
  nodes: string[]
}

interface TalentTreeEditorProps {
  specId?: number
  name?: string
  comment?: string
  children?: React.ReactNode
}

export default function TalentTreeEditor({
  specId = 102, // Default to Balance Druid
  name = '',
  comment = '',
  children,
}: TalentTreeEditorProps) {
  // Get the initial talent data
  const druidData = getTalentDataForSpec(specId)

  // State for selected nodes and colors
  const [selectedNodes, setSelectedNodes] = useState<number[]>([])
  const [nodeColors, setNodeColors] = useState<Record<string, string>>({})
  const [nodeChoices] = useState<Record<number, number>>({})
  const [nodeRanks] = useState<Record<number, number>>({})
  const [selectedSubTreeIndex, setSelectedSubTreeIndex] = useState(0)

  // Get the available subtrees
  const subTrees = druidData?.subTreeNodes?.[0]?.entries || []

  // Function to handle node click
  const handleNodeClick = useCallback((nodeId: number, nodeName: string) => {
    setSelectedNodes((prev) => {
      if (prev.includes(nodeId)) {
        // Remove node from selection
        const newSelected = prev.filter((id) => id !== nodeId)
        return newSelected
      } else {
        // Add node to selection
        return [...prev, nodeId]
      }
    })
  }, [])

  // Function to handle right click (color change)
  const handleNodeRightClick = useCallback(
    (e: React.MouseEvent, nodeId: number, nodeName: string) => {
      e.preventDefault() // Prevent default context menu

      // Create color input element
      const input = document.createElement('input')
      input.type = 'color'
      input.value = nodeColors[nodeName.toLowerCase()] || '#ffffff'

      // Handle color selection
      input.addEventListener('change', (e) => {
        const color = (e.target as HTMLInputElement).value
        setNodeColors((prev) => ({
          ...prev,
          [nodeName.toLowerCase()]: color,
        }))
      })

      input.click()
    },
    [nodeColors]
  )

  // Function to copy tree configuration
  const copyTreeConfig = useCallback(() => {
    if (!druidData) return

    // Convert nodeColors to ColorConfig array
    const colors: ColorConfig[] = Object.entries(nodeColors).map(([nodeName, color]) => ({
      color,
      nodes: [nodeName],
    }))

    // Get selected node names
    const selectedNodeNames = selectedNodes
      .map((nodeId) => {
        const classNode = druidData.classNodes.find((n) => n.id === nodeId)
        const specNode = druidData.specNodes.find((n) => n.id === nodeId)
        const heroNode = druidData.heroNodes?.find((n) => n.id === nodeId)
        return (classNode || specNode || heroNode)?.name
      })
      .filter((name): name is string => !!name)

    // Create the JSX string
    const jsxString = `<Talents 
  name="${name}"
  colors={${JSON.stringify(colors, null, 2)}}
  extra={${JSON.stringify(selectedNodeNames, null, 2)}}
/>`

    // Copy to clipboard
    navigator.clipboard.writeText(jsxString)
  }, [name, nodeColors, selectedNodes, druidData])

  // Function to switch subtree
  const handleSwitchSubTree = useCallback(() => {
    setSelectedSubTreeIndex((prev) => (prev + 1) % subTrees.length)
  }, [subTrees.length])

  if (!druidData) {
    return <div>No talent data available</div>
  }

  // Filter hero nodes based on selected subtree
  const filteredHeroNodes =
    druidData.heroNodes?.filter((node) => {
      const subTreeId = subTrees[selectedSubTreeIndex]?.traitSubTreeId
      return node.subTreeId === subTreeId
    }) || []

  // Generate the HTML structure for the three trees
  const classTree = (
    <ClassTreeLayout
      nodes={druidData.classNodes}
      selectedNodes={selectedNodes}
      nodeChoices={nodeChoices}
      nodeRanks={nodeRanks}
      viewOnly={false}
      nodeColors={nodeColors}
      onNodeClick={handleNodeClick}
      onNodeRightClick={handleNodeRightClick}
      isEditing={true}
    />
  )

  const specTree = (
    <SpecTreeLayout
      nodes={druidData.specNodes}
      selectedNodes={selectedNodes}
      nodeChoices={nodeChoices}
      nodeRanks={nodeRanks}
      viewOnly={false}
      nodeColors={nodeColors}
      onNodeClick={handleNodeClick}
      onNodeRightClick={handleNodeRightClick}
      isEditing={true}
    />
  )

  const heroTree = (
    <HeroTreeLayout
      nodes={filteredHeroNodes}
      selectedNodes={selectedNodes}
      nodeChoices={nodeChoices}
      nodeRanks={nodeRanks}
      viewOnly={false}
      nodeColors={nodeColors}
      onNodeClick={handleNodeClick}
      onNodeRightClick={handleNodeRightClick}
      isEditing={true}
    />
  )

  return (
    <TalentsDropdown name={name}>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <button
            onClick={handleSwitchSubTree}
            className="rounded bg-yellow-600 px-4 py-2 text-white hover:bg-yellow-700"
          >
            Switch to {subTrees[(selectedSubTreeIndex + 1) % subTrees.length]?.name || 'next'} Tree
          </button>
          <button
            onClick={copyTreeConfig}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Copy Configuration
          </button>
        </div>
        <TalentTreeClient
          comment={comment}
          classTree={classTree}
          specTree={specTree}
          heroTree={heroTree}
          talentString=""
          viewOnly={false}
          onNodeClick={handleNodeClick}
          onNodeRightClick={handleNodeRightClick}
        >
          {children}
        </TalentTreeClient>
      </div>
    </TalentsDropdown>
  )
}
