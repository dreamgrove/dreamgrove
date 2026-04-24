export interface BossAbilityCast {
  key: string
  spellId: number
  name: string
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
