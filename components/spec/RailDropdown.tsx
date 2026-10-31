'use client'
import Icon from '@/components/Icon'
import { useEffect, useId, useRef, useState, type ReactNode } from 'react'

export default function RailDropdown({
  label,
  summary,
  children,
}: {
  label: string
  summary: ReactNode
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const panelId = useId()

  useEffect(() => {
    if (!open) return
    const onPointer = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={ref} className="lg:hidden">
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-md border border-[#3a3a3a] bg-[#1f1f1f] px-3 py-2.5 text-left text-[.98rem] font-semibold text-white transition-colors hover:border-[#4b4b4b] focus-visible:outline-2 focus-visible:outline-white"
      >
        <span className="flex min-w-0 items-center gap-3">{summary}</span>
        <Icon
          name="chevronDownThin"
          size={20}
          className={`flex-none text-white/60 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        id={panelId}
        hidden={!open}
        onClick={() => setOpen(false)}
        className="mt-1 flex flex-col gap-0.5 rounded-md border border-[#3a3a3a] bg-[#1f1f1f] p-1"
      >
        {children}
      </div>
    </div>
  )
}
