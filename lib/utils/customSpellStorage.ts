import { SpellInfo } from '../types/cd_planner'

const CUSTOM_SPELLS_KEY = 'dreamgrove-custom-spells'

export interface CustomSpell extends SpellInfo {
  isCustom: true
  color: string // Hex color for the custom spell icon
  createdAt: number
}

// Generate a random color for custom spells
export function generateRandomColor(): string {
  const colors = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#96CEB4',
    '#FFEAA7',
    '#DDA0DD',
    '#98D8C8',
    '#F7DC6F',
    '#BB8FCE',
    '#85C1E9',
    '#F8C471',
    '#82E0AA',
    '#F1948A',
    '#85C1E9',
    '#D5A6BD',
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

// Save custom spells to localStorage
export function saveCustomSpells(customSpells: CustomSpell[]): void {
  try {
    localStorage.setItem(CUSTOM_SPELLS_KEY, JSON.stringify(customSpells))
  } catch (error) {
    console.warn('Failed to save custom spells to localStorage:', error)
  }
}

// Load custom spells from localStorage
export function loadCustomSpells(): CustomSpell[] {
  try {
    const saved = localStorage.getItem(CUSTOM_SPELLS_KEY)
    if (!saved) return []

    const parsed = JSON.parse(saved)
    // Validate the data structure
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (spell) =>
          spell &&
          typeof spell.spellId === 'number' &&
          typeof spell.name === 'string' &&
          spell.isCustom === true
      )
    }
  } catch (error) {
    console.warn('Failed to load custom spells from localStorage:', error)
  }
  return []
}

// Add a new custom spell
export function addCustomSpell(spellInfo: Omit<SpellInfo, 'spellId'>): CustomSpell {
  const customSpells = loadCustomSpells()

  // Generate a unique spell ID (negative to avoid conflicts with real spell IDs)
  const newSpellId = Math.floor(Math.random() * -100000) - 1000

  const customSpell: CustomSpell = {
    ...spellInfo,
    spellId: newSpellId,
    isCustom: true,
    color: generateRandomColor(),
    createdAt: Date.now(),
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

// Update a custom spell
export function updateCustomSpell(
  spellId: number,
  updates: Partial<Omit<CustomSpell, 'spellId' | 'isCustom' | 'createdAt'>>
): void {
  const customSpells = loadCustomSpells()
  const index = customSpells.findIndex((spell) => spell.spellId === spellId)

  if (index !== -1) {
    customSpells[index] = { ...customSpells[index], ...updates }
    saveCustomSpells(customSpells)
  }
}

// Check if a spell is custom
export function isCustomSpell(spell: SpellInfo): spell is CustomSpell {
  return 'isCustom' in spell && spell.isCustom === true
}
