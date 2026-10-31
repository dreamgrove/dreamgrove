'use client'
import Icon from '@/components/Icon'
import { Suspense, useContext, useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { CheckboxContext } from '@/components/custom/CheckboxProvider'
import { SPECS } from '@/data/specs'
import RailDropdown from './RailDropdown'

const KEYS: string[] = SPECS.map((s) => s.checkboxKey)
const DPS_KEYS = ['Balance', 'Feral']

export const ALL_SPECS_CHECKED = Object.fromEntries(
  [...KEYS, 'DPS'].map((k) => [k, { checked: true, radioGroup: null }])
)

function Chips() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { checkboxMap, updateCheckbox } = useContext(CheckboxContext)
  const initialized = useRef(false)

  const selected = KEYS.filter((k) => checkboxMap[k]?.checked)
  const all = selected.length === KEYS.length

  const apply = (next: string[]) => {
    if (next.length === 0) next = KEYS
    KEYS.forEach((k) => updateCheckbox(k, next.includes(k), null))
    updateCheckbox(
      'DPS',
      next.some((k) => DPS_KEYS.includes(k)),
      null
    )
  }

  useEffect(() => {
    const roles = searchParams.get('roles')
    if (roles) apply(roles.split(',').filter((r) => KEYS.includes(r)))
    initialized.current = true
  }, [])

  useEffect(() => {
    if (!initialized.current) return
    const params = new URLSearchParams(window.location.search)
    if (all) params.delete('roles')
    else params.set('roles', selected.join(','))
    const qs = params.toString()
    window.history.replaceState(window.history.state, '', `${pathname}${qs ? `?${qs}` : ''}`)
  }, [all, selected.join(','), pathname])

  const toggle = (key: string) => {
    if (key === 'all') return apply(KEYS)
    if (all) return apply([key])
    apply(selected.includes(key) ? selected.filter((k) => k !== key) : [...selected, key])
  }

  const options = [
    { key: 'all', label: 'All specs', color: '#ffffff', pressed: all },
    ...SPECS.map((s) => ({
      key: s.checkboxKey,
      label: s.name,
      color: s.color,
      pressed: !all && selected.includes(s.checkboxKey),
    })),
  ]

  const rows = options.map((o) => (
    <button
      key={o.key}
      type="button"
      aria-pressed={o.pressed}
      onClick={() => toggle(o.key)}
      className={`flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-left text-[.98rem] transition-colors hover:bg-[#333] focus-visible:outline-2 focus-visible:outline-white ${
        o.pressed ? 'font-semibold text-white' : 'font-medium text-white/55'
      }`}
    >
      <Checkbox color={o.color} checked={o.pressed} />
      {o.label}
    </button>
  ))

  const chosen = options.filter((o) => o.pressed)

  return (
    <>
      <div className="hidden flex-col gap-0.5 lg:flex" role="group" aria-label="Show notes for">
        {rows}
      </div>
      <RailDropdown
        label="Show notes for"
        summary={
          <>
            <span className="flex flex-none gap-1">
              {chosen.map((o) => (
                <Checkbox key={o.key} color={o.color} checked />
              ))}
            </span>
            <span className="truncate">{chosen.map((o) => o.label).join(', ')}</span>
          </>
        }
      >
        {rows}
      </RailDropdown>
    </>
  )
}

function Checkbox({ color, checked }: { color: string; checked: boolean }) {
  return (
    <span
      aria-hidden
      style={{ ['--spec' as string]: color }}
      className={`grid size-4 flex-none place-items-center rounded-[4px] border-[1.5px] transition-colors ${
        checked
          ? 'border-[var(--spec)] bg-[var(--spec)] text-[#1f1f1f]'
          : 'border-white/30 text-transparent'
      }`}
    >
      <Icon name="checkThin" size={10} />
    </span>
  )
}

export default function SpecFilterChips() {
  return (
    <Suspense fallback={null}>
      <Chips />
    </Suspense>
  )
}
