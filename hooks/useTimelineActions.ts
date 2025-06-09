import { useState, useCallback } from 'react'
import { PlayerAction } from '@/types/timeline'

export function useTimelineEvents(initialEvents: PlayerAction[] = []) {
  const [inputEvents, setInputEvents] = useState<PlayerAction[]>(initialEvents)

  // Modify a cast
  const handleModifyAction = useCallback((castId: string, newTime: number) => {
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

  // Remove a player cast
  const handleCastDelete = useCallback((castId: string) => {
    setInputEvents((prev) => prev.filter((action) => action.id !== castId))
  }, [])

  // Move a cast
  const handleCastMove = useCallback(
    (castId: string, newStartTime: number) => {
      handleModifyAction(castId, newStartTime)
    },
    [handleModifyAction]
  )

  // Find a cast by ID
  const findCastById = useCallback(
    (castId: string, timeline: PlayerAction[]): PlayerAction | null => {
      const cast = timeline.find((c) => c.id === castId)
      return cast || null
    },
    []
  )

  return {
    inputEvents,
    setInputEvents,
    handleCastDelete,
    handleCastMove,
  }
}
