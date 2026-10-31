import { useCallback, useSyncExternalStore, type Dispatch, type SetStateAction } from 'react'

// localStorage as an external store: every hook reading a key re-renders when
// it changes, and the server render (no storage) uses the default.
const listeners = new Set<() => void>()

function subscribe(onChange: () => void) {
  listeners.add(onChange)
  window.addEventListener('storage', onChange)
  return () => {
    listeners.delete(onChange)
    window.removeEventListener('storage', onChange)
  }
}

function read(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null // Storage blocked: use the default
  }
}

function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Storage blocked
  }
  listeners.forEach((l) => l())
}

/** useState mirrored to localStorage under `key` */
export function usePersistedState(
  key: string,
  initial: boolean
): readonly [boolean, Dispatch<SetStateAction<boolean>>]
export function usePersistedState<T extends string>(
  key: string,
  initial: T
): readonly [T, Dispatch<SetStateAction<T>>]
export function usePersistedState<T extends string | boolean>(key: string, initial: T) {
  const raw = useSyncExternalStore(
    subscribe,
    () => read(key),
    () => null
  )
  const parse = useCallback(
    (raw: string | null) =>
      (raw === null ? initial : typeof initial === 'boolean' ? raw === 'true' : raw) as T,
    [initial]
  )

  const set = useCallback(
    (next: SetStateAction<T>) => {
      const value = typeof next === 'function' ? next(parse(read(key))) : next
      write(key, String(value))
    },
    [key, parse]
  )

  return [parse(raw), set] as const
}
