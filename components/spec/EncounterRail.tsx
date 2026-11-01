'use client'
import { useEffect, useState } from 'react'
import { encounterDomId, useEncounters } from './EncounterContext'
import RailDropdown from './RailDropdown'

const SPY_OFFSET = 160
const JUMP_OFFSET = 90

export default function EncounterRail() {
  const ctx = useEncounters()
  const encounters = ctx?.encounters ?? []
  const [active, setActive] = useState(encounters[0]?.id)

  useEffect(() => {
    const onScroll = () => {
      let current = encounters[0]?.id
      for (const e of encounters) {
        const el = document.getElementById(encounterDomId(e.id))
        if (el && el.getBoundingClientRect().top <= SPY_OFFSET) current = e.id
      }
      setActive(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [encounters])

  if (!ctx || encounters.length === 0) return null

  const jump = (id: string) => {
    ctx.setClosed(id, false)
    const el = document.getElementById(encounterDomId(id))
    if (!el) return
    setActive(id)
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - JUMP_OFFSET,
      behavior: 'smooth',
    })
  }

  const links = encounters.map((e) => {
    const isActive = active === e.id
    return (
      <a
        key={e.id}
        href={`#${encounterDomId(e.id)}`}
        onClick={(ev) => {
          ev.preventDefault()
          jump(e.id)
        }}
        className={`block cursor-pointer rounded-md px-3 py-2.5 text-[.98rem] transition-colors hover:bg-[#333] ${
          isActive
            ? 'bg-dg-panel font-semibold text-main'
            : e.empty
              ? 'font-medium text-white/40'
              : 'font-medium text-white/80'
        }`}
      >
        {e.title}
      </a>
    )
  })

  return (
    <div className="flex flex-col gap-3">
      <div className="dg-eyebrow lg:px-3">Encounters</div>
      <nav className="hidden flex-col gap-0.5 lg:flex">{links}</nav>
      <RailDropdown
        label="Jump to encounter"
        summary={
          <span className="truncate">
            {encounters.find((e) => e.id === active)?.title ?? encounters[0].title}
          </span>
        }
      >
        {links}
      </RailDropdown>
    </div>
  )
}
