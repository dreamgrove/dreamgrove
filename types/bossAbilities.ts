export interface BossAbilityCast {
  key: string
  /** Earliest-cast spell ID */
  spellId: number
  /** Every spell ID merged under this name */
  spellIds: number[]
  name: string
  /** Wowhead icon filename (no extension) */
  icon?: string
  timestamps: number[]
}

export interface BossAbilitiesResponse {
  encounter: { id: number; name: string }
  difficulty: number
  fightLengthSeconds: number
  reportCode: string
  fightID: number
  abilities: BossAbilityCast[]
  warning?: string
}
