import { Talents } from '@/types/index'
import { spellModifier } from '../spellModifier'

export const ashamanesGuidance = spellModifier(Talents.AshamanesGuidance, {
  // Convoke the Spirits
  391528: (spell) => {
    spell.cooldown *= 0.5
  },
})
