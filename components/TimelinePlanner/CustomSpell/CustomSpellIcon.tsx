import React from 'react'
import { CustomSpell } from '@/lib/utils/customSpellStorage'

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
  // Get the first letter of the spell name for the icon
  const letter = spell.name.charAt(0).toUpperCase()

  return (
    <div
      className={` ${sizeMap[size]} ${className} relative flex aspect-square h-[20px] w-[20px] content-center items-center justify-center overflow-hidden border border-white/20 font-bold text-white shadow-sm`}
      style={{ backgroundColor: spell.color }}
      title={spell.name}
    >
      <div className="">{letter}</div>
      <div className="pointer-events-none absolute inset-0" />
    </div>
  )
}
