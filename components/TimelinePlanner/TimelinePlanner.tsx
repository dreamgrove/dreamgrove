'use client'

import React, { useState, useEffect } from 'react'
import TimelineView from './TimelineView/TimelineView'
import FightSelector from './FightSelector'
import { TimelineLengthProvider } from './Providers/TimelineLengthProvider'
import { SpellInfo, PlayerAction } from '@/types/index'
import { NextStep } from 'nextstepjs'
import { steps } from '@/lib/steps'
import TutorialCard from './TutorialCard'

interface TimelinePlannerProps {
  spells: SpellInfo[]
  wowheadMap: Record<string, React.ReactNode>
  wowheadNameMap: Record<string, React.ReactNode>
  wowheadMarkerMap?: Record<string, React.ReactNode>
  averageTimestamps?: Record<string, number[]>
}

export default function TimelinePlanner({
  spells = [],
  wowheadMap = {},
  wowheadNameMap = {},
  wowheadMarkerMap = {},
  averageTimestamps = {},
}: TimelinePlannerProps) {
  const initialTotalLength = 240
  const initialViewLength = 250
  const initialMarkerSpacing = 10
  const [currentEncounterId, setCurrentEncounterId] = useState('empty')
  const [tutorialSpells, setTutorialSpells] = useState<PlayerAction[]>([])

  const onComplete = (tourName: string | null) => {
    setTutorialSpells([])
  }

  const onSkip = (step: number, tourName: string | null) => {
    setTutorialSpells([])
  }

  const onNextStepStepChange = (step: number, tourName: string | null) => {
    if (step === 6) {
      const example: PlayerAction[] = [
        {
          spell: {
            name: 'Grove Guardians',
            spellId: 102693,
            can_interrupt: false,
            channel_duration: 0,
            effect_duration: 15,
            cooldown: 30,
            charges: 3,
            specs: ['resto'],
          },
          instant: 0,
          id: '2675be14-dae5-4827-a22c-9b48b0da07d0',
        },
        {
          spell: {
            spellId: 197721,
            name: 'Flourish',
            channel_duration: 0,
            effect_duration: 8,
            cooldown: 60,
            charges: 1,
            specs: ['resto'],
          },
          instant: 1.7187165775401034,
          id: 'bd4c1d9d-e7d5-4f76-bd60-500001ecb1c5',
        },
        {
          spell: {
            spellId: 391528,
            name: 'Convoke the Spirits',
            channel_duration: 4,
            effect_duration: 4,
            cooldown: 120,
            channeled: true,
            specs: ['balance', 'resto', 'feral'],
            charges: 1,
          },
          instant: 20.83155080213904,
          id: 'a2d4ddb0-0cd6-45d2-8bd0-14911a4b1819',
        },
        {
          spell: {
            name: 'Grove Guardians',
            spellId: 102693,
            channel_duration: 0,
            can_interrupt: false,
            effect_duration: 15,
            cooldown: 30,
            charges: 3,
            specs: ['resto'],
          },
          instant: 35.727272727272734,
          id: '71a0438d-de77-4528-b0a6-eeac1aafcfe1',
        },
        {
          spell: {
            name: 'Grove Guardians',
            spellId: 102693,
            channel_duration: 0,
            can_interrupt: false,
            effect_duration: 15,
            cooldown: 30,
            charges: 3,
            specs: ['resto'],
          },
          instant: 44.18716577540107,
          id: 'c8b9e196-c3a0-4751-9feb-07011b6b1b8b',
        },
        {
          spell: {
            name: 'Grove Guardians',
            spellId: 102693,
            channel_duration: 0,
            effect_duration: 15,
            can_interrupt: false,
            cooldown: 30,
            charges: 3,
            specs: ['resto'],
          },
          instant: 45.7,
          id: 'e39489e7-548d-44c7-879e-e56cdc1be5a5',
        },
      ]

      setTutorialSpells((prev) => (prev.length > 0 ? prev : example))
    }
  }
  return (
    <NextStep
      shadowRgb={'0, 0, 0'}
      onComplete={onComplete}
      shadowOpacity="0.6"
      steps={steps}
      cardTransition={{
        ease: 'easeInOut',
        duration: 0.5,
      }}
      cardComponent={TutorialCard}
      onStepChange={onNextStepStepChange}
      onSkip={onSkip}
    >
      <div className="border-radius-4px relative flex h-full flex-col overflow-x-clip bg-[#2a2a2a] pb-12">
        {false && (
          <div className="mb-4 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 md:space-x-4">
            <FightSelector
              currentEncounterId={currentEncounterId}
              onEncounterChange={setCurrentEncounterId}
            />
          </div>
        )}

        <TimelineLengthProvider
          initialTotalLength={initialTotalLength}
          initialViewLength={initialViewLength}
          initialMarkerSpacing={initialMarkerSpacing}
        >
          <div className="flex h-full flex-1 flex-col pr-4 pl-8">
            <TimelineView
              spells={spells}
              wowheadMap={wowheadMap}
              wowheadNameMap={wowheadNameMap}
              tutorialSpells={tutorialSpells}
              wowheadMarkerMap={wowheadMarkerMap}
              averageTimestamps={averageTimestamps}
              currentEncounterId={currentEncounterId}
            />
          </div>
        </TimelineLengthProvider>
      </div>
    </NextStep>
  )
}
