'use client'

import { useState, useEffect, type ReactNode } from 'react'
import dynamic from 'next/dynamic'
import type { SearchPaletteProps } from './SearchPalette'

const SearchPalette = dynamic(() => import('./SearchPalette'), { ssr: false })

export const OPEN_SEARCH_EVENT = 'dreamgrove:open-search'

export const openSearch = () => window.dispatchEvent(new Event(OPEN_SEARCH_EVENT))

export const KBarSearchProvider = ({
  kbarConfig,
  children,
}: SearchPaletteProps & { children: ReactNode }) => {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (loaded) return
    const load = () => setLoaded(true)
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        load()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener(OPEN_SEARCH_EVENT, load)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener(OPEN_SEARCH_EVENT, load)
    }
  }, [loaded])

  return (
    <>
      {children}
      {loaded && <SearchPalette kbarConfig={kbarConfig} />}
    </>
  )
}
