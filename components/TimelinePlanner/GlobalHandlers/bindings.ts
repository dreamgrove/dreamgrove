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
    specs: ['balance'],
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
]
