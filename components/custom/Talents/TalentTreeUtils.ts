import talentData from '@/other/talents.json'

// Type definitions
export interface TalentNode {
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
  requirements?: (number | { nodeId: number; choice: number })[]
  choices?: {
    icon: string
    name: string
    spellId?: number
    type?: string
  }[]
}

export interface SubTreeEntry {
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

export interface TalentData {
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
  specId?: number
}

export interface GridCell {
  node: TalentNode | null
  row: number
  col: number
  colSpan?: number
}

// Function to build a grid from talent nodes
export const buildTalentGrid = (nodes: TalentNode[]) => {
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

// Collapse columns whose nodes always sit in rows where their immediate
// neighbours are empty — i.e. the column only exists to center the occasional
// node above/below a symmetric layout. The node is merged into the nearest
// kept column on its left and given a colSpan so it stays visually centered.
export const collapseGapColumns = (grid: GridCell[][]): GridCell[][] => {
  if (grid.length === 0 || grid[0].length === 0) return grid

  const numRows = grid.length
  const numCols = grid[0].length

  const gapCols: number[] = []
  for (let col = 0; col < numCols; col++) {
    // A column is "gap" only if it actually holds nodes (no point collapsing
    // already-empty columns in arbitrary positions), AND in every row where
    // it has a node, neither of its neighbours has a node. That lets us safely
    // merge the node into an adjacent column with a span.
    let hasAnyNode = false
    let isGap = true
    for (let row = 0; row < numRows; row++) {
      if (!grid[row][col].node) continue
      hasAnyNode = true
      const leftBlocks = col > 0 && grid[row][col - 1].node
      const rightBlocks = col < numCols - 1 && grid[row][col + 1].node
      if (leftBlocks || rightBlocks) {
        isGap = false
        break
      }
    }
    if (hasAnyNode && isGap) gapCols.push(col)
  }

  if (gapCols.length === 0) return grid

  const keptCols = Array.from({ length: numCols }, (_, i) => i).filter((c) => !gapCols.includes(c))
  const oldToNew = new Map<number, number>()
  keptCols.forEach((oldCol, newCol) => oldToNew.set(oldCol, newCol))

  const newGrid: GridCell[][] = Array.from({ length: numRows }, (_, row) =>
    Array.from({ length: keptCols.length }, (_, col) => ({ node: null, row, col }))
  )

  for (let row = 0; row < numRows; row++) {
    for (const oldCol of keptCols) {
      newGrid[row][oldToNew.get(oldCol)!].node = grid[row][oldCol].node
    }
  }

  for (const gapCol of gapCols) {
    for (let row = 0; row < numRows; row++) {
      const node = grid[row][gapCol].node
      if (!node) continue

      let leftKept = -1
      let rightKept = -1
      for (const oldCol of keptCols) {
        if (oldCol < gapCol) leftKept = oldCol
        else if (oldCol > gapCol && rightKept === -1) rightKept = oldCol
      }

      if (leftKept === -1 && rightKept === -1) continue

      if (leftKept === -1 || rightKept === -1) {
        const fallbackNewCol = oldToNew.get(leftKept === -1 ? rightKept : leftKept)!
        newGrid[row][fallbackNewCol].node = node
        continue
      }

      const leftNewCol = oldToNew.get(leftKept)!
      const rightNewCol = oldToNew.get(rightKept)!
      newGrid[row][leftNewCol].node = node
      newGrid[row][leftNewCol].colSpan = rightNewCol - leftNewCol + 1
    }
  }

  return newGrid
}

// Function to get talent data for a spec
export function getTalentDataForSpec(specId: number): TalentData | undefined {
  return talentData.find((spec) => spec.specId === specId) as TalentData | undefined
}
