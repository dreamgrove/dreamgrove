import { useState, useCallback } from 'react'
import { PlayerAction } from '@/types/timeline'

export function useTimelineEvents() {
  const [inputEvents, setInputEvents] = useState<PlayerAction[]>([])

  const handleCastMove = useCallback((castId: string, newTime: number) => {
    setInputEvents((prev) => {
      const actionIndex = prev.findIndex((a) => a.id === castId)
      if (actionIndex >= 0) {
        return prev.map((action, index) =>
          index === actionIndex ? { ...action, instant: newTime } : action
        )
      }
      return prev
    })
  }, [])

  const handleCastDelete = useCallback((castId: string) => {
    setInputEvents((prev) => prev.filter((action) => action.id !== castId))
  }, [])

  return {
    inputEvents,
    setInputEvents,
    handleCastDelete,
    handleCastMove,
  }
}
