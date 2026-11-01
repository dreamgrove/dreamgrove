// Web Storage access that never throws: private-mode Safari and hardened
// profiles throw on access, not just on use, and there is no storage on the server.

type StorageKind = 'local' | 'session'

export function getStorage(kind: StorageKind = 'local'): Storage | null {
  try {
    if (typeof window === 'undefined') return null
    return kind === 'local' ? window.localStorage : window.sessionStorage
  } catch {
    return null
  }
}

const listeners = new Set<() => void>()

// Values that could not be stored (blocked storage or quota) are kept here for the
// rest of the page's life, so state built on this module still updates in memory.
const memory = new Map<string, string>()
const memoryKey = (key: string, kind: StorageKind) => `${kind}:${key}`

/** Notifies on writes made through this module and on changes from other tabs. */
export function subscribeToStorage(onChange: () => void) {
  listeners.add(onChange)
  window.addEventListener('storage', onChange)
  return () => {
    listeners.delete(onChange)
    window.removeEventListener('storage', onChange)
  }
}

export function readItem(key: string, kind: StorageKind = 'local'): string | null {
  const fallback = memory.get(memoryKey(key, kind))
  if (fallback !== undefined) return fallback
  try {
    return getStorage(kind)?.getItem(key) ?? null
  } catch {
    return null
  }
}

/** Returns false when the value could not be stored (blocked storage or quota). */
export function writeItem(key: string, value: string, kind: StorageKind = 'local'): boolean {
  let stored = false
  try {
    const storage = getStorage(kind)
    if (storage) {
      storage.setItem(key, value)
      stored = true
    }
  } catch {
    // Blocked or over quota
  }
  if (stored) memory.delete(memoryKey(key, kind))
  else memory.set(memoryKey(key, kind), value)
  listeners.forEach((l) => l())
  return stored
}

export function removeItem(key: string, kind: StorageKind = 'local'): void {
  memory.delete(memoryKey(key, kind))
  try {
    getStorage(kind)?.removeItem(key)
  } catch {
    // Nothing to clean up if storage is unavailable
  }
  listeners.forEach((l) => l())
}

export function readJson<T>(key: string, fallback: T): T {
  const raw = readItem(key)
  if (raw === null) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeJson(key: string, value: unknown): boolean {
  return writeItem(key, JSON.stringify(value))
}
