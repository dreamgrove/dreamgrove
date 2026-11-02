import React, { useEffect, useState } from 'react'
import { CustomSpell } from '@/lib/utils/customSpellStorage'
import WowheadClientIcon from '@/components/cms/WowheadClientIcon'
import { getWowheadInfo } from '@/lib/wowhead/client'
import { buildWowheadUrl } from '@/lib/wowhead/urls'

interface CustomSpellIconProps {
  spell: CustomSpell
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
}

export default function CustomSpellIcon({
  spell,
  size = 'md',
  className = '',
}: CustomSpellIconProps) {
  const spellId = spell.mrtSpellId ? String(spell.mrtSpellId) : ''

  // simcode doesn't have every spell yet so we resolve the icon through Wowhead for now
  const [resolved, setResolved] = useState<{ id: string; icon: string | null } | null>(null)
  const icon = resolved?.id === spellId ? resolved.icon : null

  useEffect(() => {
    if (!spellId) return
    let cancelled = false
    getWowheadInfo({ id: spellId, type: 'spell' })
      .then((data) => {
        if (!cancelled) setResolved({ id: spellId, icon: data.icon || null })
      })
      .catch(() => {
        if (!cancelled) setResolved({ id: spellId, icon: null })
      })
    return () => {
      cancelled = true
    }
  }, [spellId])

  // Get the first letter of the spell name for the icon
  const letter = spell.name.charAt(0).toUpperCase()

  const iconElement = icon ? (
    <WowheadClientIcon
      id={spellId}
      type="spell"
      name={spell.name}
      icon={icon}
      iconSize={20}
      noMargin
      noLink
    />
  ) : (
    <div
      className={` ${sizeMap[size]} ${spellId ? '' : className} relative flex aspect-square h-[20px] w-[20px] content-center items-center justify-center overflow-hidden border border-white/20 font-bold text-white shadow-sm`}
      style={{ backgroundColor: spell.color }}
      title={spellId ? undefined : spell.name}
    >
      <div className="">{letter}</div>
      <div className="pointer-events-none absolute inset-0" />
    </div>
  )

  if (!spellId) return iconElement

  // The href only exists so Wowhead attaches a tooltip
  return (
    <a
      href={buildWowheadUrl('spell', spellId, spell.name)}
      onClick={(e) => e.preventDefault()}
      className={`flex h-[20px] w-[20px] shrink-0 ${className}`}
    >
      {iconElement}
    </a>
  )
}
