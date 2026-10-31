import { useSyncExternalStore } from 'react'

const noop = () => () => {}

/**
 * False during the server render and hydration, true after. For UI that
 * depends on browser-only state (theme, dates) and must not mismatch.
 */
export function useMounted() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false
  )
}
