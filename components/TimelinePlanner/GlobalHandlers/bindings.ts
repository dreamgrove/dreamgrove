import { Talents } from 'lib/types/cd_planner'

export const bindings = [
  {
    id: Talents.EarlySpring,
    spellId: 428937,
    label: 'Early Spring',
    description: 'Force of Nature cooldown reduced by 15 sec.',
    specs: ['balance', 'resto'],
  },
  {
    id: Talents.ControlOfTheDream,
    spellId: 434249,
    label: 'Control of the Dream',
    description: 'Up to 15s of unused ability time reduces its next cooldown after use',
    specs: ['balance', 'resto', 'guardian'],
  },
  {
    id: Talents.Incarnation,
    spellId: 102560,
    label: 'Incarnation',
    description: 'Celestial Alignment effect duration +5 sec.',
    specs: ['balance'],
  },
  {
    id: Talents.WhirlingStars,
    spellId: 468743,
    label: 'Whirling Stars',
    description: 'Celestial Alignment gains 2 charges and cooldown -100s.',
    specs: ['balance'],
  },
  {
    id: Talents.PotentEnchantments,
    spellId: 429420,
    label: 'Potent Enchantments',
    description:
      'Whirling Stars CD reduction +10 sec. Reforestation gives 3 additional seconds of ToL',
    specs: ['balance', 'resto'],
  },
  {
    id: Talents.Dreamstate,
    spellId: 392162,
    label: 'Dreamstate',
    description:
      'While channeling Tranquility, your other Druid spell cooldowns are reduced by up to 20 seconds',
    specs: ['resto'],
  },
  {
    id: Talents.HeartOfTheLion,
    spellId: 391174,
    label: 'Heart of the Lion',
    description: 'Berserk cooldown reduced by 60 sec.',
    specs: ['feral'],
  },
  {
    id: Talents.TearDownTheMighty,
    spellId: 441846,
    label: 'Tear Down the Mighty',
    description: 'Feral Frenzy cooldown reduced by 10 sec.',
    specs: ['feral'],
  },
  {
    id: Talents.AshamanesGuidance,
    spellId: 391548,
    label: "Ashamane's Guidance",
    description: 'Convoke the Spirits cooldown reduced by 50%.',
    specs: ['feral'],
  },
  {
    id: Talents.CenariusGuidance,
    spellId: 393371,
    label: 'Cenarius Guidance',
    description: 'Convoke the Spirits cooldown reduced by 50% + Tree of Life CDR',
    specs: ['resto'],
  },
]
