'use client'

import { useLayoutEffect, useState, type ReactNode, type RefObject } from 'react'
import { createPortal } from 'react-dom'

/**
 * Dropdown list for an input inside a Dialog
 */
export default function Popover({
  anchor,
  children,
  role = 'listbox',
  id,
}: {
  anchor: RefObject<HTMLElement | null>
  /** For the input's aria-controls */
  id?: string
  children: ReactNode
  role?: string
}) {
  const [pos, setPos] = useState<{
    left: number
    width: number
    top?: number
    bottom?: number
    maxHeight: number
  } | null>(null)

  useLayoutEffect(() => {
    const place = () => {
      const el = anchor.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const gap = 4
      const margin = 8
      const below = window.innerHeight - r.bottom - gap - margin
      const above = r.top - gap - margin
      const up = below < 200 && above > below
      setPos({
        left: r.left,
        width: r.width,
        ...(up ? { bottom: window.innerHeight - r.top + gap } : { top: r.bottom + gap }),
        maxHeight: Math.min(256, up ? above : below),
      })
    }
    place()
    window.addEventListener('scroll', place, true)
    window.addEventListener('resize', place)
    return () => {
      window.removeEventListener('scroll', place, true)
      window.removeEventListener('resize', place)
    }
  }, [anchor])

  if (!pos) return null
  return createPortal(
    <ul
      id={id}
      role={role}
      style={pos}
      className="fixed z-[60] m-0 list-none overflow-auto overscroll-contain rounded-md border border-dg-line-soft bg-dg-panel p-1 shadow-xl"
    >
      {children}
    </ul>,
    document.body
  )
}
