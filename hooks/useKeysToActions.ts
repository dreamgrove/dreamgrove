import { useMemo } from 'react'
import { SpellInfo } from '@/types/timeline'
import { buildKeysToTalents } from '@/lib/embed/loadoutTimeline'

export function useKeysToTalents(activeTalents: string[], spells: SpellInfo[]) {
  const keysToTalents = useMemo(
    () => buildKeysToTalents(activeTalents, spells),
    [activeTalents, spells]
  )

  return {
    keysToTalents,
  }
}
