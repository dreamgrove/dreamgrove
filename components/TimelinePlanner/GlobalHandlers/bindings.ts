import { Talents } from 'lib/types/cd_planner'

export const bindings = [
  {
    id: Talents.EarlySpring,
    label: 'Early Spring',
    description: 'Force of Nature cooldown reduced by 15 sec.',
    specs: ['balance'],
  },
  {
    id: Talents.ControlOfTheDream,
    label: 'Control of the Dream',
    description:
      "Time elapsed while your major abilities are available to be used or at maximum charges is subtracted from that ability's cooldown after the next time you use it, up to 15 seconds.",
    specs: ['balance', 'resto'],
  },
  {
    id: Talents.Incarnation,
    label: 'Incarnation',
    description: 'Celestial Alignment effect duration increased by 5 sec.',
    specs: ['balance'],
  },
  {
    id: Talents.WhirlingStars,
    label: 'Whirling Stars',
    description: 'Celestial Alignment cooldown reduced by 100 sec. and gains 2 charges.',
    specs: ['balance'],
  },
  {
    id: Talents.PotentEnchantments,
    label: 'Potent Enchantments',
    description:
      'Whirling Stars reduces the cooldown of Celestial Alignment by an additional 10 sec.',
    specs: ['balance'],
  },
  {
    id: Talents.Dreamstate,
    label: 'Dreamstate',
    description:
      'While channeling Tranquility, your other Druid spell cooldowns are reduced by up to 20 seconds',
    specs: ['resto'],
  },
  {
    id: Talents.HeartOfTheLion,
    label: 'Heart of the Lion',
    description: 'Berserk cooldown reduced by 60 sec.',
    specs: ['feral'],
  },
  {
    id: Talents.TearDownTheMighty,
    label: 'Tear Down the Mighty',
    description: 'Feral Frenzy cooldown reduced by 10 sec.',
    specs: ['feral'],
  },
  {
    id: Talents.AshamanesGuidance,
    label: "Ashamane's Guidance",
    description: 'Convoke the Spirits cooldown reduced by 50%.',
    specs: ['feral'],
  },
  {
    id: Talents.CenariusGuidance,
    label: 'Cenarius Guidance',
    description: 'Convoke the Spirits cooldown reduced by 50% + Tree of Life CDR',
    specs: ['resto'],
  },
]
