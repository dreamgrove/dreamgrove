import React from 'react'
import { CustomSpell } from '../../lib/utils/customSpellStorage'

interface CustomSpellIconProps {
  spell: CustomSpell
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-10 h-10 text-base',
}

export default function CustomSpellIcon({
  spell,
  size = 'md',
  className = '',
}: CustomSpellIconProps) {
  // Get the first letter of the spell name for the icon
  const letter = spell.name.charAt(0).toUpperCase()

  return (
    <div
      className={` ${sizeMap[size]} ${className} relative flex items-center justify-center overflow-hidden rounded-sm border border-black/20 font-bold text-white shadow-sm`}
      style={{ backgroundColor: spell.color }}
      title={spell.name}
    >
      {letter}
      {/* Add a subtle gradient overlay for depth */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
    </div>
  )
}

// Component for spell buttons/selection
export function CustomSpellButton({
  spell,
  onClick,
  className = '',
}: {
  spell: CustomSpell
  onClick?: () => void
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      className={` ${className} flex items-center gap-2 rounded-md border border-neutral-600/30 bg-neutral-800/50 p-2 text-sm text-white transition-all duration-200 hover:border-neutral-500/50 hover:bg-neutral-700/50`}
      title={spell.name}
    >
      <CustomSpellIcon spell={spell} size="sm" />
      <span className="truncate">{spell.name}</span>
    </button>
  )
}
