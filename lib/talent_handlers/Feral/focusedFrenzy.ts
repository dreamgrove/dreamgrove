import { Talents } from '@/types/index'
import { spellModifier } from '../spellModifier'

export const focusedFrenzy = spellModifier(Talents.FocusedFrenzy, {
  // Feral Frenzy
  274837: (spell) => {
    spell.cooldown -= 15
  },
})
