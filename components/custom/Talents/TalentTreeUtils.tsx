import Image from 'next/image'
import talentData from '../../../other/talents.json'

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
}

// Bit stream utility for decoding talent strings
export class BitStream {
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

// BitStreamEncoder class for encoding talent strings
export class BitStreamEncoder {
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

// Function to decode base64 talent string to binary
export function base64ToBinaryString(base64: string) {
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

  // Extract spec ID (16 bits)
  const specID = bitReader.extractBits(16)

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

// Function to get talent data for a spec
export function getTalentDataForSpec(specId: number): TalentData | undefined {
  return talentData.find((spec) => spec.specId === specId) as TalentData | undefined
}

// Get all available spec IDs
export function getAvailableSpecIds(): number[] {
  return talentData.map((spec) => spec.specId).filter(Boolean) as number[]
}

// Server-side node components
export const TalentNode = ({
  node,
  selected,
  choiceIndex = 0,
  rank = 0,
  disableInteraction = false,
  borderColor,
}: {
  node: TalentNode
  selected: boolean
  choiceIndex?: number
  rank?: number
  disableInteraction?: boolean
  borderColor?: string
}) => {
  // Check if this is a choice node and which choice is selected
  const isChoiceNode = node.entries.length > 1
  const selectedChoiceIndex = choiceIndex || 0

  // Get the icon and name based on the selected choice
  const icon =
    isChoiceNode && selected
      ? node.entries[selectedChoiceIndex]?.icon || node.entries[0]?.icon
      : node.entries[0]?.icon

  const displayName =
    isChoiceNode && selected ? node.entries[selectedChoiceIndex]?.name || node.name : node.name

  return (
    <div
      className={`absolute flex h-[70%] w-[70%] items-center justify-center rounded-full border-2 opacity-80 ${
        !disableInteraction ? 'cursor-pointer hover:scale-110 hover:border-white' : ''
      } transition-all duration-200`}
      style={{
        zIndex: 10, // Ensure nodes appear above connection lines
        borderColor: borderColor || (selected ? '#00ff00' : '#ffd700'),
      }}
      title={displayName}
    >
      {icon && (
        <>
          <a
            href={`https://www.wowhead.com/spell=${node.entries[selectedChoiceIndex]?.spellId || node.entries[0]?.spellId || '0'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-[90%] w-[90%] items-center justify-center"
          >
            <Image
              src={`https://wow.zamimg.com/images/wow/icons/large/${icon}.jpg`}
              alt={displayName}
              width={56}
              height={56}
              className={`rounded-full ${
                selected ? 'brightness-125' : 'opacity-70 brightness-50 grayscale-50'
              }`}
              unoptimized={true}
              priority={false}
            />
          </a>
          {node.maxRanks && node.maxRanks > 1 && (
            <div
              className={`bg-opacity-70 absolute right-0 bottom-0 rounded-full bg-black px-1 text-xs font-bold ${selected ? 'text-white' : 'text-gray-400'}`}
              style={{
                zIndex: 11,
                border: selected ? '1px solid #ffcc00' : '1px solid #666',
                boxShadow: selected ? '0 0 3px rgba(255, 204, 0, 0.5)' : 'none',
                fontSize: '0.65rem', // Smaller font size for the rank indicator
              }}
            >
              {rank}/{node.maxRanks}
            </div>
          )}
        </>
      )}
    </div>
  )
}
