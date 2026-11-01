import { Talents } from '@/types/index'
import { spellModifier } from '../spellModifier'

export const whirlingStars = spellModifier(Talents.WhirlingStars, {
  // Celestial Alignment
  194223: (spell) => {
    spell.cooldown -= 60
    spell.charges = 2
  },
})
