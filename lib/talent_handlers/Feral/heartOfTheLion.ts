import { Talents } from '@/types/index'
import { spellModifier } from '../spellModifier'

export const heartOfTheLion = spellModifier(Talents.HeartOfTheLion, {
  // Berserk
  106951: (spell) => {
    spell.cooldown -= 60
  },
})
