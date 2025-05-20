import spellsData from '../../other/timelineSpells.json'
import TimelinePlanner from './TimelinePlanner'
import Wowhead from '../custom/Wowhead'
import { GET } from '../../app/api/warcraft-logs/druid-casts/route'
import { NextRequest } from 'next/server'

async function fetchDruidCasts() {
  const raidId = 42
  const vexieEncounterId = 3009 // Vexie and the Geargrinders
  const mythicDifficulty = 5
  const maxReportsToProcess = 3

  try {
    // Create a mock request to pass to the API handler
    const url = new URL('https://localhost/api/warcraft-logs/druid-casts')
    url.searchParams.set('raidId', raidId.toString())
    url.searchParams.set('encounterId', vexieEncounterId.toString())
    url.searchParams.set('difficulty', mythicDifficulty.toString())
    url.searchParams.set('maxReports', maxReportsToProcess.toString())

    const mockRequest = new NextRequest(url)

    // Call the API route handler directly
    const response = await GET(mockRequest)

    if (!response.ok) {
      throw new Error('Failed to fetch data')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching druid casts:', error)
    return null
  }
}

// Function to calculate average timestamps for each position across fights
function calculateAverageTimestamps(spellCastsData: any) {
  // Initialize an object to store averages for each spell
  const averageTimestamps: Record<string, number[]> = {}

  if (!spellCastsData || !spellCastsData.spellCasts || spellCastsData.spellCasts.length === 0) {
    return averageTimestamps
  }

  // Get all unique spell IDs from the data
  const spellIds = spellCastsData.summary.map((spell: any) => spell.id)

  // For each spell ID
  spellIds.forEach((spellId: string) => {
    // Get all casts for this spell across all fights
    const allSpellCasts = spellCastsData.spellCasts.map((fight: any) => {
      const spellData = fight.casts.find((cast: any) => cast.id === spellId)
      return spellData ? spellData.timestamps : []
    })

    // Find the maximum number of casts for this spell in any fight
    const maxCastsCount = Math.max(...allSpellCasts.map((casts: any) => casts.length))

    // Initialize averages array for this spell
    const averages: number[] = []

    // For each cast position (0, 1, 2, ...)
    for (let i = 0; i < maxCastsCount; i++) {
      // Collect timestamps for this position across all fights
      const timestampsAtPosition = allSpellCasts
        .filter((casts: any) => i < casts.length) // Only include fights where this cast position exists
        .map((casts: any) => casts[i])

      // Calculate average if we have any timestamps
      if (timestampsAtPosition.length > 0) {
        const sum = timestampsAtPosition.reduce((acc: number, val: number) => acc + val, 0)
        const avg = parseFloat((sum / timestampsAtPosition.length).toFixed(1))
        averages.push(avg)
      }
    }

    // Store averages for this spell
    averageTimestamps[spellId] = averages
  })

  return averageTimestamps
}

export default async function TimelinePlannerServer() {
  // Fetch druid casts data
  const druidCastsData = true
    ? {}
    : {
        encounter: {
          id: 3009,
          name: 'Vexie and the Geargrinders',
        },
        difficulty: 5,
        reportsAnalyzed: 3,
        spellCasts: [
          {
            fight: 1,
            reportCode: 'Mpq6Z2a8DLvP3hXA',
            characterName: 'Canyonero',
            serverName: 'Eredar',
            dps: 4021835,
            casts: [
              {
                id: 'ca',
                name: 'Celestial Alignment',
                timestamps: [3.8, 103.1, 133.3, 247.7, 289.4],
              },
              {
                id: 'fon',
                name: 'Force of Nature',
                timestamps: [3.8, 37.5, 103, 133.5, 182.5, 247.7, 279.3],
              },
              {
                id: 'convoke',
                name: 'Convoke the Spirits',
                timestamps: [7.1, 136.5, 252.5],
              },
            ],
          },
          {
            fight: 2,
            reportCode: 'KdZyFQPvnwMafprh',
            characterName: '南绅',
            serverName: '凤凰之神',
            dps: 3961680,
            casts: [
              {
                id: 'ca',
                name: 'Celestial Alignment',
                timestamps: [3, 33.8, 124.8, 258.3, 290.9],
              },
              {
                id: 'fon',
                name: 'Force of Nature',
                timestamps: [2.7, 33.4, 82.9, 124.5, 174.4, 214.9, 257.8],
              },
              {
                id: 'convoke',
                name: 'Convoke the Spirits',
                timestamps: [4.3, 128.3, 262.1],
              },
            ],
          },
          {
            fight: 3,
            reportCode: 'YfGpV43Jv2n1KzcW',
            characterName: '씹폴',
            serverName: '아즈샤라',
            dps: 3952033,
            casts: [
              {
                id: 'ca',
                name: 'Celestial Alignment',
                timestamps: [2, 120.8, 151.6, 286],
              },
              {
                id: 'fon',
                name: 'Force of Nature',
                timestamps: [1.6, 35.8, 120.3, 151.4, 199.5, 285.7],
              },
              {
                id: 'convoke',
                name: 'Convoke the Spirits',
                timestamps: [3.6, 123.6, 290],
              },
            ],
          },
        ],
        summary: [
          {
            id: 'ca',
            name: 'Celestial Alignment',
            totalCasts: 14,
            averageCastsPerFight: 4.67,
          },
          {
            id: 'fon',
            name: 'Force of Nature',
            totalCasts: 20,
            averageCastsPerFight: 6.67,
          },
          {
            id: 'convoke',
            name: 'Convoke the Spirits',
            totalCasts: 9,
            averageCastsPerFight: 3,
          },
        ],
      }
  // Calculate average timestamps
  const averageTimestampsBySpell = druidCastsData ? calculateAverageTimestamps(druidCastsData) : {}

  const toSkipWowhead = false
  // Prerender all Wowhead components for cast blocks
  const prerenderedWowheads = spellsData.spells.map((spell) => {
    const component = toSkipWowhead ? (
      <> </>
    ) : (
      <Wowhead
        type="spell"
        id={spell.spellId}
        name={spell.name}
        disabled={true}
        ellipsis={true}
        showLabel={false}
        iconSize={23}
      />
    )
    return [spell.spellId, component] as const
  })

  // Prerender Wowhead for spell name column (no icon, disabled)
  const prerenderedWowheadNames = spellsData.spells.map((spell) => {
    const component = toSkipWowhead ? (
      <></>
    ) : (
      <Wowhead
        type="spell"
        id={spell.spellId}
        name={spell.name}
        noIcon={false}
        disabled={false}
        ellipsis={true}
      />
    )
    return [spell.spellId, component] as const
  })

  const wowheadIcons = Object.fromEntries(prerenderedWowheads)
  const wowheadIconNames = Object.fromEntries(prerenderedWowheadNames)

  return (
    <TimelinePlanner
      spells={spellsData.spells.map((spell) => ({
        ...spell,
        charges: spell.charges || 1,
      }))}
      wowheadMap={wowheadIcons}
      wowheadNameMap={wowheadIconNames}
      wowheadMarkerMap={wowheadIcons}
      averageTimestamps={averageTimestampsBySpell}
    />
  )
}
