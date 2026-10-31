import { useLayoutEffect, useRef } from 'react'

/**
 * A ref that always holds the latest `value`, for callbacks living outside
 * React (CodeMirror keymaps, widgets, listeners) that must see current state
 * when they fire. Read it in those callbacks only, never during render.
 */
export function useLatest<T>(value: T) {
  const ref = useRef(value)
  useLayoutEffect(() => {
    ref.current = value
  })
  return ref
}
