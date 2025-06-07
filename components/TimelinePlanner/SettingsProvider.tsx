import React, { createContext, useContext, useState } from 'react'

interface SettingsContextType {
  showEventMarkers: boolean
  setShowEventMarkers: (show: boolean) => void
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

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [showEventMarkers, setShowEventMarkers] = useState(false)

  return (
    <SettingsContext.Provider
      value={{
        showEventMarkers,
        setShowEventMarkers,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}
