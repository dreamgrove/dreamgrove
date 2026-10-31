'use client'

import Icon from '@/components/Icon'
import { ReactNode, useState } from 'react'

export default function WCLSection({ children }: { children: ReactNode }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <section
      className="relative overflow-hidden rounded-sm border border-neutral-700/50 bg-neutral-900/30 backdrop-blur-[2px]"
      aria-label="Warcraft Logs data"
    >
      <button
        type="button"
        aria-expanded={expanded}
        onClick={() => setExpanded((v) => !v)}
        className="group flex w-full items-center justify-between py-2.5 pr-3 pl-5 text-left transition-colors hover:bg-white/[0.025] focus:outline-none focus-visible:bg-white/[0.035]"
      >
        <span className="flex items-baseline gap-3">
          <span className="text-[10px] font-semibold tracking-[0.22em] text-orange-400/95 uppercase">
            Warcraft Logs
          </span>
        </span>
        <span className="flex items-center gap-2.5 text-[10px] tracking-widest text-neutral-500 uppercase">
          <span className="hidden transition-opacity duration-200 sm:inline">
            {expanded ? 'Hide' : 'Expand'}
          </span>
          <Icon
            name="chevronDownMini"
            className={`h-3 w-3 text-neutral-400 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:text-orange-400 ${
              expanded ? 'rotate-180' : ''
            }`}
          />
        </span>
      </button>

      {/* Accordion body — grid-rows trick for smooth height animation */}
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-neutral-700/50 bg-black/25 px-5 py-4">{children}</div>
        </div>
      </div>
    </section>
  )
}
