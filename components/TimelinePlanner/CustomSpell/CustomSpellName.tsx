import { CustomSpell } from '@/lib/utils/customSpellStorage'
import { buildWowheadUrl } from '@/lib/wowhead/urls'
import type { PageLocale } from '@/lib/pageLocale'

interface CustomSpellNameProps {
  spell: CustomSpell
  locale?: PageLocale
  className?: string
}

/** A custom spell's name, linked to Wowhead when it was given a spell id */
export default function CustomSpellName({ spell, locale, className = '' }: CustomSpellNameProps) {
  if (!spell.mrtSpellId) return <span className={className}>{spell.name}</span>

  return (
    <a
      href={buildWowheadUrl('spell', String(spell.mrtSpellId), spell.name, false, locale)}
      className={`hover:underline ${className}`}
    >
      {spell.name}
    </a>
  )
}
