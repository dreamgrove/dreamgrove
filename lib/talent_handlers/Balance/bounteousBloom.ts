import { Talents } from '@/types/index'
import { spellModifier } from '../spellModifier'

export const bounteousBloom = spellModifier(Talents.BounteousBloom, {
  // Force of Nature
  205636: (spell) => {
    spell.effect_duration += 4
  },
})
