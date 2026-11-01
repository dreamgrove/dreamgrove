import {
  useCallback,
  useMemo,
  useSyncExternalStore,
  type Dispatch,
  type SetStateAction,
} from 'react'
import { readItem, subscribeToStorage, writeItem } from '@/lib/utils/storage'

/** How a non-string value is stored. */
export interface StorageCodec<T> {
  parse: (raw: string) => T
  serialize: (value: T) => string
}

export const jsonCodec = { parse: JSON.parse, serialize: JSON.stringify }

const stringCodec: StorageCodec<string> = { parse: (raw) => raw, serialize: String }
const booleanCodec: StorageCodec<boolean> = { parse: (raw) => raw === 'true', serialize: String }

/**
 * useState mirrored to localStorage under `key`. Every hook reading a key
 * re-renders when it changes, and the server render (no storage) uses `initial`,
 * so hydration never mismatches. Pass a module-level `initial` for object values.
 */
export function usePersistedState(
  key: string,
  initial: boolean
): readonly [boolean, Dispatch<SetStateAction<boolean>>]
export function usePersistedState<T extends string>(
  key: string,
  initial: T
): readonly [T, Dispatch<SetStateAction<T>>]
export function usePersistedState<T>(
  key: string,
  initial: T,
  codec: StorageCodec<T>
): readonly [T, Dispatch<SetStateAction<T>>]
export function usePersistedState<T>(key: string, initial: T, codec?: StorageCodec<T>) {
  const { parse, serialize } = (codec ??
    (typeof initial === 'boolean' ? booleanCodec : stringCodec)) as StorageCodec<T>

  const raw = useSyncExternalStore(
    subscribeToStorage,
    () => readItem(key),
    () => null
  )

  const decode = useCallback(
    (raw: string | null): T => {
      if (raw === null) return initial
      try {
        return parse(raw)
      } catch {
        return initial // Corrupt entry: fall back rather than crash the page
      }
    },
    [initial, parse]
  )

  const set = useCallback(
    (next: SetStateAction<T>) => {
      const value =
        typeof next === 'function' ? (next as (prev: T) => T)(decode(readItem(key))) : next
      writeItem(key, serialize(value))
    },
    [key, decode, serialize]
  )

  const value = useMemo(() => decode(raw), [decode, raw])
  return [value, set] as const
}
