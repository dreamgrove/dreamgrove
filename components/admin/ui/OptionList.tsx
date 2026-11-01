'use client'

import { useState, type KeyboardEvent, type ReactNode, type RefObject } from 'react'
import Popover from './Popover'

/**
 * Highlighted row of an autocomplete list.
 */
export function useHighlight(count: number) {
  const [hi, setHi] = useState(0)
  const arrow = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return false
    e.preventDefault()
    setHi((h) => (e.key === 'ArrowDown' ? Math.min(h + 1, count - 1) : Math.max(h - 1, 0)))
    return true
  }
  return { hi, setHi, arrow }
}

/** Autocomplete results */
export default function OptionList<T>({
  anchor,
  id,
  items,
  highlighted,
  itemKey,
  onHover,
  onPick,
  children,
}: {
  anchor: RefObject<HTMLElement | null>
  /** For the input's aria-controls */
  id?: string
  items: T[]
  highlighted: number
  itemKey: (item: T) => string | number
  onHover: (index: number) => void
  onPick: (item: T) => void
  children: (item: T) => ReactNode
}) {
  return (
    <Popover anchor={anchor} id={id}>
      {items.map((item, i) => (
        <li key={itemKey(item)} role="option" aria-selected={i === highlighted}>
          <button
            type="button"
            // Keep focus in the input so its blur doesn't close or commit early
            onMouseDown={(e) => e.preventDefault()}
            onMouseEnter={() => onHover(i)}
            onClick={() => onPick(item)}
            className={`flex w-full items-center justify-between gap-3 rounded-[4px] px-2.5 py-1.5 text-left text-[.86rem] ${
              i === highlighted ? 'bg-dg-line-soft text-white' : 'text-[#d4d4d4]'
            }`}
          >
            {children(item)}
          </button>
        </li>
      ))}
    </Popover>
  )
}
