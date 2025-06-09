import { GlobalAction, TimelineState } from '@/types/index'

// Helper function to format time as minutes:seconds
export function formatTime(seconds: number): string {
  if (seconds < 0) return '0:00'

  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  const ms = Math.floor((seconds % 1) * 100)
  return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`
}

export function isValid(timelineState: TimelineState, castId: string): boolean {
  return timelineState.activeCasts.has(castId)
}

export function round(value: number, precision: number) {
  return Math.round(value * precision) / precision
}

export function bindGlobalAction(
  key: string,
  action: GlobalAction,
  handlers: Map<string, GlobalAction[]>
) {
  if (!handlers.has(key)) handlers.set(key, [])
  handlers.get(key)!.push(action)
}
