'use client'

import Image from 'next/image'
import { SPECS, type SpecId } from '@/data/specs'
import { SPEC_ICONS } from '@/components/spec/specIcons'
import logo from '../../../public/static/images/logo.png'

const TILE =
  'flex h-9 min-w-0 items-center justify-center gap-1.5 rounded-xs px-1.5 text-[.82rem] leading-none font-semibold transition-colors'

/** Multi-select grid of the four specs, plus an optional "General" (no spec) tile */
export default function SpecTiles({
  value,
  onChange,
  general = false,
  className = 'grid-cols-2',
}: {
  value: SpecId[]
  onChange: (specs: SpecId[]) => void
  general?: boolean
  /** Grid column classes */
  className?: string
}) {
  const toggle = (id: SpecId) =>
    onChange(value.includes(id) ? value.filter((s) => s !== id) : [...value, id])

  return (
    <div className={`grid gap-1 rounded-xs border border-dg-line bg-[#242424] p-1 ${className}`}>
      {SPECS.map((s) => {
        const on = value.includes(s.id)
        return (
          <button
            key={s.id}
            type="button"
            aria-pressed={on}
            onClick={() => toggle(s.id)}
            className={`${TILE} ${on ? 'text-white' : 'text-white/50 hover:text-white'}`}
            style={on ? { background: `${s.color}33` } : undefined}
          >
            <Image
              src={SPEC_ICONS[s.id]}
              alt=""
              width={16}
              height={16}
              className={`h-4 w-4 flex-shrink-0 rounded-xs object-cover ${on ? '' : 'opacity-50 grayscale'}`}
            />
            <span className="truncate">{s.id === 'resto' ? 'Resto' : s.name}</span>
          </button>
        )
      })}
      {general && (
        <button
          type="button"
          aria-pressed={value.length === 0}
          onClick={() => onChange([])}
          className={`${TILE} ${value.length === 0 ? 'bg-dg-line text-white' : 'text-white/50 hover:text-white'}`}
        >
          <Image
            src={logo}
            alt=""
            width={16}
            height={16}
            className={`h-4 w-4 flex-shrink-0 object-contain ${value.length === 0 ? '' : 'opacity-50 grayscale'}`}
          />
          <span className="truncate">General</span>
        </button>
      )}
    </div>
  )
}
