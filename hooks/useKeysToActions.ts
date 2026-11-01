import { useMemo } from 'react'
import { SpellInfo } from '@/types/timeline'
import { buildKeysToTalents } from '@/lib/talent_handlers/keysToTalents'

export function useKeysToTalents(activeTalents: string[], spells: SpellInfo[]) {
  const keysToTalents = useMemo(
    () => buildKeysToTalents(activeTalents, spells),
    [activeTalents, spells]
  )

  return {
    keysToTalents,
  }
}
