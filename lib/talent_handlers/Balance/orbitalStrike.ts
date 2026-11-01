import { Talents } from '@/types/index'
import { spellModifier } from '../spellModifier'

export const orbitalStrike = spellModifier(Talents.OrbitalStrike, {
  // Celestial Alignment
  194223: (spell) => {
    spell.cooldown -= 60
  },
})
