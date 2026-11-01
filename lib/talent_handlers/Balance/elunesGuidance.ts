import { Talents } from '@/types/index'
import { spellModifier } from '../spellModifier'

export const elunesGuidance = spellModifier(Talents.ElunesGuidance, {
  // Convoke the Spirits
  391528: (spell) => {
    spell.cooldown *= 0.5
    spell.channel_duration *= 0.75
    spell.effect_duration *= 0.75
  },
})
