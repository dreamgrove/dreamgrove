'use client'
import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import talentData from '../../other/talents.json'

interface TalentNode {
  id: number
  name: string
  type: string
  posX: number
  posY: number
  next: number[]
  entries: {
    icon: string
    name: string
    spellId?: number
    type?: string
  }[]
  subTreeId?: number
  maxRanks?: number
}

interface SubTreeEntry {
  id: number
  name: string
  type: string
  posX: number
  posY: number
  entries: {
    id: number
    name: string
    type: string
    traitSubTreeId: number
    traitTreeId: number
    atlasMemberName: string
    nodes?: number[]
  }[]
  entryNode?: boolean
  next?: number[]
  prev?: number[]
}

interface TalentData {
  className: string
  specName: string
  classNodes: TalentNode[]
  specNodes: TalentNode[]
  heroNodes?: TalentNode[]
  subTreeNodes?: {
    id: number
    name: string
    type: string
    posX: number
    posY: number
    entries: {
      id: number
      name: string
      type: string
      nodes?: number[]
    }[]
  }[]
  fullNodeOrder?: number[]
}

interface NotificationState {
  visible: boolean
  message: string
  type: 'success' | 'error'
}

// Bit stream utility for decoding talent strings
class BitStream {
  private binaryString: string
  private position: number = 0

  constructor(base64String: string) {
    // Convert base64 to binary
    this.binaryString = this.base64ToBinary(base64String)
    this.position = 0
  }

  base64ToBinary(base64String: string): string {
    // WoW uses a modified Base64 alphabet
    // Standard: ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/
    // WoW:      ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-
    const wowBase64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-'

    let binaryResult = ''

    for (let i = 0; i < base64String.length; i++) {
      const char = base64String[i]
      const charIndex = wowBase64Chars.indexOf(char)

      if (charIndex === -1) {
        continue // Skip invalid characters
      }

      // Convert to 6-bit binary representation
      let binary = charIndex.toString(2)
      // Pad to 6 bits
      while (binary.length < 6) {
        binary = '0' + binary
      }

      binaryResult += binary
    }

    return binaryResult
  }

  extractBits(numBits: number): number {
    if (this.position + numBits > this.binaryString.length) {
      return 0
    }

    const bitsToExtract = this.binaryString.substring(this.position, this.position + numBits)
    this.position += numBits

    // Convert binary string to integer
    return parseInt(bitsToExtract, 2)
  }

  getBinaryString(): string {
    return this.binaryString
  }
}

// Add a BitStreamEncoder class for encoding talent strings
class BitStreamEncoder {
  private binaryData: string = ''

  constructor() {
    this.binaryData = ''
  }

  addBits(value: number, numBits: number): void {
    // Convert value to binary and pad with leading zeros
    const binaryValue = value.toString(2).padStart(numBits, '0')
    // Take only the rightmost numBits
    const truncatedValue = binaryValue.slice(-numBits)
    this.binaryData += truncatedValue
  }

  toBinaryString(): string {
    return this.binaryData
  }

  toBase64(): string {
    // WoW uses a modified Base64 alphabet
    // Standard: ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/
    // WoW:      ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-
    const wowBase64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-'
    let base64 = ''

    // Pad binary data to multiple of 6 (base64 uses 6 bits per character)
    let paddedBinary = this.binaryData
    while (paddedBinary.length % 6 !== 0) {
      paddedBinary += '0'
    }

    // Convert 6 bits at a time to base64 characters
    for (let i = 0; i < paddedBinary.length; i += 6) {
      const sixBits = paddedBinary.substring(i, i + 6)
      const index = parseInt(sixBits, 2)
      base64 += wowBase64Chars.charAt(index)
    }

    return base64
  }
}

// Add a new interface for the grid-based layout
interface GridCell {
  node: TalentNode | null
  row: number
  col: number
}

// Add a function to build a grid from talent nodes
const buildTalentGrid = (nodes: TalentNode[]) => {
  if (nodes.length === 0) return []

  // Get all unique X and Y positions
  const uniqueXPositions = Array.from(new Set(nodes.map((node) => node.posX))).sort((a, b) => a - b)
  const uniqueYPositions = Array.from(new Set(nodes.map((node) => node.posY))).sort((a, b) => a - b)

  // Create a mapping of actual positions to grid indices
  const xToCol = new Map<number, number>()
  const yToRow = new Map<number, number>()

  uniqueXPositions.forEach((x, index) => {
    xToCol.set(x, index)
  })

  uniqueYPositions.forEach((y, index) => {
    yToRow.set(y, index)
  })

  // Create an empty grid
  const rows = uniqueYPositions.length
  const cols = uniqueXPositions.length
  const grid: GridCell[][] = Array(rows)
    .fill(null)
    .map((_, rowIndex) =>
      Array(cols)
        .fill(null)
        .map((_, colIndex) => ({
          node: null,
          row: rowIndex,
          col: colIndex,
        }))
    )

  // Place nodes in the grid
  nodes.forEach((node) => {
    const row = yToRow.get(node.posY)
    const col = xToCol.get(node.posX)

    if (row !== undefined && col !== undefined) {
      grid[row][col].node = node
    }
  })

  return grid
}

// Modify the renderTalentTree function to disable clicks in viewOnly mode
const renderTalentTree = (
  nodes: TalentNode[],
  isSelected: (id: number) => boolean,
  toggleSelection: (id: number) => void,
  treeType: 'class' | 'spec' | 'hero' = 'class',
  nodeChoices: Map<number, number>,
  nodeRanks: Map<number, number>,
  disableInteraction: boolean = false
) => {
  // Build the grid
  const grid = buildTalentGrid(nodes)

  if (grid.length === 0) {
    return <div className="text-white">No nodes available for this tree.</div>
  }

  // Create a node ID to grid cell mapping for quick lookup
  const nodeIdToCell = new Map<number, GridCell>()
  grid.forEach((row) => {
    row.forEach((cell) => {
      if (cell.node) {
        nodeIdToCell.set(cell.node.id, cell)
      }
    })
  })

  // Function to determine if a connection is active based on tree type
  const isConnectionActive = (fromNodeId: number, toNodeId: number) => {
    return isSelected(fromNodeId) && isSelected(toNodeId)
  }

  // Generate connection lines
  const connectionLines = nodes.flatMap((node) => {
    if (!node.next || node.next.length === 0) return []

    const fromCell = nodeIdToCell.get(node.id)
    if (!fromCell) return []

    return node.next
      .map((nextNodeId) => {
        const toCell = nodeIdToCell.get(nextNodeId)
        if (!toCell) return null

        // Determine if the connection is active
        const isActive = isConnectionActive(node.id, nextNodeId)

        // For the spec and hero trees, we need to use a different approach
        // We'll draw lines directly between grid cells rather than using percentage-based positioning
        if (treeType === 'spec' || treeType === 'hero') {
          // Calculate the grid-based positions
          const startRow = fromCell.row
          const startCol = fromCell.col
          const endRow = toCell.row
          const endCol = toCell.col

          // Create a unique key for this connection
          const lineKey = `line-${node.id}-${nextNodeId}`

          return (
            <svg
              key={lineKey}
              className="absolute inset-0 h-full w-full"
              style={{ zIndex: 1, pointerEvents: 'none' }}
            >
              <line
                x1={`${((startCol + 0.5) / grid[0].length) * 100}%`}
                y1={`${((startRow + 0.5) / grid.length) * 100}%`}
                x2={`${((endCol + 0.5) / grid[0].length) * 100}%`}
                y2={`${((endRow + 0.5) / grid.length) * 100}%`}
                stroke={isActive ? '#00ff00' : '#ffd700'}
                strokeWidth={isActive ? 2 : 1}
                opacity={isActive ? 0.9 : 0.2}
                style={{
                  transition: 'opacity 0.2s, stroke-width 0.2s',
                  filter: isActive ? 'drop-shadow(0 0 3px rgba(0, 255, 0, 0.5))' : 'none',
                }}
              />
            </svg>
          )
        } else {
          // For the class tree, use the original approach which works well
          // Calculate the center positions as percentages
          const fromX = ((fromCell.col + 0.5) / grid[0].length) * 100
          const fromY = ((fromCell.row + 0.5) / grid.length) * 100
          const toX = ((toCell.col + 0.5) / grid[0].length) * 100
          const toY = ((toCell.row + 0.5) / grid.length) * 100

          // Calculate the angle based on the cell differences
          const cellDx = toCell.col - fromCell.col
          const cellDy = toCell.row - fromCell.row
          const angle = (Math.atan2(cellDy, cellDx) * 180) / Math.PI

          // Calculate the length based on the percentage positions
          const dx = toX - fromX
          const dy = toY - fromY
          const length = Math.sqrt(dx * dx + dy * dy)

          return (
            <div
              key={`line-${node.id}-${nextNodeId}`}
              style={{
                position: 'absolute',
                left: `${fromX}%`,
                top: `${fromY}%`,
                width: `${length}%`,
                height: isActive ? '2px' : '1px',
                backgroundColor: isActive ? '#00ff00' : '#ffd700',
                opacity: isActive ? 0.9 : 0.2,
                transformOrigin: '0 50%',
                transform: `rotate(${angle}deg)`,
                zIndex: 1,
                boxShadow: isActive ? '0 0 3px rgba(0, 255, 0, 0.5)' : 'none',
                transition: 'opacity 0.2s, height 0.2s, box-shadow 0.2s',
              }}
            />
          )
        }
      })
      .filter(Boolean)
  })

  // Calculate the aspect ratio of the grid
  const gridRatio = grid[0].length / grid.length

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden">
      {/* Use a responsive container that fills available space */}
      <div className="relative flex h-full w-full items-center justify-center">
        {/* Container that maintains the grid's aspect ratio */}
        <div
          className="relative"
          style={{
            maxWidth: `${grid[0].length * 70}px`, // Max width based on number of columns * 70px
            maxHeight: `${grid.length * 70}px`, // Max height based on number of rows * 70px
          }}
        >
          {/* Connection lines container */}
          <div className="absolute inset-0">{connectionLines}</div>

          {/* Grid of nodes */}
          <div
            className="grid h-auto w-full"
            style={{
              aspectRatio: gridRatio,
              gridTemplateRows: `repeat(${grid.length}, minmax(0, 70px))`,
              gridTemplateColumns: `repeat(${grid[0].length}, minmax(0, 70px))`,
            }}
          >
            {grid.flat().map((cell, index) => {
              if (!cell.node) {
                // Empty cell
                return (
                  <div
                    key={`empty-${cell.row}-${cell.col}`}
                    className="w-max-[70px] h-max-[70px] relative flex aspect-1 w-full items-center justify-center"
                    style={{
                      gridRow: cell.row + 1,
                      gridColumn: cell.col + 1,
                    }}
                  />
                )
              }

              const node = cell.node
              const selected = isSelected(node.id)

              // Check if this is a choice node and which choice is selected
              const isChoiceNode = node.entries.length > 1
              const selectedChoiceIndex = nodeChoices.get(node.id) || 0

              // Get the icon and name based on the selected choice
              const icon =
                isChoiceNode && selected
                  ? node.entries[selectedChoiceIndex]?.icon || node.entries[0]?.icon
                  : node.entries[0]?.icon

              const displayName =
                isChoiceNode && selected
                  ? node.entries[selectedChoiceIndex]?.name || node.name
                  : node.name

              return (
                <div
                  key={`node-${node.id}`}
                  className="w-max-[70px] h-max-[70px] relative flex aspect-1 w-full items-center justify-center"
                  style={{
                    gridRow: cell.row + 1,
                    gridColumn: cell.col + 1,
                  }}
                >
                  <div
                    className={`absolute flex h-[70%] w-[70%] items-center justify-center rounded-full border-2 ${
                      selected ? 'border-green-500' : 'border-yellow-400'
                    } ${!disableInteraction ? 'cursor-pointer hover:scale-110 hover:border-white' : ''} transition-all duration-200`}
                    style={{
                      zIndex: 10, // Ensure nodes appear above connection lines
                    }}
                    onClick={disableInteraction ? undefined : () => toggleSelection(node.id)}
                    onKeyDown={
                      disableInteraction
                        ? undefined
                        : (e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              toggleSelection(node.id)
                              e.preventDefault()
                            }
                          }
                    }
                    role={disableInteraction ? undefined : 'button'}
                    tabIndex={disableInteraction ? undefined : 0}
                    title={displayName}
                    aria-pressed={disableInteraction ? undefined : selected}
                  >
                    {icon && (
                      <>
                        <a
                          href={`https://www.wowhead.com/spell=${node.entries[selectedChoiceIndex]?.spellId || node.entries[0]?.spellId || '0'}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => (disableInteraction ? undefined : e.stopPropagation())}
                          className="flex h-[90%] w-[90%] items-center justify-center"
                        >
                          <Image
                            src={`https://wow.zamimg.com/images/wow/icons/large/${icon}.jpg`}
                            alt={displayName}
                            width={56}
                            height={56}
                            className={`rounded-full ${
                              selected
                                ? 'brightness-125'
                                : 'opacity-70 brightness-50 grayscale-[50%]'
                            }`}
                            unoptimized={true}
                            priority={false}
                          />
                        </a>
                        {node.maxRanks && node.maxRanks > 1 && (
                          <div
                            className={`absolute bottom-0 right-0 rounded-full bg-black bg-opacity-70 px-1 text-xs font-bold ${selected ? 'text-white' : 'text-gray-400'}`}
                            style={{
                              zIndex: 11,
                              border: selected ? '1px solid #ffcc00' : '1px solid #666',
                              boxShadow: selected ? '0 0 3px rgba(255, 204, 0, 0.5)' : 'none',
                              fontSize: '0.65rem', // Smaller font size for the rank indicator
                            }}
                          >
                            {nodeRanks.has(node.id) ? nodeRanks.get(node.id) : 0}/{node.maxRanks}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// Update the ClassTree component with viewOnly support
const ClassTree = ({
  nodes,
  isNodeSelected,
  toggleNodeSelection,
  nodeChoices,
  nodeRanks,
  viewOnly = false,
}: {
  nodes: TalentNode[]
  isNodeSelected: (id: number) => boolean
  toggleNodeSelection: (id: number) => void
  nodeChoices: Map<number, number>
  nodeRanks: Map<number, number>
  viewOnly?: boolean
}) => {
  return (
    <div className="flex w-full flex-col">
      <h2 className="mb-2 mt-0 text-xl font-bold text-yellow-400">Class Tree</h2>
      <div className="flex-1 overflow-hidden">
        {renderTalentTree(
          nodes,
          isNodeSelected,
          toggleNodeSelection,
          'class',
          nodeChoices,
          nodeRanks,
          viewOnly
        )}
      </div>
    </div>
  )
}

// Update the SpecTree component with viewOnly support
const SpecTree = ({
  nodes,
  isNodeSelected,
  toggleNodeSelection,
  nodeChoices,
  nodeRanks,
  viewOnly = false,
}: {
  nodes: TalentNode[]
  isNodeSelected: (id: number) => boolean
  toggleNodeSelection: (id: number) => void
  nodeChoices: Map<number, number>
  nodeRanks: Map<number, number>
  viewOnly?: boolean
}) => {
  return (
    <div className="flex h-full w-full flex-col">
      <h2 className="mb-2 mt-0 text-xl font-bold text-yellow-400">Specialization Tree</h2>
      <div className="flex-1 overflow-hidden">
        {renderTalentTree(
          nodes,
          isNodeSelected,
          toggleNodeSelection,
          'spec',
          nodeChoices,
          nodeRanks,
          viewOnly
        )}
      </div>
    </div>
  )
}

// Update the HeroTree component with viewOnly support and better debugging
const HeroTree = ({
  nodes,
  isNodeSelected,
  toggleNodeSelection,
  selectedNodes,
  showAllHeroTalents,
  nodeChoices,
  nodeRanks,
  viewOnly = false,
  talentString = '',
}: {
  nodes: TalentNode[]
  isNodeSelected: (id: number) => boolean
  toggleNodeSelection: (id: number) => void
  selectedNodes: number[]
  showAllHeroTalents: () => void
  nodeChoices: Map<number, number>
  nodeRanks: Map<number, number>
  viewOnly?: boolean
  talentString?: string
}) => {
  // Group nodes by subTreeId
  const subTreeCounts = new Map<number, { total: number; selected: number }>()
  nodes.forEach((node) => {
    if (!node.subTreeId) return

    if (!subTreeCounts.has(node.subTreeId)) {
      subTreeCounts.set(node.subTreeId, { total: 0, selected: 0 })
    }

    const counts = subTreeCounts.get(node.subTreeId)!
    counts.total++
    if (isNodeSelected(node.id)) {
      counts.selected++
    }
  })

  // Filter nodes for display - keeping only subTrees where all nodes are selected
  const filteredNodes = nodes.filter((node) => {
    // Group hero nodes by their subTreeId
    const subTreeId = node.subTreeId
    if (!subTreeId) {
      return true // Keep nodes without subTreeId
    }

    // Check if ALL nodes in this subTree are selected
    const allNodesInSubTree = nodes.filter((n) => n.subTreeId === subTreeId)
    const allNodesSelected = allNodesInSubTree.every((n) => isNodeSelected(n.id))

    // Only include nodes from subTrees where all nodes are selected
    return allNodesSelected
  })

  return (
    <div className="flex h-full w-full flex-col">
      <h2 className="mb-2 mt-0 text-xl font-bold text-yellow-400">Hero Tree</h2>
      {nodes.length > 0 ? (
        selectedNodes.length > 0 ? (
          <div className="flex-1 overflow-hidden">
            {renderTalentTree(
              filteredNodes,
              isNodeSelected,
              toggleNodeSelection,
              'hero',
              nodeChoices,
              nodeRanks,
              viewOnly
            )}
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="rounded-lg bg-gray-800 p-6 text-center">
              <p className="text-lg text-white">No fully selected hero trees</p>
              <p className="mt-2 text-gray-400">
                All talents in a hero tree must be selected to display it
              </p>
              {!viewOnly && (
                <button
                  onClick={showAllHeroTalents}
                  className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Select All Hero Talents
                </button>
              )}
            </div>
          </div>
        )
      ) : (
        <div className="text-white">No hero nodes available for this class/spec.</div>
      )}
    </div>
  )
}

export default function TalentTree({
  viewOnly = false,
  talents = '',
}: {
  viewOnly?: boolean
  talents?: string
}) {
  const [classNodes, setClassNodes] = useState<TalentNode[]>([])
  const [specNodes, setSpecNodes] = useState<TalentNode[]>([])
  const [heroNodes, setHeroNodes] = useState<TalentNode[]>([])
  const [selectedClassNodes, setSelectedClassNodes] = useState<number[]>([])
  const [selectedSpecNodes, setSelectedSpecNodes] = useState<number[]>([])
  const [selectedHeroNodes, setSelectedHeroNodes] = useState<number[]>([])
  const [nodeChoices, setNodeChoices] = useState<Map<number, number>>(new Map())
  const [nodeRanks, setNodeRanks] = useState<Map<number, number>>(new Map())
  const [activeTree, setActiveTree] = useState<'class' | 'spec' | 'hero' | 'full'>('full')
  const [talentString, setTalentString] = useState<string>(talents || '')
  const [currentSpecId, setCurrentSpecId] = useState<number>(102) // Default to Balance Druid
  const [importCounter, setImportCounter] = useState<number>(0) // Counter to track imports
  const [notification, setNotification] = useState<NotificationState>({
    visible: false,
    message: '',
    type: 'success',
  })
  const [copyButtonState, setCopyButtonState] = useState<'ready' | 'copied'>('ready')

  // Sample talent string for testing
  const sampleTalentString =
    'CYGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALUmtMGzMwDYWGLzMDwMbjlZ2mxCzMzYWmxMjZM2wCDwAstNWw0MzyIAAAAbmZmZAbGYA'

  // Effect to import talent string if provided via props
  useEffect(() => {
    if (talents && talents.length > 0) {
      setTalentString(talents)
      importTalentString(talents)
    }
  }, [talents])

  useEffect(() => {
    // Find the Druid spec based on the specID (default to Balance - 102)
    const druidData = talentData.find(
      (spec) => spec.className === 'Druid' && spec.specId === currentSpecId
    ) as TalentData

    if (druidData) {
      // Get class nodes (shared across all specs)
      setClassNodes(druidData.classNodes)

      // Get spec nodes
      setSpecNodes(druidData.specNodes)

      // Get hero nodes if available
      if (druidData.heroNodes && druidData.heroNodes.length > 0) {
        setHeroNodes(druidData.heroNodes)
      } else {
        console.log('No hero nodes found in the data')
        setHeroNodes([])
      }

      // Only set initial selections if this is not an import (importCounter === 0) and no talents were provided
      if (importCounter === 0 && !talents) {
        // Set some initial selected nodes for testing
        setSelectedClassNodes([
          druidData.classNodes[0].id,
          druidData.classNodes[2].id,
          druidData.classNodes[5].id,
        ])

        // Select a few spec nodes for demonstration
        if (druidData.specNodes.length > 0) {
          setSelectedSpecNodes([
            druidData.specNodes[0].id,
            // Add more initial selections if available
            ...(druidData.specNodes.length > 5 ? [druidData.specNodes[5].id] : []),
            ...(druidData.specNodes.length > 10 ? [druidData.specNodes[10].id] : []),
          ])
        }

        // Select a few hero nodes for demonstration
        if (druidData.heroNodes && druidData.heroNodes.length > 0) {
          setSelectedHeroNodes([
            druidData.heroNodes[0].id,
            ...(druidData.heroNodes.length > 3 ? [druidData.heroNodes[3].id] : []),
          ])
        }
      } else {
        console.error('Could not find Druid data in talents.json')
      }
    }
  }, [currentSpecId, importCounter, talents])

  // Hide notification after 3 seconds
  useEffect(() => {
    if (notification.visible) {
      const timer = setTimeout(() => {
        setNotification((prev) => ({ ...prev, visible: false }))
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [notification.visible])

  const toggleClassNodeSelection = (nodeId: number) => {
    const node = classNodes.find((n) => n.id === nodeId)
    if (!node) return

    if (selectedClassNodes.includes(nodeId)) {
      // If the node is already selected, increment its rank up to maxRanks
      const maxRanks = node.maxRanks || 1
      if (maxRanks > 1) {
        setNodeRanks((prev) => {
          const currentRank = prev.get(nodeId) || 1
          const newRanks = new Map(prev)

          if (currentRank < maxRanks) {
            // Increment rank
            newRanks.set(nodeId, currentRank + 1)
          } else {
            // If at max rank, deselect the node
            newRanks.delete(nodeId)
            setSelectedClassNodes((prev) => prev.filter((id) => id !== nodeId))
          }

          return newRanks
        })
      } else {
        // If node doesn't have multiple ranks, deselect it
        setNodeRanks((prev) => {
          const newRanks = new Map(prev)
          newRanks.delete(nodeId)
          return newRanks
        })
        setSelectedClassNodes((prev) => prev.filter((id) => id !== nodeId))
      }
    } else {
      // If adding the node, set its rank to 1
      setNodeRanks((prev) => {
        const newRanks = new Map(prev)
        newRanks.set(nodeId, 1)
        return newRanks
      })
      setSelectedClassNodes((prev) => [...prev, nodeId])
    }
  }

  const toggleSpecNodeSelection = (nodeId: number) => {
    const node = specNodes.find((n) => n.id === nodeId)
    if (!node) return

    if (selectedSpecNodes.includes(nodeId)) {
      // If the node is already selected, increment its rank up to maxRanks
      const maxRanks = node.maxRanks || 1
      if (maxRanks > 1) {
        setNodeRanks((prev) => {
          const currentRank = prev.get(nodeId) || 1
          const newRanks = new Map(prev)

          if (currentRank < maxRanks) {
            // Increment rank
            newRanks.set(nodeId, currentRank + 1)
          } else {
            // If at max rank, deselect the node
            newRanks.delete(nodeId)
            setSelectedSpecNodes((prev) => prev.filter((id) => id !== nodeId))
          }

          return newRanks
        })
      } else {
        // If node doesn't have multiple ranks, deselect it
        setNodeRanks((prev) => {
          const newRanks = new Map(prev)
          newRanks.delete(nodeId)
          return newRanks
        })
        setSelectedSpecNodes((prev) => prev.filter((id) => id !== nodeId))
      }
    } else {
      // If adding the node, set its rank to 1
      setNodeRanks((prev) => {
        const newRanks = new Map(prev)
        newRanks.set(nodeId, 1)
        return newRanks
      })
      setSelectedSpecNodes((prev) => [...prev, nodeId])
    }
  }

  const toggleHeroNodeSelection = (nodeId: number) => {
    const node = heroNodes.find((n) => n.id === nodeId)
    if (!node) return

    if (selectedHeroNodes.includes(nodeId)) {
      // If the node is already selected, increment its rank up to maxRanks
      const maxRanks = node.maxRanks || 1
      if (maxRanks > 1) {
        setNodeRanks((prev) => {
          const currentRank = prev.get(nodeId) || 1
          const newRanks = new Map(prev)

          if (currentRank < maxRanks) {
            // Increment rank
            newRanks.set(nodeId, currentRank + 1)
          } else {
            // If at max rank, deselect the node
            newRanks.delete(nodeId)
            setSelectedHeroNodes((prev) => prev.filter((id) => id !== nodeId))
          }

          return newRanks
        })
      } else {
        // If node doesn't have multiple ranks, deselect it
        setNodeRanks((prev) => {
          const newRanks = new Map(prev)
          newRanks.delete(nodeId)
          return newRanks
        })
        setSelectedHeroNodes((prev) => prev.filter((id) => id !== nodeId))
      }
    } else {
      // If adding the node, set its rank to 1
      setNodeRanks((prev) => {
        const newRanks = new Map(prev)
        newRanks.set(nodeId, 1)
        return newRanks
      })
      setSelectedHeroNodes((prev) => [...prev, nodeId])
    }
  }

  const isClassNodeSelected = (nodeId: number) => {
    return selectedClassNodes.includes(nodeId)
  }

  const isSpecNodeSelected = (nodeId: number) => {
    return selectedSpecNodes.includes(nodeId)
  }

  const isHeroNodeSelected = (nodeId: number) => {
    return selectedHeroNodes.includes(nodeId)
  }

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({
      visible: true,
      message,
      type,
    })
  }

  function base64ToBinaryString(base64) {
    console.log('Decoding talent string using WoW bit-packing algorithm')

    // Create the base64 to number conversion table
    const base64ToNumberMap = new Map()

    // A-Z (0-25)
    for (let i = 0; i < 26; i++) {
      base64ToNumberMap.set(String.fromCharCode(65 + i), i)
    }

    // a-z (26-51)
    for (let i = 0; i < 26; i++) {
      base64ToNumberMap.set(String.fromCharCode(97 + i), 26 + i)
    }

    // 0-9 (52-61)
    for (let i = 0; i < 10; i++) {
      base64ToNumberMap.set(i.toString(), 52 + i)
    }

    // + (62)
    base64ToNumberMap.set('+', 62)

    // / or - (63)
    base64ToNumberMap.set('/', 63)
    base64ToNumberMap.set('-', 63)

    // Bits per character in base64
    const bitsPerChar = 6

    // Convert base64 string to array of numbers
    const dataValues: number[] = []
    for (let i = 0; i < base64.length; i++) {
      const char = base64[i]
      const number = base64ToNumberMap.get(char)

      if (number === undefined) {
        console.warn(`Unknown character in base64 string: ${char} at position ${i}`)
        continue
      }

      dataValues.push(number)
    }

    // Create a bit reader that can extract bits across character boundaries
    class BitReader {
      private dataValues: number[]
      private currentValueIndex: number
      private bitsUsedInCurrentValue: number

      constructor(dataValues: number[]) {
        this.dataValues = dataValues
        this.currentValueIndex = 0
        this.bitsUsedInCurrentValue = 0
      }

      extractBits(bitWidth: number): number {
        if (this.currentValueIndex >= this.dataValues.length) {
          console.warn('Reached end of data values')
          return 0
        }

        let result = 0
        let bitsExtracted = 0

        while (bitsExtracted < bitWidth) {
          // If we've used all bits in the current value, move to the next one
          if (this.bitsUsedInCurrentValue === bitsPerChar) {
            this.currentValueIndex++
            this.bitsUsedInCurrentValue = 0

            if (this.currentValueIndex >= this.dataValues.length) {
              console.warn(
                `Ran out of data values while extracting bits (wanted ${bitWidth}, got ${bitsExtracted})`
              )
              break
            }
          }

          const currentValue = this.dataValues[this.currentValueIndex]
          const bitsAvailable = bitsPerChar - this.bitsUsedInCurrentValue
          const bitsToExtract = Math.min(bitsAvailable, bitWidth - bitsExtracted)

          // Extract the bits
          const mask = (1 << bitsToExtract) - 1
          const extractedValue = (currentValue >> this.bitsUsedInCurrentValue) & mask

          // Add to result
          result |= extractedValue << bitsExtracted

          // Update counters
          bitsExtracted += bitsToExtract
          this.bitsUsedInCurrentValue += bitsToExtract
        }

        return result
      }
    }

    // Extract header information directly
    const bitReader = new BitReader(dataValues)

    // Extract version (8 bits)
    const version = bitReader.extractBits(8)
    console.log(`Extracted version: ${version}`)

    // Extract spec ID (16 bits)
    const specID = bitReader.extractBits(16)
    console.log(`Extracted spec ID: ${specID}`)

    // Update the current spec ID if it's a valid Druid spec (102-105)
    if (specID >= 102 && specID <= 105) {
      setCurrentSpecId(specID)
    }

    // Extract tree hash (128 bits as 16 bytes)
    const treeHash: number[] = []
    for (let i = 0; i < 16; i++) {
      treeHash.push(bitReader.extractBits(8))
    }

    const treeHashHex = treeHash.map((b) => b.toString(16).padStart(2, '0')).join('')
    // Now extract each node selection bit one by one and build the binary string
    let binaryResult = ''

    // Restart from the beginning to build the full binary string
    const fullBitReader = new BitReader(dataValues)

    // First add the header information
    // Version (8 bits)
    const versionBinary = fullBitReader.extractBits(8).toString(2).padStart(8, '0')
    binaryResult += versionBinary

    // Spec ID (16 bits)
    const specIDBinary = fullBitReader.extractBits(16).toString(2).padStart(16, '0')
    binaryResult += specIDBinary

    // Tree hash (128 bits)
    for (let i = 0; i < 16; i++) {
      const hashByte = fullBitReader.extractBits(8).toString(2).padStart(8, '0')
      binaryResult += hashByte
    }

    // Now extract the remaining bits for node selection
    const headerLength = 8 + 16 + 128 // version + specID + treeHash

    // Estimate the number of remaining bits based on data length
    const remainingBitCount = dataValues.length * 6 - headerLength

    // Extract the remaining bits
    for (let i = 0; i < remainingBitCount; i++) {
      try {
        const bit = fullBitReader.extractBits(1)
        binaryResult += bit
      } catch (e) {
        console.warn(`Error extracting bit ${i}: ${e}`)
        break
      }
    }
    return binaryResult
  }

  // Function to correctly determine if a hero node belongs to the active hero tree
  const determineHeroNodeSubTree = (nodeId: number, allHeroNodes: TalentNode[]) => {
    const node = allHeroNodes.find((n) => n.id === nodeId)
    return node?.subTreeId || 0
  }

  const importTalentString = (talentString: string) => {
    try {
      // Convert from base64 to binary string and extract specID
      const binaryString = base64ToBinaryString(talentString)

      // Extract the specID from the binary string (at bits 8-24)
      const specID = parseInt(binaryString.substring(8, 24), 2)

      // Skip header (152 bits: 8 bits version + 16 bits specID + 128 bits treeHash)
      const headerLength = 152

      // Take everything after the header
      const nodeSelectionBits = binaryString.substring(headerLength)

      // Find the Druid data for the specific spec using the extracted specID
      const druidData = talentData.find(
        (spec) => spec.className === 'Druid' && spec.specId === specID
      ) as TalentData | undefined

      if (!druidData) {
        console.error(`Could not find Druid data for specID ${specID} in talents.json`)
        return false
      }

      // Check if fullNodeOrder exists and is valid
      if (
        !druidData.fullNodeOrder ||
        !Array.isArray(druidData.fullNodeOrder) ||
        druidData.fullNodeOrder.length === 0
      ) {
        console.error('fullNodeOrder is missing or invalid in the talent data')
        return false
      }

      // Create a map of all nodes by ID for quick lookup
      const nodeMap = new Map<number, TalentNode>()

      // Collect nodes from all specs in the talent data
      let subTreeNodeId: number | undefined
      let subTrees: number[] = []
      let selectedHeroSubTreeId: number | undefined
      talentData.forEach((specData) => {
        // Add class nodes
        if (specData.classNodes && Array.isArray(specData.classNodes)) {
          specData.classNodes.forEach((node) => {
            if (!nodeMap.has(node.id)) {
              nodeMap.set(node.id, node)
            }
          })
        }

        // Add spec nodes
        if (specData.specNodes && Array.isArray(specData.specNodes)) {
          specData.specNodes.forEach((node) => {
            if (!nodeMap.has(node.id)) {
              nodeMap.set(node.id, node)
            }
          })
        }

        // Add hero nodes if they exist
        if (specData.heroNodes && Array.isArray(specData.heroNodes)) {
          specData.heroNodes.forEach((node) => {
            if (!nodeMap.has(node.id)) {
              nodeMap.set(node.id, node)
            }
          })
        }

        if (druidData && druidData.subTreeNodes) {
          subTreeNodeId = druidData.subTreeNodes[0].id
          subTrees = druidData.subTreeNodes[0].entries.map(
            (entry) =>
              // Use optional chaining instead of type assertion
              (entry as unknown as SubTreeEntry['entries'][0]).traitSubTreeId || 0
          )
        }

        if (specData.subTreeNodes && Array.isArray(specData.subTreeNodes)) {
          specData.subTreeNodes.forEach((node) => {
            if (!nodeMap.has(node.id)) {
              // Cast the node to TalentNode type
              nodeMap.set(node.id, node as unknown as TalentNode)
            }
          })
        }
      })

      // New arrays to store selected nodes
      const newSelectedClassNodes: number[] = []
      const newSelectedSpecNodes: number[] = []
      const newSelectedHeroNodes: number[] = []
      // New map to store choice selections
      const newNodeChoices = new Map<number, number>()
      // New map to store node ranks
      const newNodeRanks = new Map<number, number>()
      // Map to track which hero subTreeIds have selected nodes
      const selectedHeroSubTreeIds = new Set<number>()

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

                    if (isPartiallyRanked) {
                      // Ranks Purchased (6 bits)
                      const ranksPurchasedBits = nodeSelectionBits.substring(
                        currentPosition,
                        currentPosition + 6
                      )
                      // Reverse the bits before parsing to handle endianness
                      const reversedBits = ranksPurchasedBits.split('').reverse().join('')
                      const ranksPurchased = parseInt(reversedBits, 2)
                      currentPosition += 6

                      // Update the node rank based on the ranks purchased
                      if (
                        newSelectedClassNodes.includes(nodeId) ||
                        newSelectedSpecNodes.includes(nodeId) ||
                        newSelectedHeroNodes.includes(nodeId)
                      ) {
                        newNodeRanks.set(nodeId, ranksPurchased)
                      }
                    } else {
                      // If not partially ranked, set to max ranks if available
                      const node = nodeMap.get(nodeId)
                      if (node && node.maxRanks && node.maxRanks > 1) {
                        if (
                          newSelectedClassNodes.includes(nodeId) ||
                          newSelectedSpecNodes.includes(nodeId) ||
                          newSelectedHeroNodes.includes(nodeId)
                        ) {
                          newNodeRanks.set(nodeId, node.maxRanks)
                        }
                      }
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

          // Determine if it's a class, spec or hero node and add to appropriate array
          // Since we're collecting nodes from all specs, we need to check if this node
          // belongs to the current Druid spec we're displaying
          const isClassNode = druidData.classNodes.some((classNode) => classNode.id === nodeId)
          const isHeroNode =
            druidData.heroNodes?.some((heroNode) => heroNode.id === nodeId) || false
          const isSpecNode = druidData.specNodes.some((specNode) => specNode.id === nodeId)

          if (isClassNode) {
            newSelectedClassNodes.push(nodeId)
            // Set initial rank to 1
            newNodeRanks.set(nodeId, 1)
          } else if (isHeroNode) {
            // Track which hero subTree this node belongs to
            const heroSubTreeId = determineHeroNodeSubTree(nodeId, druidData.heroNodes || [])
            if (heroSubTreeId) {
              selectedHeroSubTreeIds.add(heroSubTreeId)
            }

            newSelectedHeroNodes.push(nodeId)
            // Set initial rank to 1
            newNodeRanks.set(nodeId, 1)
          } else if (isSpecNode) {
            newSelectedSpecNodes.push(nodeId)
            // Set initial rank to 1
            newNodeRanks.set(nodeId, 1)
          } else {
            // Node belongs to a different spec, we'll skip it for selection purposes
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

            if (isPartiallyRanked) {
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
              if (
                newSelectedClassNodes.includes(nodeId) ||
                newSelectedSpecNodes.includes(nodeId) ||
                newSelectedHeroNodes.includes(nodeId)
              ) {
                newNodeRanks.set(nodeId, ranksPurchased)
              }
            } else {
              // If not partially ranked, set to max ranks if available
              const node = nodeMap.get(nodeId)
              if (node && node.maxRanks && node.maxRanks > 1) {
                if (
                  newSelectedClassNodes.includes(nodeId) ||
                  newSelectedSpecNodes.includes(nodeId) ||
                  newSelectedHeroNodes.includes(nodeId)
                ) {
                  newNodeRanks.set(nodeId, node.maxRanks)
                }
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
              const choiceEntryIndex = parseInt(
                choiceEntryIndexBits.split('').reverse().join(''),
                2
              )
              currentPosition += 2
              if (isTargetNode) {
                selectedHeroSubTreeId = subTrees[choiceEntryIndex]
              }

              // Update the node choice
              if (
                newSelectedClassNodes.includes(nodeId) ||
                newSelectedSpecNodes.includes(nodeId) ||
                newSelectedHeroNodes.includes(nodeId)
              ) {
                newNodeChoices.set(nodeId, choiceEntryIndex)
              }
            }
          }
        }
      }

      // Clean up hero nodes - only include nodes from the chosen hero subTree
      if (selectedHeroSubTreeIds.size > 0 && druidData.heroNodes) {
        // Filter the hero nodes to keep only those from selected subTreeIds
        const filteredHeroNodes = newSelectedHeroNodes.filter((nodeId) => {
          const node = druidData.heroNodes?.find((n) => n.id === nodeId)
          if (
            node?.subTreeId &&
            (!selectedHeroSubTreeIds.has(node.subTreeId) ||
              node.subTreeId !== selectedHeroSubTreeId)
          ) {
            return false
          }
          return true
        })

        if (filteredHeroNodes.length !== newSelectedHeroNodes.length) {
          newSelectedHeroNodes.length = 0 // Clear the array
          newSelectedHeroNodes.push(...filteredHeroNodes) // Add back only the filtered nodes
        }
      }

      // Update the selected nodes state
      if (totalSelected > 0) {
        setSelectedClassNodes(newSelectedClassNodes)
        setSelectedSpecNodes(newSelectedSpecNodes)
        setSelectedHeroNodes(newSelectedHeroNodes)
        setNodeChoices(newNodeChoices)
        setNodeRanks(newNodeRanks)

        // Update the current spec ID to match the imported talent string
        if (specID >= 102 && specID <= 105) {
          setCurrentSpecId(specID)
        }

        // Increment the import counter to trigger a re-render
        setImportCounter((prev) => prev + 1)

        // showNotification(`Successfully imported ${totalSelected} talents`, 'success')
      } else {
        // showNotification('No talents were selected from the import string', 'error')
      }

      return true
    } catch (error) {
      console.error('Failed to import talent string:', error)
      // showNotification('Failed to import talent string', 'error')
      return false
    }
  }

  const resetSelections = () => {
    setSelectedClassNodes([])
    setSelectedSpecNodes([])
    setSelectedHeroNodes([])
    setNodeRanks(new Map())
  }

  const showAllHeroTalents = () => {
    // Set the active tree to hero
    setActiveTree('hero')

    // Select ALL nodes from each subTree to show all hero trees
    const nodesToSelect: number[] = []
    const newNodeRanks = new Map<number, number>()

    // Group nodes by subTreeId
    const nodesBySubTree = new Map()
    heroNodes.forEach((node) => {
      if (node.subTreeId) {
        if (!nodesBySubTree.has(node.subTreeId)) {
          nodesBySubTree.set(node.subTreeId, [])
        }
        nodesBySubTree.get(node.subTreeId).push(node)
      } else {
        // Include nodes without subTreeId
        nodesToSelect.push(node.id)
        // Set rank to maxRanks if available, otherwise 1
        const maxRank = node.maxRanks || 1
        newNodeRanks.set(node.id, maxRank)
      }
    })

    // Add all nodes from each subTree
    nodesBySubTree.forEach((nodes) => {
      nodes.forEach((node) => {
        nodesToSelect.push(node.id)
        // Set rank to maxRanks if available, otherwise 1
        const maxRank = node.maxRanks || 1
        newNodeRanks.set(node.id, maxRank)
      })
    })

    setSelectedHeroNodes(nodesToSelect)
    setNodeRanks(newNodeRanks)
  }

  const handleTalentStringChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTalentString(e.target.value)
  }

  const handleImportClick = () => {
    if (talentString) {
      importTalentString(talentString)
    }
  }

  const exportTalentString = (): string => {
    try {
      // Find the Druid data for the current spec
      const druidData = talentData.find(
        (spec) => spec.className === 'Druid' && spec.specId === currentSpecId
      ) as TalentData | undefined

      if (!druidData) {
        console.error(`Could not find Druid data for specID ${currentSpecId} in talents.json`)
        return ''
      }

      // Check if fullNodeOrder exists and is valid
      if (
        !druidData.fullNodeOrder ||
        !Array.isArray(druidData.fullNodeOrder) ||
        druidData.fullNodeOrder.length === 0
      ) {
        console.error('fullNodeOrder is missing or invalid in the talent data')
        return ''
      }

      // Create a new BitStream for encoding
      const binaryData = new BitStreamEncoder()

      // Add header information
      // Version (8 bits) - using 9 as current version
      binaryData.addBits(9, 8)

      // Spec ID (16 bits) - using the current spec ID
      binaryData.addBits(currentSpecId, 16)

      // Tree hash (128 bits) - using zeros for simplicity
      for (let i = 0; i < 16; i++) {
        binaryData.addBits(0, 8)
      }

      // Create a map for quick lookup of node types
      const nodeMap = new Map<number, { type: 'class' | 'spec' | 'hero'; spec: TalentData }>()

      // Collect nodes from all specs in the talent data
      talentData.forEach((specData) => {
        // Map class nodes
        if (specData.classNodes && Array.isArray(specData.classNodes)) {
          specData.classNodes.forEach((node) => {
            if (!nodeMap.has(node.id)) {
              nodeMap.set(node.id, { type: 'class', spec: specData })
            }
          })
        }

        // Map spec nodes
        if (specData.specNodes && Array.isArray(specData.specNodes)) {
          specData.specNodes.forEach((node) => {
            if (!nodeMap.has(node.id)) {
              nodeMap.set(node.id, { type: 'spec', spec: specData })
            }
          })
        }

        // Map hero nodes if they exist
        if (specData.heroNodes && Array.isArray(specData.heroNodes)) {
          specData.heroNodes.forEach((node) => {
            if (!nodeMap.has(node.id)) {
              nodeMap.set(node.id, { type: 'hero', spec: specData })
            }
          })
        }
      })

      // Process nodes in the order specified by fullNodeOrder
      for (const nodeId of druidData.fullNodeOrder) {
        // Check if the node is selected based on its type
        const nodeInfo = nodeMap.get(nodeId)
        if (!nodeInfo) {
          // Still need to add a bit for this node (not selected)
          binaryData.addBits(0, 1)
          continue
        }

        // Only consider the node selected if it belongs to our current Druid spec
        // and is in the appropriate selection array
        let isSelected = false
        const belongsToCurrentSpec =
          nodeInfo.spec.className === 'Druid' &&
          (nodeInfo.type === 'class' || nodeInfo.spec === druidData)

        if (belongsToCurrentSpec) {
          if (nodeInfo.type === 'class') {
            isSelected = selectedClassNodes.includes(nodeId)
          } else if (nodeInfo.type === 'spec') {
            isSelected = selectedSpecNodes.includes(nodeId)
          } else if (nodeInfo.type === 'hero') {
            isSelected = selectedHeroNodes.includes(nodeId)
          }
        }

        // Is node selected?
        binaryData.addBits(isSelected ? 1 : 0, 1)

        if (isSelected) {
          // Is node purchased? (assuming all selected nodes are purchased)
          binaryData.addBits(1, 1)

          // Find the node to check if it has multiple ranks
          let node: TalentNode | undefined = undefined
          if (nodeInfo.type === 'class') {
            node = druidData.classNodes.find((n) => n.id === nodeId)
          } else if (nodeInfo.type === 'spec') {
            node = druidData.specNodes.find((n) => n.id === nodeId)
          } else if (nodeInfo.type === 'hero' && druidData.heroNodes) {
            node = druidData.heroNodes.find((n) => n.id === nodeId)
          }

          // Check if this node has multiple ranks and if we have a specific rank set
          const hasMultipleRanks = node && node.maxRanks && node.maxRanks > 1
          const currentRank = nodeRanks.get(nodeId) || 1
          const maxRank = node?.maxRanks || 1

          // Is partially ranked?
          if (hasMultipleRanks && currentRank < maxRank) {
            // Node has multiple ranks and is partially ranked
            binaryData.addBits(1, 1)

            // Add the current rank (6 bits)
            binaryData.addBits(currentRank, 6)
          } else {
            // Node is not partially ranked (either single rank or at max rank)
            binaryData.addBits(0, 1)
          }

          const isChoiceNode = node && node.entries && node.entries.length > 1
          const choiceIndex = nodeChoices.get(nodeId) || 0

          // Is choice node?
          binaryData.addBits(isChoiceNode ? 1 : 0, 1)

          if (isChoiceNode) {
            // Choice Entry Index (2 bits)
            binaryData.addBits(choiceIndex, 2)
          }
        }
      }

      // Convert to Base64 and add 'C' prefix for class talents
      const base64String = 'C' + binaryData.toBase64()
      return base64String
    } catch (error) {
      console.error('Failed to export talent string:', error)
      return ''
    }
  }

  const handleExportClick = () => {
    const exportedString = exportTalentString()
    setTalentString(exportedString)

    // Copy to clipboard
    navigator.clipboard
      .writeText(exportedString)
      .then(() => {
        showNotification('Talent string copied to clipboard!', 'success')
      })
      .catch((err) => {
        console.error('Failed to copy talent string:', err)
        showNotification('Failed to copy talent string', 'error')
      })
  }

  const handleSampleClick = () => {
    setTalentString(sampleTalentString)
    importTalentString(sampleTalentString)
  }

  const handleTreeChange = (tree: 'class' | 'spec' | 'hero' | 'full') => {
    setActiveTree(tree)
  }

  // Determine which trees to show based on activeTree
  const showClassTree = activeTree === 'class' || activeTree === 'full'
  const showSpecTree = activeTree === 'spec' || activeTree === 'full'
  const showHeroTree = activeTree === 'hero' || activeTree === 'full'

  // Calculate the width classes based on which trees are visible
  const getWidthClass = () => {
    const visibleCount = [showClassTree, showSpecTree, showHeroTree].filter(Boolean).length

    if (visibleCount === 3) {
      // Class and Spec get 40% each, Hero gets 20%
      return {
        classWidth: 'w-[9/19]',
        specWidth: 'w-[3/19]',
        heroWidth: 'w-[7/19]',
      }
    } else if (visibleCount === 2) {
      // 50% each for two trees
      return {
        classWidth: 'w-1/2',
        specWidth: 'w-1/2',
        heroWidth: 'w-1/2',
      }
    } else {
      // 100% for a single tree
      return {
        classWidth: 'w-full',
        specWidth: 'w-full',
        heroWidth: 'w-full',
      }
    }
  }

  const { classWidth, specWidth, heroWidth } = getWidthClass()

  const handleCopyTalentString = () => {
    // Copy the talent string to clipboard
    if (talents) {
      navigator.clipboard
        .writeText(talents)
        .then(() => {
          setCopyButtonState('copied')
          setTimeout(() => setCopyButtonState('ready'), 2000) // Reset after 2 seconds
        })
        .catch((err) => {
          console.error('Failed to copy talent string:', err)
          showNotification('Failed to copy talent string', 'error')
        })
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {!viewOnly ? (
        <>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={talentString}
                onChange={handleTalentStringChange}
                placeholder="Paste talent string here..."
                className="flex-1 rounded-md border border-gray-600 bg-gray-800 p-2 text-white"
              />
              <button
                onClick={handleImportClick}
                className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Import
              </button>
              <button
                onClick={handleExportClick}
                className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
              >
                Export
              </button>
              <button
                onClick={resetSelections}
                className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                Reset
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <button
                  onClick={() => handleTreeChange('full')}
                  className={`rounded px-3 py-1 ${
                    activeTree === 'full'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
                  }`}
                >
                  Full Tree
                </button>
                <button
                  onClick={() => handleTreeChange('class')}
                  className={`rounded px-3 py-1 ${
                    activeTree === 'class'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
                  }`}
                >
                  Class Tree
                </button>
                <button
                  onClick={() => handleTreeChange('spec')}
                  className={`rounded px-3 py-1 ${
                    activeTree === 'spec'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
                  }`}
                >
                  Spec Tree
                </button>
                <button
                  onClick={() => handleTreeChange('hero')}
                  className={`rounded px-3 py-1 ${
                    activeTree === 'hero'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
                  }`}
                >
                  Hero Tree
                </button>
              </div>
              <button
                onClick={handleSampleClick}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                Use sample talent string
              </button>
            </div>
          </div>
        </>
      ) : (
        // In viewOnly mode, only show the tree navigation buttons
        <div className="flex space-x-2">
          <button
            onClick={() => handleTreeChange('full')}
            className={`rounded px-3 py-1 ${
              activeTree === 'full'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
            }`}
          >
            Full Tree
          </button>
          <button
            onClick={() => handleTreeChange('class')}
            className={`rounded px-3 py-1 ${
              activeTree === 'class'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
            }`}
          >
            Class Tree
          </button>
          <button
            onClick={() => handleTreeChange('spec')}
            className={`rounded px-3 py-1 ${
              activeTree === 'spec'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
            }`}
          >
            Spec Tree
          </button>
          <button
            onClick={() => handleTreeChange('hero')}
            className={`rounded px-3 py-1 ${
              activeTree === 'hero'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
            }`}
          >
            Hero Tree
          </button>
        </div>
      )}

      {notification.visible && (
        <div
          className={`rounded-md p-3 ${
            notification.type === 'success' ? 'bg-green-800' : 'bg-red-800'
          }`}
        >
          <p className="text-white">{notification.message}</p>
        </div>
      )}

      <div className="flex h-auto w-full ">
        {/* Dynamic layout based on which trees are visible */}
        <div className="flex h-full w-full">
          {showClassTree && (
            <div className={`h-full ${classWidth} p-2`}>
              <ClassTree
                nodes={classNodes}
                isNodeSelected={isClassNodeSelected}
                toggleNodeSelection={toggleClassNodeSelection}
                nodeChoices={nodeChoices}
                nodeRanks={nodeRanks}
                viewOnly={viewOnly}
              />
            </div>
          )}

          {showHeroTree && (
            <div className={`h-full ${heroWidth} p-2`}>
              <HeroTree
                nodes={heroNodes}
                isNodeSelected={isHeroNodeSelected}
                toggleNodeSelection={toggleHeroNodeSelection}
                selectedNodes={selectedHeroNodes}
                showAllHeroTalents={showAllHeroTalents}
                nodeChoices={nodeChoices}
                nodeRanks={nodeRanks}
                viewOnly={viewOnly}
                talentString={talentString}
              />
            </div>
          )}

          {showSpecTree && (
            <div className={`h-full ${specWidth} p-2`}>
              <SpecTree
                nodes={specNodes}
                isNodeSelected={isSpecNodeSelected}
                toggleNodeSelection={toggleSpecNodeSelection}
                nodeChoices={nodeChoices}
                nodeRanks={nodeRanks}
                viewOnly={viewOnly}
              />
            </div>
          )}
        </div>
      </div>

      {/* Add button to copy talent string */}
      {talents && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={handleCopyTalentString}
            className={`rounded-md px-4 py-2 text-white transition-all duration-300 ${
              copyButtonState === 'copied'
                ? 'scale-105 animate-pulse bg-yellow-600'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {copyButtonState === 'copied' ? 'Copied to Clipboard!' : 'Copy Talent String'}
          </button>
        </div>
      )}
    </div>
  )
}
