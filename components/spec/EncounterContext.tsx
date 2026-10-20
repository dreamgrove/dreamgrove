'use client'
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

export interface EncounterMeta {
  id: string
  title: string
  trash: boolean
  empty: boolean
}

interface EncounterContextValue {
  encounters: EncounterMeta[]
  editUrl?: string
  isClosed: (id: string) => boolean
  setClosed: (id: string, closed: boolean) => void
}

const EncounterContext = createContext<EncounterContextValue | null>(null)

export const encounterDomId = (id: string) => `enc-${id}`

export function EncounterProvider({
  encounters,
  editUrl,
  children,
}: {
  encounters: EncounterMeta[]
  editUrl?: string
  children: ReactNode
}) {
  const [closed, setClosedMap] = useState<Record<string, boolean>>({})
  const isClosed = useCallback((id: string) => !!closed[id], [closed])
  const setClosed = useCallback(
    (id: string, value: boolean) => setClosedMap((prev) => ({ ...prev, [id]: value })),
    []
  )
  const value = useMemo(
    () => ({ encounters, editUrl, isClosed, setClosed }),
    [encounters, editUrl, isClosed, setClosed]
  )
  return <EncounterContext.Provider value={value}>{children}</EncounterContext.Provider>
}

export const useEncounters = () => useContext(EncounterContext)
