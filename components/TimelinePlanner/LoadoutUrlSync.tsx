'use client'

import { useEffect, useRef } from 'react'
import { useApplyLoadout } from 'hooks/useApplyLoadout'
import { useTimelineContext } from './TimelineProvider/useTimelineContext'
import { encodeLoadout } from '@/lib/utils/loadoutCode'

/**
 * Two-way sync between the planner state and a ?loadout=CODE query param.
 *
 * - On mount, imports a loadout from ?loadout= (or the legacy #loadout= hash,
 *   which "Open in planner" links used to produce).
 * - Afterwards, keeps the URL updated with the current loadout so the address
 *   bar is always a shareable link. Renders nothing.
 */
export default function LoadoutUrlSync() {
  const applyLoadout = useApplyLoadout()
  const { inputEvents, activeTalents, currentSpec } = useTimelineContext()
  const importHandled = useRef(false)

  useEffect(() => {
    const code =
      new URLSearchParams(window.location.search).get('loadout') ??
      window.location.hash.match(/^#loadout=(.+)$/)?.[1]

    // Defer past the initial mount commit so the import behaves like a
    // user-initiated one
    const timer = setTimeout(() => {
      if (code && !importHandled.current) {
        try {
          applyLoadout(decodeURIComponent(code))
        } catch (e) {
          console.warn('Failed to import loadout from URL:', e)
        }
      }
      importHandled.current = true
    }, 0)
    return () => clearTimeout(timer)
  }, [applyLoadout])

  useEffect(() => {
    // Don't touch the URL until the initial import has been handled, or we
    // would wipe the shared code out of the URL before reading it
    if (!importHandled.current) return

    const timer = setTimeout(() => {
      const url = new URL(window.location.href)
      url.hash = ''
      if (inputEvents.length === 0) {
        url.searchParams.delete('loadout')
      } else {
        try {
          url.searchParams.set('loadout', encodeLoadout(currentSpec, activeTalents, inputEvents))
        } catch {
          return
        }
      }
      if (url.href !== window.location.href) {
        history.replaceState(null, '', url)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [inputEvents, activeTalents, currentSpec])

  return null
}
