import { Patch } from './PatchSystem'

export const SPELL_GCD = 1.5

// SpellInfo matches the structure in spells.json
export interface SpellInfo {
  id: string
  spellId: number
  name: string
  channel_duration: number
  effect_duration: number
  cooldown: number // cooldown of a single charge
  charges?: number // ≥1 (1 means the spell behaves like today)
  channeled?: boolean
}

export interface AverageCastInfo {
  ca: number[]
  convoke: number[]
  fon: number[]
}

// Define a type for charge index (0-based)
export type ChargeIndex = number

// Basic cast information
export interface CastInfo {
  id: string
  chargeIndex: ChargeIndex // Which charge this cast belongs to (0, 1, etc.)
  start_s: number
  end_s: number
  delay_s?: number[]
  // These are added by the timeline view for rendering
}

// Grouped casts for each spell charge
export interface SpellChargeCasts {
  spell: SpellInfo
  chargeIndex: ChargeIndex // Which charge this row represents
  casts: CastInfo[] // All casts for this specific charge
}

// Legacy SpellCasts interface for backward compatibility during transition
export interface SpellCasts {
  spell: SpellInfo
  casts: CastInfo[]
  chargeIndex?: number
}

// Timeline effect interface
export interface TimelineEffect {
  id: string
  name: string
  description?: string
  // Legacy method - will be deprecated in favor of generatePatch
  applyEffect: (currentSpells: SpellCasts[], spells: SpellInfo[]) => SpellCasts[]
  // New method to generate patches instead of directly modifying spells
  generatePatch?: (currentSpells: SpellCasts[], spells: SpellInfo[]) => Patch | null
}
