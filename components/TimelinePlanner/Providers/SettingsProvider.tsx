import React, { createContext, useContext, useMemo } from 'react'
import { jsonCodec, usePersistedState } from '@/hooks/usePersistedState'

interface SettingsContextType {
  showEventMarkers: boolean
  setShowEventMarkers: (show: boolean) => void
  timestampFormat: 'seconds' | 'minutes'
  setTimestampFormat: (format: 'seconds' | 'minutes') => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}

interface SettingsProviderProps {
  children: React.ReactNode
}

const STORAGE_KEY = 'timeline-planner-settings'

interface StoredSettings {
  showEventMarkers: boolean
  timestampFormat: 'seconds' | 'minutes'
}

const DEFAULT_SETTINGS: StoredSettings = { showEventMarkers: false, timestampFormat: 'seconds' }

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = usePersistedState<StoredSettings>(
    STORAGE_KEY,
    DEFAULT_SETTINGS,
    jsonCodec
  )

  const value = useMemo<SettingsContextType>(
    () => ({
      ...DEFAULT_SETTINGS,
      ...settings,
      setShowEventMarkers: (showEventMarkers) =>
        setSettings((prev) => ({ ...prev, showEventMarkers })),
      setTimestampFormat: (timestampFormat) =>
        setSettings((prev) => ({ ...prev, timestampFormat })),
    }),
    [settings, setSettings]
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}
