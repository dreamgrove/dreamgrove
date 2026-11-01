import { Talents } from '@/types/index'
import { spellModifier } from '../spellModifier'

export const improvedEclipse = spellModifier(Talents.ImprovedEclipse, {
  // Eclipse
  1239669: (spell) => {
    spell.charges += 1
  },
})
