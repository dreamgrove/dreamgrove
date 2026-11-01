import { SpellInfo } from '@/types/index'
import { readJson, writeJson } from '@/lib/utils/storage'

export const CUSTOM_SPELLS_KEY = 'dreamgrove-custom-spells'

export interface CustomSpell extends SpellInfo {
  isCustom: true
  color: string // Hex color for the custom spell icon
  createdAt: number
  mrtSpellId?: number // Optional spell ID for MRT export
}

// Generate a random color for custom spells
function generateRandomColor(): string {
  const colors = [
    '#4B4376',
    '#1A3636',
    '#49243E',
    '#344955',
    '#331D2C',
    '#27374D',
    '#393053',
    '#3F4E4F',
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

function saveCustomSpells(customSpells: CustomSpell[]): void {
  writeJson(CUSTOM_SPELLS_KEY, customSpells)
}

/** The well-formed entries of a stored custom spell list */
export function toCustomSpells(parsed: unknown): CustomSpell[] {
  if (!Array.isArray(parsed)) return []
  return parsed.filter(
    (spell) =>
      spell &&
      typeof spell.spellId === 'number' &&
      typeof spell.name === 'string' &&
      spell.isCustom === true
  )
}

function loadCustomSpells(): CustomSpell[] {
  return toCustomSpells(readJson<unknown>(CUSTOM_SPELLS_KEY, []))
}

// Add a new custom spell
export function addCustomSpell(
  spellInfo: Omit<SpellInfo, 'spellId'> & { mrtSpellId?: number }
): CustomSpell {
  const customSpells = loadCustomSpells()

  // Generate a unique spell ID (negative to avoid conflicts with real spell IDs)
  const newSpellId = Math.floor(Math.random() * -100000) - 1000

  const { mrtSpellId, ...restSpellInfo } = spellInfo
  const customSpell: CustomSpell = {
    ...restSpellInfo,
    spellId: newSpellId,
    isCustom: true,
    color: generateRandomColor(),
    createdAt: Date.now(),
    mrtSpellId,
  }

  customSpells.push(customSpell)
  saveCustomSpells(customSpells)

  return customSpell
}

// Remove a custom spell by ID
export function removeCustomSpell(spellId: number): void {
  const customSpells = loadCustomSpells()
  const filtered = customSpells.filter((spell) => spell.spellId !== spellId)
  saveCustomSpells(filtered)
}

// Check if a spell is custom
export function isCustomSpell(spell: SpellInfo): spell is CustomSpell {
  return 'isCustom' in spell && spell.isCustom === true
}
