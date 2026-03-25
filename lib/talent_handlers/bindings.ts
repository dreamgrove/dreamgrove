import { Talents, TalentBindings } from '@/types/index'
import { earlySpring } from './Balance/earlySpring'
import { controlOfTheDream } from './Balance/controlOfTheDream'
import { whirlingStars } from './Balance/whirlingStars'
import { incarnation } from './Balance/incarnation'
import { orbitalStrike } from './Balance/orbitalStrike'
import { improvedEclipse } from './Balance/improvedEclipse'
import { dreamstate } from './Resto/dreamstate'
import { ashamanesGuidance } from './Feral/ashamanesGuidance'
import { heartOfTheLion } from './Feral/heartOfTheLion'
import { predator } from './Feral/predator'
import { focusedFrenzy } from './Feral/focusedFrenzy'
import { cenariusGuidance } from './Resto/cenariusGuidance'
import { elunesGuidance } from './Balance/elunesGuidance'
import { sculptTheStars } from './Balance/sculptTheStars'

export const bindings: TalentBindings[] = [
  {
    id: Talents.EarlySpring,
    spellId: 428937,
    affectedSpells: [205636, 102693],
    handler: earlySpring,
    label: 'Early Spring',
    description: {
      balance: 'Force of Nature cooldown reduced by 15 sec.',
      resto: 'Grove Guardians cooldown reduced by 3 sec.',
    },
    specs: ['balance', 'resto'],
  },
  {
    id: Talents.ElunesGuidance,
    spellId: 393991,
    affectedSpells: [391528],
    handler: elunesGuidance,
    label: "Elune's Guidance",
    description: {
      balance:
        "Convoke's cooldown is reduced by 50% and its duration and number of spells cast is reduced by 25%",
    },
    specs: ['balance'],
  },
  {
    id: Talents.ControlOfTheDream,
    spellId: 434249,
    affectedSpells: [194223, 391528, 205636, 33891],
    handler: controlOfTheDream,
    label: 'Control of the Dream',
    description: {
      balance:
        'Up to 15 seconds of unused ability time are reduced from its next cooldown. Affects Force of Nature, Celestial Alignment and Convoke',
      resto:
        'Up to 15 seconds of unused ability time are reduced from its next cooldown. Affects Tree of Life and Convoke',
    },
    specs: ['balance', 'resto'],
  },
  {
    id: Talents.Incarnation,
    spellId: 102560,
    affectedSpells: [194223],
    handler: incarnation,
    label: 'Incarnation',
    description: {
      balance: 'Celestial Alignment effect duration increased by 5 sec.',
    },
    specs: ['balance'],
  },
  {
    id: Talents.WhirlingStars,
    spellId: 468743,
    affectedSpells: [194223],
    handler: whirlingStars,
    label: 'Whirling Stars',
    description: {
      balance: 'Celestial Alignment gains 2 charges and its cooldown is reduced by 60 seconds.',
    },
    specs: ['balance'],
    onByDefault: true,
  },
  {
    id: Talents.SculptTheStars,
    spellId: 1240188,
    affectedSpells: [1239669],
    handler: sculptTheStars,
    label: 'Sculpt the Stars',
    description: {
      balance: 'Eclipse cooldown reduced by 2 sec.',
    },
    specs: ['balance'],
  },
  {
    id: Talents.OrbitalStrike,
    spellId: 390378,
    affectedSpells: [194223],
    handler: orbitalStrike,
    label: 'Orbital Strike',
    description: {
      balance:
        'Reduces the cooldown of Incarnation: Chosen of Elune / Celestial Alignment by 60 sec.',
    },
    specs: ['balance'],
  },
  {
    id: Talents.ImprovedEclipse,
    spellId: 1240906,
    affectedSpells: [1239669],
    handler: improvedEclipse,
    label: 'Improved Eclipse',
    description: {
      balance: 'Eclipse has one additional charge.',
    },
    specs: ['balance'],
    onByDefault: true,
  },
  {
    id: Talents.Dreamstate,
    spellId: 392162,
    affectedSpells: [740],
    handler: dreamstate,
    label: 'Dreamstate',
    description: {
      resto:
        'While channeling Tranquility, your other Druid spell cooldowns are reduced by up to 20 seconds',
    },
    specs: ['resto'],
  },
  {
    id: Talents.HeartOfTheLion,
    spellId: 391174,
    affectedSpells: [106951],
    handler: heartOfTheLion,
    label: 'Heart of the Lion',
    description: {
      feral: 'Berserk cooldown reduced by 60 sec.',
    },
    specs: ['feral'],
  },
  {
    id: Talents.Predator,
    spellId: 202021,
    affectedSpells: [5217],
    handler: predator,
    label: 'Predator',
    description: {
      feral: "Tiger's Fury lasts 5 additional seconds.",
    },
    specs: ['feral'],
    onByDefault: true,
  },
  {
    id: Talents.FocusedFrenzy,
    spellId: 1244544,
    affectedSpells: [274837],
    handler: focusedFrenzy,
    label: 'Focused Frenzy',
    description: {
      feral: "Feral Frenzy's cooldown reduced by 15 sec and its damage is increased by 20%.",
    },
    specs: ['feral'],
  },
  {
    id: Talents.AshamanesGuidance,
    spellId: 391548,
    affectedSpells: [391528],
    handler: ashamanesGuidance,
    label: "Ashamane's Guidance",
    description: {
      feral: 'Convoke the Spirits cooldown reduced by 50%.',
    },
    specs: ['feral'],
  },
  {
    id: Talents.CenariusGuidance,
    spellId: 393371,
    affectedSpells: [391528, 33891],
    handler: cenariusGuidance,
    label: 'Cenarius Guidance',
    description: {
      resto:
        'Convoke the Spirits cooldown reduced by 50%.  The cooldown of Tree of Life is reduced by 5 sec when Grove Guardians fade.',
    },
    specs: ['resto'],
  },
]
