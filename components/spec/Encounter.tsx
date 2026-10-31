'use client'
import Icon from '@/components/Icon'
import { useState, type ReactNode } from 'react'
import { slug } from 'github-slugger'
import { encounterDomId, useEncounters } from './EncounterContext'

interface EncounterProps {
  title: string
  trash?: boolean
  children?: ReactNode
  // Legacy <BossCard> props, no longer rendered
  image?: string
  id?: string | number
}

export default function Encounter({ title, trash, children }: EncounterProps) {
  const ctx = useEncounters()
  const id = slug(title)
  const meta = ctx?.encounters.find((e) => e.id === id)
  const [localClosed, setLocalClosed] = useState(false)
  const closed = ctx ? ctx.isClosed(id) : localClosed
  const toggle = () => (ctx ? ctx.setClosed(id, !closed) : setLocalClosed(!closed))

  if (meta?.empty) {
    return (
      <section
        id={encounterDomId(id)}
        className="flex scroll-mt-24 flex-wrap items-baseline justify-between gap-4 border-t border-[#3a3a3a] py-8 first:border-t-0 first:pt-0"
      >
        <h2 className="m-0 text-[1.4rem] font-semibold tracking-[-0.01em] text-white/50">
          {title}
        </h2>
        <div className="flex gap-4 text-[.92rem]">
          <span className="text-white/40">No notes yet</span>
          {ctx?.editUrl && (
            <a href={ctx.editUrl} className="font-semibold text-[#d57f43] hover:text-[#dd6b20]">
              Write this section
            </a>
          )}
        </div>
      </section>
    )
  }

  return (
    <section
      id={encounterDomId(id)}
      className="scroll-mt-24 border-t border-[#3a3a3a] py-11 first:border-t-0 first:pt-0"
    >
      <button
        type="button"
        onClick={toggle}
        aria-expanded={!closed}
        className="flex w-full cursor-pointer items-center justify-between gap-4 border-0 bg-transparent p-0 text-left text-white transition-colors hover:text-[#d57f43]"
      >
        <h2
          className={`m-0 min-w-0 flex-1 leading-[1.15] font-semibold ${
            trash || meta?.trash
              ? 'text-[1.5rem] tracking-[-0.01em]'
              : 'text-[1.6rem] tracking-[-0.015em] sm:text-[1.9rem]'
          }`}
        >
          {title}
        </h2>
        <Icon
          name="chevronDownThin"
          size={20}
          className={`flex-none transition-transform duration-200 ${closed ? '-rotate-90' : ''}`}
        />
      </button>
      <div className="dg-encounter-body" hidden={closed}>
        {children}
      </div>
    </section>
  )
}
