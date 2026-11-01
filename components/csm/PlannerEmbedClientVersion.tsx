'use client'

import React, { useMemo } from 'react'
import spellsData from '@/other/timelineSpells.json'
import WowheadClientVersion from './WowheadClientVersion'
import PlannerEmbedCore from '../PlannerEmbed/PlannerEmbedCore'
import { koSpellNames } from '../PlannerEmbed/koSpellNames'
import { decodeLoadout } from '@/lib/utils/loadoutCode'
import { SpellInfo } from '@/types/timeline'
import type { PageLocale } from '@/lib/pageLocale'

interface PlannerEmbedClientVersionProps {
  code: string
  children?: React.ReactNode
  locale?: PageLocale
}

// Client mirror of components/custom/PlannerEmbed.tsx for the admin live
// preview, where async server components cannot render. Wowhead names are
// fetched client-side via WowheadClientVersion instead of prerendered.
export default function PlannerEmbedClientVersion({
  code,
  children,
  locale,
}: PlannerEmbedClientVersionProps) {
  const spells: SpellInfo[] = useMemo(
    () =>
      spellsData.spells.map((spell) => ({
        ...spell,
        charges: spell.charges || 1,
        can_interrupt: spell.can_interrupt ?? true,
      })),
    []
  )

  const spellNames = useMemo(() => {
    const names: Record<number, React.ReactNode> = {}
    let usedSpellIds: number[] = []
    try {
      usedSpellIds = [...new Set(decodeLoadout(code).events.map((e) => e.spellId))]
    } catch {
      // Invalid code: the core renders the error state
      return names
    }
    for (const spellId of usedSpellIds) {
      const spell = spells.find((s) => s.spellId === spellId)
      if (!spell) continue
      names[spellId] = (
        <WowheadClientVersion
          type="spell"
          id={spellId}
          name={(locale === 'ko' && koSpellNames[spellId]) || spell.name}
          disabled={false}
        />
      )
    }
    return names
  }, [code, spells, locale])

  return (
    <PlannerEmbedCore code={code} spells={spells} spellNames={spellNames} locale={locale}>
      {children}
    </PlannerEmbedCore>
  )
}
