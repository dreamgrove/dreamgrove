'use client'
import { useEffect, useSyncExternalStore } from 'react'
import './specCardMorph'

let active: string | null = null
const listeners = new Set<() => void>()

export function setActiveSpec(id: string) {
  if (active === id) return
  active = id
  listeners.forEach((l) => l())
}

export function useActiveSpec() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => active,
    () => null
  )
}

export default function ActiveSpec({ id }: { id: string }) {
  useEffect(() => setActiveSpec(id), [id])
  return null
}
