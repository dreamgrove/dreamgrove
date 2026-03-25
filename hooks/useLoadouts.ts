import { useState, useCallback } from 'react'
import { PlayerAction, SpellInfo } from '@/types/timeline'

export interface Loadout {
  id: string
  name: string
  spec: string
  inputEvents: SerializedPlayerAction[]
  activeTalents: string[]
  createdAt: number
}

/** PlayerAction with spell stored as plain object (no class instances) */
interface SerializedPlayerAction {
  spell: SpellInfo
  instant: number
  id: string
}

const STORAGE_KEY = 'timeline-planner-loadouts'

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

function loadFromStorage(): Loadout[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.warn('Failed to load loadouts:', e)
  }
  return []
}

function saveToStorage(loadouts: Loadout[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loadouts))
  } catch (e) {
    console.warn('Failed to save loadouts:', e)
  }
}

export function useLoadouts() {
  const [loadouts, setLoadouts] = useState<Loadout[]>(() => loadFromStorage())

  const saveLoadout = useCallback(
    (name: string, spec: string, inputEvents: PlayerAction[], activeTalents: string[]) => {
      const loadout: Loadout = {
        id: generateId(),
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
      setLoadouts((prev) => {
        const next = [loadout, ...prev]
        saveToStorage(next)
        return next
      })
      return loadout
    },
    []
  )

  const deleteLoadout = useCallback((id: string) => {
    setLoadouts((prev) => {
      const next = prev.filter((l) => l.id !== id)
      saveToStorage(next)
      return next
    })
  }, [])

  const renameLoadout = useCallback((id: string, newName: string) => {
    setLoadouts((prev) => {
      const next = prev.map((l) => (l.id === id ? { ...l, name: newName } : l))
      saveToStorage(next)
      return next
    })
  }, [])

  return { loadouts, saveLoadout, deleteLoadout, renameLoadout }
}
