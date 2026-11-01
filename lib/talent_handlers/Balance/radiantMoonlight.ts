import { Talents } from '@/types/index'
import { spellModifier } from '../spellModifier'

export const radiantMoonlight = spellModifier(Talents.RadiantMoonlight, {
  // Fury of Elune
  202770: (spell) => {
    spell.cooldown -= 15
  },
})
