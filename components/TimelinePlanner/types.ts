// SpellInfo matches the structure in spells.json
export interface SpellInfo {
  id: string
  spellId: number
  name: string
  channel_duration: number
  effect_duration: number
  cooldown: number
  channeled?: boolean
}

// Basic cast information
export interface CastInfo {
  id: string
  start_s: number
  end_s: number
  // These are added by the timeline view for rendering
}

// Grouped casts for each spell
export interface SpellCasts {
  spell: SpellInfo
  casts: CastInfo[]
}

// Timeline effect interface
export interface TimelineEffect {
  id: string
  name: string
  description?: string
  applyEffect: (currentSpells: SpellCasts[], spells: SpellInfo[]) => SpellCasts[]
}
