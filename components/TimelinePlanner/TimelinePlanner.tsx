'use client'

import React, { useState, useEffect } from 'react'
import TimelineView from './TimelineView/TimelineView'
import { SpellInfo, PlayerAction } from '@/types/index'
import type { BossAbilitiesResponse } from '@/types/bossAbilities'
import { NextStep } from 'nextstepjs'
import { steps } from '@/lib/steps'
import TutorialCard from './TutorialCard'

// The tour step that explains cast rows drops these example casts onto the
// timeline. They are resolved against the live spell list so they can't drift
// from other/timelineSpells.json.
const TUTORIAL_CASTS_STEP = 6
const TUTORIAL_CASTS = [
  { spellId: 102693, instant: 0 }, // Grove Guardians
  { spellId: 197721, instant: 1.7 }, // Flourish
  { spellId: 391528, instant: 20.8 }, // Convoke the Spirits
  { spellId: 102693, instant: 35.7 },
  { spellId: 102693, instant: 44.2 },
  { spellId: 102693, instant: 45.7 },
]

function buildTutorialCasts(spells: SpellInfo[]): PlayerAction[] {
  return TUTORIAL_CASTS.flatMap(({ spellId, instant }) => {
    const spell = spells.find((s) => s.spellId === spellId)
    return spell ? [{ spell, instant, id: crypto.randomUUID() }] : []
  })
}

interface TimelinePlannerProps {
  spells: SpellInfo[]
  wowheadMap: Record<string, React.ReactNode>
  wowheadNameMap: Record<string, React.ReactNode>
}

export default function TimelinePlanner({
  spells = [],
  wowheadMap = {},
  wowheadNameMap = {},
}: TimelinePlannerProps) {
  const [currentEncounterId, setCurrentEncounterId] = useState('empty')
  const [tutorialSpells, setTutorialSpells] = useState<PlayerAction[]>([])
  const [bossAbilitiesByEncounter, setBossAbilitiesByEncounter] = useState<
    Record<string, BossAbilitiesResponse | null>
  >({})

  const bossAbilities =
    currentEncounterId === 'empty' ? null : (bossAbilitiesByEncounter[currentEncounterId] ?? null)
  const bossAbilitiesLoading =
    currentEncounterId !== 'empty' && bossAbilitiesByEncounter[currentEncounterId] === undefined

  useEffect(() => {
    if (currentEncounterId === 'empty') return
    if (bossAbilitiesByEncounter[currentEncounterId] !== undefined) return
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(
          `/api/warcraft-logs/boss-abilities?encounterId=${encodeURIComponent(currentEncounterId)}`
        )
        const data = res.ok ? ((await res.json()) as BossAbilitiesResponse) : null
        if (!cancelled) {
          setBossAbilitiesByEncounter((prev) => ({ ...prev, [currentEncounterId]: data }))
        }
      } catch (e) {
        console.warn('Boss abilities fetch failed', e)
        if (!cancelled) {
          setBossAbilitiesByEncounter((prev) => ({ ...prev, [currentEncounterId]: null }))
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [currentEncounterId])

  const clearTutorialSpells = () => setTutorialSpells([])

  const onNextStepStepChange = (step: number) => {
    if (step === TUTORIAL_CASTS_STEP) {
      setTutorialSpells((prev) => (prev.length > 0 ? prev : buildTutorialCasts(spells)))
    }
  }
  return (
    <NextStep
      shadowRgb={'0, 0, 0'}
      onComplete={clearTutorialSpells}
      shadowOpacity="0.6"
      steps={steps}
      cardTransition={{
        ease: 'easeInOut',
        duration: 0.5,
      }}
      cardComponent={TutorialCard}
      onStepChange={onNextStepStepChange}
      onSkip={clearTutorialSpells}
    >
      <div className="timeline border-radius-4px relative flex h-full flex-col overflow-x-clip bg-dg-panel pb-12">
        <div className="flex h-full flex-1 flex-col pr-4 pl-8">
          <TimelineView
            spells={spells}
            wowheadMap={wowheadMap}
            wowheadNameMap={wowheadNameMap}
            tutorialSpells={tutorialSpells}
            currentEncounterId={currentEncounterId}
            onEncounterChange={setCurrentEncounterId}
            bossAbilities={bossAbilities}
            bossAbilitiesLoading={bossAbilitiesLoading}
          />
        </div>
      </div>
    </NextStep>
  )
}
