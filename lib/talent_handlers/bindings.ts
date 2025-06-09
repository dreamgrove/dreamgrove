import { Talents, TalentBindings } from '@/types/index'

export const bindings: TalentBindings[] = [
  {
    id: Talents.EarlySpring,
    spellId: 428937,
    label: 'Early Spring',
    description: {
      balance: 'Force of Nature cooldown reduced by 15 sec.',
      resto: 'Force of Nature cooldown reduced by 15 sec.',
    },
    specs: ['balance', 'resto'],
  },
  {
    id: Talents.ControlOfTheDream,
    spellId: 434249,
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
    label: 'Incarnation',
    description: {
      balance: 'Celestial Alignment effect duration increased by 5 sec.',
    },
    specs: ['balance'],
  },
  {
    id: Talents.WhirlingStars,
    spellId: 468743,
    label: 'Whirling Stars',
    description: {
      balance: 'Celestial Alignment gains 2 charges and its cooldown is reduced by 100 seconds.',
    },
    specs: ['balance'],
  },
  {
    id: Talents.PotentEnchantments,
    spellId: 429420,
    label: 'Potent Enchantments',
    description: {
      balance: 'Whirling Stars CD reduction is increased by 10 sec.',
      resto: 'Reforestation increases the duration of Tree of Life by 3 seconds',
    },
    specs: ['balance', 'resto'],
  },
  {
    id: Talents.Dreamstate,
    spellId: 392162,
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
    label: 'Heart of the Lion',
    description: {
      feral: 'Berserk cooldown reduced by 60 sec.',
    },
    specs: ['feral'],
  },
  {
    id: Talents.TearDownTheMighty,
    spellId: 441846,
    label: 'Tear Down the Mighty',
    description: {
      feral: 'Feral Frenzy cooldown reduced by 10 sec.',
    },
    specs: ['feral'],
  },
  {
    id: Talents.AshamanesGuidance,
    spellId: 391548,
    label: "Ashamane's Guidance",
    description: {
      feral: 'Convoke the Spirits cooldown reduced by 50%.',
    },
    specs: ['feral'],
  },
  {
    id: Talents.CenariusGuidance,
    spellId: 393371,
    label: 'Cenarius Guidance',
    description: {
      resto:
        'Convoke the Spirits cooldown reduced by 50%.  The cooldown of Tree of Life is reduced by 5 sec when Grove Guardians fade.',
    },
    specs: ['resto'],
  },
]
