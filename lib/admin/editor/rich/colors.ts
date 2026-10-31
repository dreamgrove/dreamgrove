import { TEXT_COLORS } from '@/lib/admin/palette'
import { classNames } from './html'

// --- Colours -----------------------------------------------------------------

// Approximate Tailwind palette for `text-*` / `bg-*` classes in inline HTML
const TW_COLORS: Record<string, string> = {
  red: '#ef4444',
  orange: '#f97316',
  amber: '#f59e0b',
  yellow: '#eab308',
  lime: '#84cc16',
  green: '#22c55e',
  emerald: '#10b981',
  teal: '#14b8a6',
  cyan: '#06b6d4',
  sky: '#0ea5e9',
  blue: '#3b82f6',
  indigo: '#6366f1',
  violet: '#8b5cf6',
  purple: '#a855f7',
  fuchsia: '#d946ef',
  pink: '#ec4899',
  rose: '#f43f5e',
  gray: '#9ca3af',
  grey: '#9ca3af',
  slate: '#94a3b8',
  zinc: '#a1a1aa',
  neutral: '#a3a3a3',
  stone: '#a8a29e',
  white: '#ffffff',
  black: '#000000',
}

export function classColor(attrs: string, prefix: 'text' | 'bg'): string | undefined {
  for (const c of classNames(attrs)) {
    const m = new RegExp(`^${prefix}-([a-z]+)(?:-\\d{2,3})?$`).exec(c)
    if (m && TW_COLORS[m[1]]) return TW_COLORS[m[1]]
  }
  if (prefix === 'text') {
    const style = /[{"';\s]color:\s*['"]?(#[0-9a-fA-F]{3,8}|[a-z]+)/.exec(attrs)
    if (style) return style[1]
  }
  return undefined
}

// Per-type hue for card badges
export const BLOCK_HUES: Record<string, string> = {
  talents: '#b9a6f0',
  timeline: '#e6b16a',
  planner: '#4fc9ae',
  youtube: '#8ec5ff',
  image: '#8ec5ff',
}

export const CALLOUTS: Record<string, string> = {
  note: TEXT_COLORS.blue,
  tip: TEXT_COLORS.green,
  important: TEXT_COLORS.purple,
  warning: TEXT_COLORS.yellow,
  caution: TEXT_COLORS.red,
}

/** A `:name[…]` colour, Tailwind colour name or hex as CSS */
export function colorFor(name: string) {
  if (name.startsWith('#')) return name
  const n = name.toLowerCase()
  return (TEXT_COLORS as Record<string, string>)[n] ?? TW_COLORS[n] ?? n
}
