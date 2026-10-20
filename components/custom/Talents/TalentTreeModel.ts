import { buildTalentGrid, collapseGapColumns, TalentNode, GridCell } from './TalentTreeUtils'

// Compact, serializable description of a rendered talent tree. The server builds it
// from the talent string and the client draws it (see TalentTreeView) only once the
// dropdown is opened, instead of shipping the full tree markup in the page HTML.

export interface TreeNodeView {
  id: number
  row: number
  col: number
  span?: number
  icon?: string
  name: string
  spellId?: number
  selected: boolean
  rank: number
  maxRanks?: number
  border?: string
}

export interface TreeLineView {
  // Endpoints in grid-cell units (cell centers), drawn into a cols x rows viewBox
  x1: number
  y1: number
  x2: number
  y2: number
  active: boolean
}

export interface TreeView {
  title: string
  rows: number
  cols: number
  nodes: TreeNodeView[]
  lines: TreeLineView[]
  interactive: boolean
  message?: { title: string; detail?: string }
}

interface TreeOptions {
  nodes: TalentNode[]
  selectedNodes: number[]
  activeSelectedNodes?: number[]
  nodeChoices: Record<number, number>
  nodeRanks: Record<number, number>
  viewOnly?: boolean
  nodeColors?: Record<string, string>
}

const cellCenterCol = (cell: GridCell) => cell.col + (cell.colSpan ?? 1) / 2

function buildTreeView(
  title: string,
  grid: GridCell[][],
  nodes: TalentNode[],
  {
    selectedNodes,
    activeSelectedNodes,
    nodeChoices,
    nodeRanks,
    viewOnly = false,
    nodeColors = {},
  }: Omit<TreeOptions, 'nodes'>
): TreeView {
  const rows = grid.length
  const cols = grid[0]?.length ?? 0
  const nodesForConnections = activeSelectedNodes || selectedNodes
  const colorEntries = Object.entries(nodeColors)

  const nodeIdToCell = new Map<number, GridCell>()
  const nodeViews: TreeNodeView[] = []

  for (const cell of grid.flat()) {
    const node = cell.node
    if (!node) continue
    nodeIdToCell.set(node.id, cell)

    const selected = selectedNodes.includes(node.id)
    const isChoiceNode = node.entries.length > 1
    const choiceIndex = nodeChoices[node.id] || 0
    const entry = isChoiceNode && selected ? node.entries[choiceIndex] : undefined
    const icon = entry?.icon || node.entries[0]?.icon
    const name = (entry && entry.name) || node.name
    const spellId = node.entries[choiceIndex]?.spellId || node.entries[0]?.spellId
    const border = colorEntries.find(([nodeName]) =>
      node.name.toLowerCase().includes(nodeName.toLowerCase())
    )?.[1]

    nodeViews.push({
      id: node.id,
      row: cell.row,
      col: cell.col,
      ...(cell.colSpan && cell.colSpan > 1 && { span: cell.colSpan }),
      ...(icon && { icon }),
      name,
      ...(spellId && { spellId }),
      selected,
      rank: nodeRanks[node.id] || 0,
      ...(node.maxRanks && node.maxRanks > 1 && { maxRanks: node.maxRanks }),
      ...(border && { border }),
    })
  }

  const lines: TreeLineView[] = []
  for (const node of nodes) {
    const fromCell = nodeIdToCell.get(node.id)
    if (!fromCell || !node.next) continue
    for (const nextId of node.next) {
      const toCell = nodeIdToCell.get(nextId)
      if (!toCell) continue
      lines.push({
        x1: cellCenterCol(fromCell),
        y1: fromCell.row + 0.5,
        x2: cellCenterCol(toCell),
        y2: toCell.row + 0.5,
        active: nodesForConnections.includes(node.id) && nodesForConnections.includes(nextId),
      })
    }
  }

  return { title, rows, cols, nodes: nodeViews, lines, interactive: !viewOnly }
}

const emptyTree = (title: string, message: TreeView['message']): TreeView => ({
  title,
  rows: 0,
  cols: 0,
  nodes: [],
  lines: [],
  interactive: false,
  message,
})

export function buildClassTree(options: TreeOptions): TreeView {
  const grid = buildTalentGrid(options.nodes)
  if (grid.length === 0)
    return emptyTree('Class Tree', { title: 'No nodes available for this tree.' })
  return buildTreeView('Class Tree', grid, options.nodes, options)
}

export function buildSpecTree(options: TreeOptions): TreeView {
  const grid = buildTalentGrid(options.nodes)
  if (grid.length === 0) {
    return emptyTree('Specialization Tree', { title: 'No nodes available for this tree.' })
  }
  return buildTreeView('Specialization Tree', grid, options.nodes, options)
}

export function buildHeroTree(options: TreeOptions): TreeView {
  const { nodes, selectedNodes } = options
  const title = 'Hero Tree'
  const noSelection = {
    title: 'No fully selected hero trees',
    detail: 'All talents in a hero tree must be selected to display it',
  }

  if (nodes.length === 0) {
    return emptyTree(title, { title: 'No hero nodes available for this class/spec.' })
  }
  if (selectedNodes.length === 0) return emptyTree(title, noSelection)

  // Only show nodes from subTrees where every node is selected
  const filteredNodes = nodes.filter((node) => {
    if (!node.subTreeId) return true
    return nodes
      .filter((n) => n.subTreeId === node.subTreeId)
      .every((n) => selectedNodes.includes(n.id))
  })

  // Collapse purely-decorative middle columns so the hero tree doesn't have an
  // empty gap between halves.
  const grid = collapseGapColumns(buildTalentGrid(filteredNodes))
  if (grid.length === 0) return emptyTree(title, noSelection)

  return buildTreeView(title, grid, filteredNodes, options)
}
