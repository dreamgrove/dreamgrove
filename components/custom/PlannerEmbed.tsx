import React from 'react'
import spellsData from '@/other/timelineSpells.json'
import Wowhead from './Wowhead'
import PlannerEmbedCore from '../PlannerEmbed/PlannerEmbedCore'
import { koSpellNames } from '../PlannerEmbed/koSpellNames'
import { decodeLoadout } from '@/lib/utils/loadoutCode'
import { SpellInfo } from '@/types/timeline'
import type { PageLocale } from '@/lib/pageLocale'

interface PlannerEmbedProps {
  code: string
  children?: React.ReactNode
  locale?: PageLocale
}

/**
 * Read-only timeline embed for guides. Takes the loadout code produced by the
 * planner's Export button and renders the simulated timeline.
 */
export default function PlannerEmbed({ code, children, locale }: PlannerEmbedProps) {
  const spells: SpellInfo[] = spellsData.spells.map((spell) => ({
    ...spell,
    charges: spell.charges || 1,
    can_interrupt: spell.can_interrupt ?? true,
  }))

  let usedSpellIds: number[] = []
  try {
    usedSpellIds = [...new Set(decodeLoadout(code).events.map((e) => e.spellId))]
  } catch {
    // Invalid code: the core renders the error state
  }

  const spellNames: Record<number, React.ReactNode> = {}
  for (const spellId of usedSpellIds) {
    const spell = spells.find((s) => s.spellId === spellId)
    if (!spell) continue
    spellNames[spellId] = (
      <Wowhead
        type="spell"
        id={spellId}
        name={(locale === 'ko' && koSpellNames[spellId]) || spell.name}
        noIcon={false}
        fill={true}
        disabled={false}
        ellipsis={true}
        align="center"
        textColor="#ffffff"
      />
    )
  }

  return (
    // locale only on Korean pages, so English pages serialize the same props as before
    <PlannerEmbedCore
      code={code}
      spells={spells}
      spellNames={spellNames}
      {...(locale === 'ko' && { locale })}
    >
      {children}
    </PlannerEmbedCore>
  )
}
