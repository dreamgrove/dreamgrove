import spellData from '../../spellData.json'

const spellIds: Record<string, string | undefined> = spellData

/**
 * The spell id for a spell named in content (`<Wowhead type="spell" name="…">`
 * or `!Name!`), from the hand-maintained spellData.json. English and Korean names.
 */
export function spellIdFromName(name: string | undefined): string | undefined {
  return name ? spellIds[name] : undefined
}
