import { buildTalentGrid, TalentNode, GridCell } from './TalentTreeUtils'

// Server Component to render the connection lines between nodes
export function ConnectionLines({
  nodes,
  nodeIdToCell,
  isConnectionActive,
  grid,
  treeType,
}: {
  nodes: TalentNode[]
  nodeIdToCell: Map<number, GridCell>
  isConnectionActive: (fromNodeId: number, toNodeId: number) => boolean
  grid: GridCell[][]
  treeType: 'class' | 'spec' | 'hero'
}) {
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
                strokeWidth={isActive ? 1 : 1}
                opacity={isActive ? 0.6 : 0.2}
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
                height: isActive ? '1px' : '1px',
                backgroundColor: isActive ? '#00ff00' : '#ffd700',
                opacity: isActive ? 0.6 : 0.2,
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

  return <>{connectionLines}</>
}

// Server Component for the talent tree grid
export function TalentTreeGrid({
  nodes,
  grid,
  nodeIdToCell,
  selectedNodes,
  nodeChoices,
  nodeRanks,
  disableInteraction,
  treeType,
}: {
  nodes: TalentNode[]
  grid: GridCell[][]
  nodeIdToCell: Map<number, GridCell>
  selectedNodes: number[]
  nodeChoices: Record<number, number>
  nodeRanks: Record<number, number>
  disableInteraction: boolean
  treeType: 'class' | 'spec' | 'hero'
}) {
  // Calculate the grid ratio for aspect ratio
  const gridRatio = grid[0]?.length / grid.length || 1

  // Function to determine if a connection is active based on tree type
  const isConnectionActive = (fromNodeId: number, toNodeId: number) => {
    return selectedNodes.includes(fromNodeId) && selectedNodes.includes(toNodeId)
  }

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
          <div className="absolute inset-0">
            <ConnectionLines
              nodes={nodes}
              nodeIdToCell={nodeIdToCell}
              isConnectionActive={isConnectionActive}
              grid={grid}
              treeType={treeType}
            />
          </div>

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
              const selected = selectedNodes.includes(node.id)
              const choiceIndex = nodeChoices[node.id] || 0
              const rank = nodeRanks[node.id] || 0

              return (
                <div
                  key={`node-${node.id}`}
                  className="w-max-[70px] h-max-[70px] relative flex aspect-1 w-full items-center justify-center"
                  style={{
                    gridRow: cell.row + 1,
                    gridColumn: cell.col + 1,
                  }}
                  data-node-id={node.id}
                >
                  <TalentNode
                    node={node}
                    selected={selected}
                    choiceIndex={choiceIndex}
                    rank={rank}
                    disableInteraction={disableInteraction}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// Server Component for rendering the ClassTree
export function ClassTreeLayout({
  nodes,
  selectedNodes,
  nodeChoices,
  nodeRanks,
  viewOnly = false,
}: {
  nodes: TalentNode[]
  selectedNodes: number[]
  nodeChoices: Record<number, number>
  nodeRanks: Record<number, number>
  viewOnly?: boolean
}) {
  // Build the grid from the nodes
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

  return (
    <div className="flex w-full flex-col">
      <h2 className="mb-2 mt-0 text-xl font-bold text-yellow-400">Class Tree</h2>
      <div className="flex-1 overflow-hidden">
        <TalentTreeGrid
          nodes={nodes}
          grid={grid}
          nodeIdToCell={nodeIdToCell}
          selectedNodes={selectedNodes}
          nodeChoices={nodeChoices}
          nodeRanks={nodeRanks}
          disableInteraction={viewOnly}
          treeType="class"
        />
      </div>
    </div>
  )
}

// Server Component for rendering the SpecTree
export function SpecTreeLayout({
  nodes,
  selectedNodes,
  nodeChoices,
  nodeRanks,
  viewOnly = false,
}: {
  nodes: TalentNode[]
  selectedNodes: number[]
  nodeChoices: Record<number, number>
  nodeRanks: Record<number, number>
  viewOnly?: boolean
}) {
  // Build the grid from the nodes
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

  return (
    <div className="flex h-full w-full flex-col">
      <h2 className="mb-2 mt-0 text-xl font-bold text-yellow-400">Specialization Tree</h2>
      <div className="flex-1 overflow-hidden">
        <TalentTreeGrid
          nodes={nodes}
          grid={grid}
          nodeIdToCell={nodeIdToCell}
          selectedNodes={selectedNodes}
          nodeChoices={nodeChoices}
          nodeRanks={nodeRanks}
          disableInteraction={viewOnly}
          treeType="spec"
        />
      </div>
    </div>
  )
}

// Server Component for rendering the HeroTree
export function HeroTreeLayout({
  nodes,
  selectedNodes,
  nodeChoices,
  nodeRanks,
  viewOnly = false,
}: {
  nodes: TalentNode[]
  selectedNodes: number[]
  nodeChoices: Record<number, number>
  nodeRanks: Record<number, number>
  viewOnly?: boolean
}) {
  // Group nodes by subTreeId
  const subTreeCounts = new Map<number, { total: number; selected: number }>()
  nodes.forEach((node) => {
    if (!node.subTreeId) return

    if (!subTreeCounts.has(node.subTreeId)) {
      subTreeCounts.set(node.subTreeId, { total: 0, selected: 0 })
    }

    const counts = subTreeCounts.get(node.subTreeId)!
    counts.total++
    if (selectedNodes.includes(node.id)) {
      counts.selected++
    }
  })

  // Filter nodes for display - only show nodes from subTrees where all nodes are selected
  const filteredNodes = nodes.filter((node) => {
    // Group hero nodes by their subTreeId
    const subTreeId = node.subTreeId
    if (!subTreeId) {
      return true // Keep nodes without subTreeId
    }

    // Check if ALL nodes in this subTree are selected
    const allNodesInSubTree = nodes.filter((n) => n.subTreeId === subTreeId)
    const allNodesSelected = allNodesInSubTree.every((n) => selectedNodes.includes(n.id))

    // Only include nodes from subTrees where all nodes are selected
    return allNodesSelected
  })

  // Build the grid from the filtered nodes
  const grid = buildTalentGrid(filteredNodes)

  // Create a node ID to grid cell mapping for quick lookup
  const nodeIdToCell = new Map<number, GridCell>()
  grid.forEach((row) => {
    row.forEach((cell) => {
      if (cell.node) {
        nodeIdToCell.set(cell.node.id, cell)
      }
    })
  })

  return (
    <div className="flex h-full w-full flex-col">
      <h2 className="mb-2 mt-0 text-xl font-bold text-yellow-400">Hero Tree</h2>
      {nodes.length > 0 ? (
        selectedNodes.length > 0 ? (
          <div className="flex-1 overflow-hidden">
            {grid.length > 0 ? (
              <TalentTreeGrid
                nodes={filteredNodes}
                grid={grid}
                nodeIdToCell={nodeIdToCell}
                selectedNodes={selectedNodes}
                nodeChoices={nodeChoices}
                nodeRanks={nodeRanks}
                disableInteraction={viewOnly}
                treeType="hero"
              />
            ) : (
              <div className="flex flex-1 items-center justify-center">
                <div className="rounded-lg bg-gray-800 p-6 text-center">
                  <p className="text-lg text-white">No fully selected hero trees</p>
                  <p className="mt-2 text-gray-400">
                    All talents in a hero tree must be selected to display it
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="rounded-lg bg-gray-800 p-6 text-center">
              <p className="text-lg text-white">No fully selected hero trees</p>
              <p className="mt-2 text-gray-400">
                All talents in a hero tree must be selected to display it
              </p>
            </div>
          </div>
        )
      ) : (
        <div className="text-white">No hero nodes available for this class/spec.</div>
      )}
    </div>
  )
}
