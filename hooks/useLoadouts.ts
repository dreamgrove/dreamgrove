import { useCallback } from 'react'
import { jsonCodec, usePersistedState } from '@/hooks/usePersistedState'
import { DruidSpec, PlayerAction } from '@/types/timeline'

export interface Loadout {
  id: string
  name: string
  spec: DruidSpec
  inputEvents: PlayerAction[]
  activeTalents: string[]
  createdAt: number
}

const STORAGE_KEY = 'timeline-planner-loadouts'

const NO_LOADOUTS: Loadout[] = []

export function useLoadouts() {
  const [loadouts, setLoadouts] = usePersistedState<Loadout[]>(STORAGE_KEY, NO_LOADOUTS, jsonCodec)

  const saveLoadout = useCallback(
    (name: string, spec: DruidSpec, inputEvents: PlayerAction[], activeTalents: string[]) => {
      const loadout: Loadout = {
        id: crypto.randomUUID(),
        name,
        spec,
        inputEvents: inputEvents.map((e) => ({
          spell: e.spell,
          instant: e.instant,
          id: e.id,
        })),
        activeTalents,
        createdAt: Date.now(),
      }
      setLoadouts((prev) => [loadout, ...prev])
      return loadout
    },
    [setLoadouts]
  )

  const deleteLoadout = useCallback(
    (id: string) => setLoadouts((prev) => prev.filter((l) => l.id !== id)),
    [setLoadouts]
  )

  const renameLoadout = useCallback(
    (id: string, newName: string) =>
      setLoadouts((prev) => prev.map((l) => (l.id === id ? { ...l, name: newName } : l))),
    [setLoadouts]
  )

  return { loadouts, saveLoadout, deleteLoadout, renameLoadout }
}
