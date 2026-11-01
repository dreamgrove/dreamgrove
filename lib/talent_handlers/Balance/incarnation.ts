import { Talents } from '@/types/index'
import { spellModifier } from '../spellModifier'

export const incarnation = spellModifier(Talents.Incarnation, {
  // Celestial Alignment
  194223: (spell) => {
    spell.effect_duration += Math.round(spell.effect_duration * 0.33)
  },
})
