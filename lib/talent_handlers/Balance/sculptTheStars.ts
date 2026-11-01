import { Talents } from '@/types/index'
import { spellModifier } from '../spellModifier'

export const sculptTheStars = spellModifier(Talents.SculptTheStars, {
  // Eclipse
  1239669: (spell) => {
    spell.cooldown -= 3
  },
})
