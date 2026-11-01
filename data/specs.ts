export type SpecId = 'balance' | 'feral' | 'guardian' | 'resto'

export interface SpecLink {
  label: string
  href: string
}

export interface SpecInfo {
  id: SpecId
  name: string
  color: string
  /** Key used by CheckboxContext / ConditionalElement ([*Balance] etc.) */
  checkboxKey: 'Balance' | 'Feral' | 'Guardian' | 'Resto'
  /** Slug of the compendium Blog document (data/blog/<slug>.mdx) */
  compendiumSlug: string
  blurb: string
  /** CSS object-position for the splash art */
  artPosition?: string
  /** Hardcoded "Jump to" links shown in the compendium box on the spec hub */
  jumpTo: SpecLink[]
}

const compendium = (spec: SpecId, anchor: string) => `/blog/${spec}/compendium#${anchor}`

// Display order (alphabetical) used by the homepage tiles, spec filters and CMS
export const SPECS: SpecInfo[] = [
  {
    id: 'balance',
    name: 'Balance',
    color: '#8a6fd6',
    checkboxKey: 'Balance',
    compendiumSlug: 'balance/compendium',
    blurb: 'Rotational advice, builds, consumables and everything else you need to play moonkin.',
    jumpTo: [
      { label: 'Beginner', href: compendium('balance', 'beginner') },
      { label: 'News', href: compendium('balance', 'news') },
      { label: 'Rotation', href: compendium('balance', 'rotation') },
      { label: 'Talents', href: compendium('balance', 'talents') },
      { label: 'Gearing & Consumables', href: compendium('balance', 'gearing--consumables') },
      { label: 'FAQ', href: compendium('balance', 'faq') },
    ],
  },
  {
    id: 'feral',
    name: 'Feral',
    color: '#e6b16a',
    checkboxKey: 'Feral',
    compendiumSlug: 'feral/compendium',
    blurb: 'Bleed management, openers, builds and gear for Feral in raid and Mythic+.',
    jumpTo: [
      { label: 'News', href: compendium('feral', 'news') },
      { label: 'Rotation', href: compendium('feral', 'rotation') },
      { label: 'Talents', href: compendium('feral', 'talents') },
      { label: 'Consumables', href: compendium('feral', 'consumables') },
      { label: 'Gearing', href: compendium('feral', 'gearing') },
      { label: 'Miscellaneous', href: compendium('feral', 'miscellaneous') },
    ],
  },
  {
    id: 'guardian',
    name: 'Guardian',
    color: '#d97a3b',
    checkboxKey: 'Guardian',
    compendiumSlug: 'guardian/compendium',
    blurb:
      'Talents, rotation, defensive usage and gear advice for tanking raids and keys as a bear.',
    jumpTo: [
      { label: 'News', href: compendium('guardian', 'news') },
      { label: 'Rotation', href: compendium('guardian', 'rotation') },
      { label: 'Talents', href: compendium('guardian', 'talents') },
      { label: 'Consumables', href: compendium('guardian', 'consumables') },
      { label: 'Gearing', href: compendium('guardian', 'gearing') },
      { label: 'Miscellaneous', href: compendium('guardian', 'miscellaneous') },
    ],
  },
  {
    id: 'resto',
    name: 'Restoration',
    color: '#1a9c82',
    checkboxKey: 'Resto',
    compendiumSlug: 'resto/compendium',
    blurb: 'Builds, gear, simming tools and links to other guides for Resto druids.',
    jumpTo: [
      { label: 'News', href: compendium('resto', 'news') },
      { label: 'Major Guides', href: compendium('resto', 'major-guides') },
      { label: 'Talents', href: compendium('resto', 'talents') },
      { label: 'BiS Gear', href: compendium('resto', 'resto-druid-bis-gear') },
      { label: 'Simming', href: compendium('resto', 'simming-resto-druid') },
      { label: 'Other Resources', href: compendium('resto', 'other-resources') },
    ],
  },
]

export const SPEC_IDS = SPECS.map((s) => s.id)

export function getSpec(id: string): SpecInfo | undefined {
  return SPECS.find((s) => s.id === id)
}
