import React, { createContext, useContext, useState, useEffect } from 'react'

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

function loadSettings(): StoredSettings {
  if (typeof window === 'undefined') {
    return { showEventMarkers: false, timestampFormat: 'seconds' }
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.warn('Failed to load settings from localStorage:', error)
  }

  return { showEventMarkers: false, timestampFormat: 'seconds' }
}

function saveSettings(settings: StoredSettings) {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch (error) {
    console.warn('Failed to save settings to localStorage:', error)
  }
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [showEventMarkers, setShowEventMarkersState] = useState(false)
  const [timestampFormat, setTimestampFormatState] = useState<'seconds' | 'minutes'>('seconds')
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const settings = loadSettings()
    setShowEventMarkersState(settings.showEventMarkers)
    setTimestampFormatState(settings.timestampFormat)
    setIsInitialized(true)
  }, [])

  useEffect(() => {
    if (isInitialized) {
      saveSettings({ showEventMarkers, timestampFormat })
    }
  }, [showEventMarkers, timestampFormat, isInitialized])

  const setShowEventMarkers = (show: boolean) => {
    setShowEventMarkersState(show)
  }

  const setTimestampFormat = (format: 'seconds' | 'minutes') => {
    setTimestampFormatState(format)
  }

  return (
    <SettingsContext.Provider
      value={{
        showEventMarkers,
        setShowEventMarkers,
        timestampFormat,
        setTimestampFormat,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}
