import { Talents } from '@/types/index'
import { spellModifier } from '../spellModifier'

export const earlySpring = spellModifier(Talents.EarlySpring, {
  // Force of Nature
  205636: (spell) => {
    spell.cooldown -= 15
  },
  // Grove Guardians
  102693: (spell) => {
    spell.cooldown -= 3
  },
})
