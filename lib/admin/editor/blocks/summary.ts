// What a component's rich-mode card shows about it.
import { formFromTag } from './form'
import type { TalentColor } from './registry'
import type { TagMatch } from './tags'

function truncate(s: string, n: number) {
  const flat = s.replace(/\s+/g, ' ').trim()
  return flat.length > n ? flat.slice(0, n - 1) + '…' : flat
}

/** One-line description of a component for its rich-mode card. */
export function summarizeBlock(match: TagMatch): string {
  const { values } = formFromTag(match)
  const str = (k: string) => String(values[k] ?? '').trim()
  switch (match.block.id) {
    case 'talents':
      return truncate(str('name') || 'Talent build', 80)
    case 'timeline': {
      const n = (values.spellIds as string[]).length
      return `${n} spell${n === 1 ? '' : 's'}${values.beta ? ' · beta' : ''}`
    }
    case 'planner':
      return 'Planner timeline'
    case 'youtube':
      return str('title') || str('id')
    case 'checkbox':
      return str('name')
    case 'wowhead':
      return str('name') || `${str('type')} ${str('id')}`
    case 'specnote':
      return (
        match.block.fields[0].options?.find((o) => o.value === str('spec'))?.label ?? str('spec')
      )
    case 'boss':
      return str('title') + (values.trash ? ' · trash' : '')
    default:
      return str('title')
  }
}

/** Secondary text shown after the summary */
export function blockDetail(match: TagMatch): string | undefined {
  const { values } = formFromTag(match)
  const str = (k: string) => String(values[k] ?? '').trim()
  // The toggle id defaults to the spell id, and is what [*id] conditions reference
  if (match.block.id === 'checkbox') return str('id') || str('spellId')
}

export interface BlockField {
  label: string
  value: string
  mono?: boolean
  /** Takes a double-width column */
  wide?: boolean
}

/** Labelled values shown in the body of a component's rich-mode card */
export function blockFields(match: TagMatch): BlockField[] {
  const { values } = formFromTag(match)
  const str = (k: string) => String(values[k] ?? '').trim()
  const option = (key: string) =>
    match.block.fields.find((f) => f.key === key)?.options?.find((o) => o.value === str(key))?.label
  const out: (BlockField | false)[] = []
  switch (match.block.id) {
    case 'talents': {
      const colors = (values.colors as TalentColor[]).reduce((n, c) => n + c.nodes.length, 0)
      const extra = (values.extra as string[]).length
      out.push(
        { label: 'Export string', value: str('talents') || '—', mono: true, wide: true },
        { label: 'Shows', value: option('forceTree') ?? 'All trees' },
        !!str('defaultTree') && { label: 'Default tab', value: str('defaultTree') },
        !!colors && { label: 'Highlighted', value: `${colors} node${colors === 1 ? '' : 's'}` },
        !!extra && { label: 'Extra', value: `${extra} node${extra === 1 ? '' : 's'}` }
      )
      break
    }
    case 'planner':
      out.push({ label: 'Share code', value: str('code') || '—', mono: true, wide: true })
      break
    case 'youtube': {
      const start = Number(str('start'))
      out.push(
        { label: 'Video', value: str('id') || '—', mono: true, wide: true },
        start > 0 && {
          label: 'Starts at',
          value: `${Math.floor(start / 60)}:${String(Math.floor(start % 60)).padStart(2, '0')}`,
        }
      )
      break
    }
  }
  return out.filter((f): f is BlockField => !!f)
}
