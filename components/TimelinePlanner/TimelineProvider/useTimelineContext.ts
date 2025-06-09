import { useContext } from 'react'

import { TimelineContext } from './TimelineProvider'

export function useTimelineContext() {
  const context = useContext(TimelineContext)
  if (context === undefined) {
    throw new Error('useTimelineContext must be used within a TimelineProvider')
  }
  return context
}
