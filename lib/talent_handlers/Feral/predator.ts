import { Talents } from '@/types/index'
import { spellModifier } from '../spellModifier'

export const predator = spellModifier(Talents.Predator, {
  // Tiger's Fury
  5217: (spell) => {
    spell.effect_duration += 5
  },
})
