import {
  getTalentDataForSpec,
  TalentNode,
  SubTreeEntry,
} from '@/components/custom/Talents/TalentTreeUtils'

// WoW's talent export alphabet: standard Base64 with '-' in place of '/'.
const BASE64_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
const BITS_PER_CHAR = 6
const TREE_HASH_BYTES = 16

/**
 * Reads the talent export bit stream. Each Base64 character holds 6 bits, consumed
 * least significant bit first, and multi-bit fields are assembled LSB first too.
 * Reading past the end yields zeros.
 */
class TalentBitReader {
  private values: number[]
  private position = 0
  readonly length: number

  constructor(base64: string) {
    this.values = []
    for (const char of base64) {
      const value = BASE64_ALPHABET.indexOf(char === '-' ? '/' : char)
      if (value === -1) {
        console.warn(`Unknown character in talent string: ${char}`)
        continue
      }
      this.values.push(value)
    }
    this.length = this.values.length * BITS_PER_CHAR
  }

  has(bits: number): boolean {
    return this.position + bits <= this.length
  }

  read(bits: number): number {
    let result = 0
    for (let i = 0; i < bits; i++, this.position++) {
      if (this.position >= this.length) break
      const value = this.values[Math.floor(this.position / BITS_PER_CHAR)]
      const bit = (value >> (this.position % BITS_PER_CHAR)) & 1
      result |= bit << i
    }
    return result
  }
}

interface NodeBits {
  selected: boolean
  purchased: boolean
  /** Set when the node is only partially ranked. */
  ranks?: number
  /** Set for a choice node. */
  choice?: number
}

/** One node's entry: selected, purchased, partial rank (6 bits), choice index (2 bits). */
function readNode(reader: TalentBitReader): NodeBits {
  const selected = reader.read(1) === 1
  if (!selected) return { selected, purchased: false }

  const purchased = reader.read(1) === 1
  if (!purchased) return { selected, purchased }

  const node: NodeBits = { selected, purchased }
  if (reader.read(1) === 1 && reader.has(6)) {
    node.ranks = reader.read(6)
  }
  if (reader.read(1) === 1 && reader.has(2)) {
    node.choice = reader.read(2)
  }
  return node
}

export interface ParsedTalents {
  classNodes: TalentNode[]
  specNodes: TalentNode[]
  heroNodes: TalentNode[]
  selectedClassNodes: number[]
  selectedSpecNodes: number[]
  selectedHeroNodes: number[]
  nodeChoices: Record<number, number>
  nodeRanks: Record<number, number>
  error: string | null
  specId?: number
}

const emptyResult = (error: string, extra: Partial<ParsedTalents> = {}): ParsedTalents => ({
  classNodes: [],
  specNodes: [],
  heroNodes: [],
  selectedClassNodes: [],
  selectedSpecNodes: [],
  selectedHeroNodes: [],
  nodeChoices: {},
  nodeRanks: {},
  error,
  ...extra,
})

/** Decodes an in-game talent export string against the bundled talent tree data. */
export function parseTalentString(talentString: string): ParsedTalents {
  if (!talentString) {
    return emptyResult('No talent string provided')
  }

  try {
    const reader = new TalentBitReader(talentString)

    // Header: version (8 bits), spec id (16 bits), tree hash (128 bits).
    reader.read(8)
    const specId = reader.read(16)
    for (let i = 0; i < TREE_HASH_BYTES; i++) reader.read(8)

    const data = getTalentDataForSpec(specId)
    if (!data) {
      console.error(`Could not find Druid data for specID ${specId}`)
      return emptyResult(`Could not find talent data for spec ID ${specId}`)
    }

    const classNodes = data.classNodes || []
    const specNodes = data.specNodes || []
    const heroNodes = data.heroNodes || []

    if (!data.fullNodeOrder?.length) {
      console.error('fullNodeOrder is missing or invalid in the talent data')
      return emptyResult('Invalid talent data: missing or invalid node order', {
        classNodes,
        specNodes,
        heroNodes,
      })
    }

    // First occurrence wins, matching the class > spec > hero > sub-tree priority.
    const nodeMap = new Map<number, TalentNode>()
    for (const node of [...classNodes, ...specNodes, ...heroNodes]) {
      if (!nodeMap.has(node.id)) nodeMap.set(node.id, node)
    }
    for (const node of data.subTreeNodes ?? []) {
      if (!nodeMap.has(node.id)) nodeMap.set(node.id, node as unknown as TalentNode)
    }

    // The sub-tree node is the hero tree choice: its choice index picks the hero tree.
    const subTreeNode = data.subTreeNodes?.[0]
    const subTrees =
      subTreeNode?.entries.map(
        (entry) => (entry as unknown as SubTreeEntry['entries'][0]).traitSubTreeId || 0
      ) ?? []
    let selectedHeroSubTreeId: number | undefined

    const classIds = new Set(classNodes.map((n) => n.id))
    const specIds = new Set(specNodes.map((n) => n.id))
    const heroById = new Map<number, TalentNode>()
    for (const node of heroNodes) {
      if (!heroById.has(node.id)) heroById.set(node.id, node)
    }

    const selectedClassNodes: number[] = []
    const selectedSpecNodes: number[] = []
    let selectedHeroNodes: number[] = []
    const nodeChoices: Record<number, number> = {}
    const nodeRanks: Record<number, number> = {}
    const selectedHeroSubTreeIds = new Set<number>()

    for (const nodeId of data.fullNodeOrder) {
      // Every node in the order has an entry, so read it even when the tree data lacks the node.
      const bits = readNode(reader)
      const node = nodeMap.get(nodeId)
      if (!node || !bits.selected) continue

      if (classIds.has(nodeId)) {
        selectedClassNodes.push(nodeId)
        nodeRanks[nodeId] = 1
      } else if (heroById.has(nodeId)) {
        const heroSubTreeId = heroById.get(nodeId)?.subTreeId
        if (heroSubTreeId) selectedHeroSubTreeIds.add(heroSubTreeId)
        selectedHeroNodes.push(nodeId)
        nodeRanks[nodeId] = 1
      } else if (specIds.has(nodeId)) {
        selectedSpecNodes.push(nodeId)
        nodeRanks[nodeId] = 1
      }

      if (!bits.purchased) continue

      if (bits.ranks !== undefined) {
        nodeRanks[nodeId] = bits.ranks
      } else if (node.maxRanks && node.maxRanks > 1) {
        nodeRanks[nodeId] = node.maxRanks
      }

      if (bits.choice !== undefined) {
        if (nodeId === subTreeNode?.id) {
          selectedHeroSubTreeId = subTrees[bits.choice]
        }
        nodeChoices[nodeId] = bits.choice
      }
    }

    // Keep only the hero nodes of the chosen hero tree.
    if (selectedHeroSubTreeIds.size > 0) {
      selectedHeroNodes = selectedHeroNodes.filter((nodeId) => {
        const subTreeId = heroById.get(nodeId)?.subTreeId
        return (
          !subTreeId ||
          (selectedHeroSubTreeIds.has(subTreeId) && subTreeId === selectedHeroSubTreeId)
        )
      })
    }

    return {
      classNodes,
      specNodes,
      heroNodes,
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
    return emptyResult(
      error instanceof Error ? error.message : 'Unknown error parsing talent string',
      { specId: 102 } // Balance
    )
  }
}
