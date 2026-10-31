'use client'

export interface Segment<T extends string> {
  value: T
  label?: string
  title?: string
}

const SIZES = {
  // 26px + padding and border = 32px, the height of toolbar buttons
  sm: 'h-[26px] px-2.5 text-[.8rem]',
  md: 'h-8 px-3.5 text-[.85rem]',
}

/** A row of mutually exclusive toggle buttons (view mode, preview width…) */
export default function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
  size = 'sm',
  filled = true,
  keepFocus = false,
}: {
  /** Accessible name of the group */
  label: string
  options: readonly (T | Segment<T>)[]
  value: T
  onChange: (value: T) => void
  size?: keyof typeof SIZES
  /** Dark track behind the buttons */
  filled?: boolean
  /** Leave focus (and the editor selection) where it is when clicked */
  keepFocus?: boolean
}) {
  return (
    <div
      className={`inline-flex flex-shrink-0 rounded-xs border border-[#3a3a3a] p-0.5 ${filled ? 'bg-[#1a1a1a]' : ''}`}
      role="group"
      aria-label={label}
    >
      {options.map((o) => {
        const opt = typeof o === 'string' ? { value: o } : o
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onMouseDown={keepFocus ? (e) => e.preventDefault() : undefined}
            onClick={() => onChange(opt.value)}
            aria-pressed={active}
            title={opt.title}
            className={`${SIZES[size]} rounded-xs font-semibold transition-colors ${
              opt.label ? '' : 'capitalize'
            } ${active ? 'bg-[#3a3a3a] text-white' : 'text-white/50 hover:text-white'}`}
          >
            {opt.label ?? opt.value}
          </button>
        )
      })}
    </div>
  )
}
