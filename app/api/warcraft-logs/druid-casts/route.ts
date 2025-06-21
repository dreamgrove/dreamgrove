import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

// Define types for the API response
export interface CastInfo {
  id: string
  name: string
  timestamps: number[]
}

export interface ReportCastData {
  fight: number
  reportCode: string
  characterName: string
  serverName: string
  dps: number
  casts: CastInfo[]
}

// Utility function to get a Warcraft Logs token directly
async function getWarcraftLogsToken() {
  try {
    // Get client credentials from environment variables
    const clientId = process.env.WARCRAFT_LOGS_CLIENT_ID
    const clientSecret = process.env.WARCRAFT_LOGS_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      throw new Error('Warcraft Logs API credentials are not configured')
    }

    // Make the OAuth token request
    const tokenResponse = await axios.post(
      'https://www.warcraftlogs.com/oauth/token',
      new URLSearchParams({
        grant_type: 'client_credentials',
      }).toString(),
      {
        auth: {
          username: clientId,
          password: clientSecret,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )

    return tokenResponse.data.access_token
  } catch (error) {
    console.error('Error fetching Warcraft Logs API token directly:', error)
    throw new Error('Failed to get access token')
  }
}

// Execute a GraphQL query directly
async function executeWarcraftLogsQuery(query: string, variables = {}) {
  try {
    // Get token
    const token = await getWarcraftLogsToken()

    // Execute the query
    const graphqlEndpoint = 'https://www.warcraftlogs.com/api/v2/client'
    const response = await axios.post(
      graphqlEndpoint,
      { query, variables },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )

    return response.data
  } catch (error) {
    console.error('Error executing GraphQL query:', error)
    throw new Error('Failed to execute GraphQL query')
  }
}

// Utility functions for processing reports and casts
async function getActorIDFromReport(
  reportCode: string,
  playerName: string
): Promise<number | null> {
  try {
    const query = `
      query {
        reportData {
          report(code: "${reportCode}") {
            masterData {
              actors(type: "Player") {
                id
                name
                subType
              }
            }
          }
        }
      }
    `

    const response = await executeWarcraftLogsQuery(query)

    // Check if we have valid data
    if (!response?.data?.reportData?.report?.masterData?.actors) {
      console.error('Invalid response structure when fetching actors:', response)
      return null
    }

    // Find the actor with matching name and Druid class
    const actors = response.data.reportData.report.masterData.actors
    const matchingActor =
      actors.find((actor: any) => actor.name === playerName && actor.subType === 'Restoration') ||
      actors.find((actor: any) => actor.name === playerName && actor.subType === 'Druid') ||
      actors.find((actor: any) => actor.name === playerName)

    return matchingActor ? matchingActor.id : null
  } catch (error) {
    console.error('Error fetching actor ID:', error)
    return null
  }
}

async function getSpellCasts(
  reportCode: string,
  fightID: number,
  actorID: number,
  spellsToTrack: { id: string; spellId: number; name: string }[]
): Promise<{ casts: any[]; fightStartTime: number }> {
  try {
    // Create filter expression for spells of interest
    const spellIDs = spellsToTrack.map((spell) => spell.spellId).join(' or ability.id = ')
    const filterExpression = `ability.id = ${spellIDs}`

    // Make sure fightID and actorID are valid numbers
    if (!fightID || !actorID) {
      console.error('Invalid fightID or actorID:', { fightID, actorID })
      return { casts: [], fightStartTime: 0 }
    }

    // First, get the fight information to get the startTime
    const fightQuery = `
      query {
        reportData {
          report(code: "${reportCode}") {
            fights(fightIDs: [${fightID}]) {
              startTime
              endTime
            }
          }
        }
      }
    `

    const fightResponse = await executeWarcraftLogsQuery(fightQuery)
    const fightStartTime = fightResponse?.data?.reportData?.report?.fights?.[0]?.startTime || 0

    // Then get the spell casts
    const query = `
      query {
        reportData {
          report(code: "${reportCode}") {
            events(
              fightIDs: [${fightID}],
              dataType: Casts,
              sourceID: ${actorID},
              filterExpression: "${filterExpression}",
              limit: 10000
            ) {
              data
            }
          }
        }
      }
    `

    const response = await executeWarcraftLogsQuery(query)

    // Check if we have valid data
    if (!response?.data?.reportData?.report?.events?.data) {
      console.error('Invalid response structure:', response)
      return { casts: [], fightStartTime }
    }

    // Return the data with the fight start time
    return {
      casts: response.data.reportData.report.events.data,
      fightStartTime: fightStartTime,
    }
  } catch (error) {
    console.error('Error fetching spell casts:', error)
    return { casts: [], fightStartTime: 0 }
  }
}

// Format cast data to the required structure
function formatCasts(
  data: any,
  spellsToTrack: { id: string; spellId: number; name: string }[]
): any[] {
  // Group casts by spell ID
  const castsBySpell: Record<number, any> = {}

  // Check if we have valid data
  if (!data || !data.casts) {
    return []
  }

  const { casts, fightStartTime } = data

  // Initialize with spells of interest
  spellsToTrack.forEach((spell) => {
    castsBySpell[spell.spellId] = {
      id: spell.id,
      name: spell.name,
      timestamps: [],
    }
  })

  // Add cast timestamps, normalized to seconds from fight start
  if (Array.isArray(casts)) {
    casts.forEach((cast) => {
      const spellId = cast.abilityGameID
      if (castsBySpell[spellId]) {
        // Calculate seconds from fight start
        const relativeTimeMs = cast.timestamp - fightStartTime
        const secondsFromStart = parseFloat((relativeTimeMs / 1000).toFixed(1))
        castsBySpell[spellId].timestamps.push(secondsFromStart)
      }
    })
  }

  // Convert to array format
  return Object.values(castsBySpell).filter((spell) => spell.timestamps.length > 0)
}

export async function GET(request: NextRequest) {
  try {
    // Check for environment variables first
    if (!process.env.WARCRAFT_LOGS_CLIENT_ID || !process.env.WARCRAFT_LOGS_CLIENT_SECRET) {
      console.error('Missing Warcraft Logs API credentials in environment variables')
      return NextResponse.json(
        {
          error: 'Warcraft Logs API credentials are not configured',
          details: 'The server is missing required environment variables for API authentication',
        },
        { status: 500 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const encounterId = Number(searchParams.get('encounterId') || 3009) // Default to Vexie
    const raidId = Number(searchParams.get('raidId') || 42)
    const difficulty = Number(searchParams.get('difficulty') || 5) // Default to Mythic
    const maxReports = Number(searchParams.get('maxReports') || 3)
    const rankingsPage = 1 // First page of rankings

    // Spells to track
    /*const spellsToTrack = [
      { id: 'ca', spellId: 194223, name: 'Celestial Alignment' },
      { id: 'fon', spellId: 205636, name: 'Force of Nature' },
      { id: 'convoke', spellId: 391528, name: 'Convoke the Spirits' },
    ]*/

    const spellsToTrack = [
      {
        id: 'flourish',
        spellId: 197721,
        name: 'Flourish',
      },
      {
        id: 'gg',
        name: 'Grove Guardians',
        spellId: 102693,
      },
      {
        id: 'tranq',
        spellId: 740,
        name: 'Tranquility',
      },
    ]

    // Fetch Balance Druid rankings
    const rankingsQuery = `
      query {
        worldData {
          encounter(id: ${encounterId}) {
            name
            characterRankings(
              className: "Druid",
              specName: "Restoration",
              difficulty: ${difficulty},
              metric: hps,
              page: ${rankingsPage}
            )
          }
        }
      }
    `

    const response = await executeWarcraftLogsQuery(rankingsQuery)

    // Extract and process the rankings data
    if (!response?.data?.worldData?.encounter?.characterRankings?.rankings) {
      console.error('Invalid rankings data structure:', response)
      return NextResponse.json(
        {
          error: 'Failed to get rankings data',
          details: 'The API response structure did not contain the expected data',
        },
        { status: 500 }
      )
    }

    const rankings = response.data.worldData.encounter.characterRankings.rankings
    const encounterName = response.data.worldData.encounter.name
    const reportsToProcess = rankings.slice(0, maxReports)

    // Fetch casts for each report
    const castsResults: ReportCastData[] = []

    for (let i = 0; i < reportsToProcess.length; i++) {
      const ranking = reportsToProcess[i]
      try {
        // Make sure we have all the required data
        if (!ranking.report?.code) {
          console.warn('Skipping report - missing report code:', {
            playerName: ranking.name || 'Unknown',
            server: ranking.server?.name || ranking.server || 'Unknown Server',
            hasReport: !!ranking.report,
            reportData: ranking.report,
          })
          continue
        }

        // Check for fightID in both possible locations
        const fightID = ranking.fightID || ranking.report?.fightID
        if (!fightID) {
          console.warn('Skipping report - missing fightID:', {
            playerName: ranking.name || 'Unknown',
            server: ranking.server?.name || ranking.server || 'Unknown Server',
            reportCode: ranking.report?.code,
            reportObj: ranking.report,
          })
          continue
        }

        // Check for actorID in multiple possible locations
        const actorID =
          ranking.actorID ||
          ranking.report?.actorID ||
          ranking.id ||
          ranking.character?.id ||
          ranking.player?.id ||
          (ranking.report?.events?.actors &&
            ranking.report.events.actors.find((a: any) => a.name === ranking.name)?.id)

        // If still can't find actorID, try to fetch it from the report
        if (!actorID) {
          try {
            // Fetch the actorID directly from the report
            const fetchedActorID = await getActorIDFromReport(ranking.report.code, ranking.name)

            if (fetchedActorID) {
              // Continue processing with the fetched actorID
              const castsData = await getSpellCasts(
                ranking.report.code,
                fightID,
                fetchedActorID,
                spellsToTrack
              )

              // Make sure server info exists
              const serverName =
                ranking.server && typeof ranking.server === 'object'
                  ? ranking.server.name
                  : ranking.server || 'Unknown Server'

              // Format result
              castsResults.push({
                fight: i + 1,
                reportCode: ranking.report.code,
                characterName: ranking.name || 'Unknown Player',
                serverName,
                dps: Math.round(ranking.amount || 0),
                casts: formatCasts(castsData, spellsToTrack),
              })

              continue // Skip the warning and move to next report
            }
          } catch (error) {
            console.error('Error trying to fetch actorID:', error)
          }

          // If we get here, we couldn't find the actorID
          console.warn('Skipping report - missing actorID:', {
            playerName: ranking.name || 'Unknown',
            server: ranking.server?.name || ranking.server || 'Unknown Server',
            reportCode: ranking.report?.code,
            fightID: fightID,
            rankingKeys: Object.keys(ranking),
          })
          continue
        }

        const reportCode = ranking.report.code

        // Get spell casts for this player in this fight
        const castsData = await getSpellCasts(reportCode, fightID, actorID, spellsToTrack)

        // Make sure server info exists
        const serverName =
          ranking.server && typeof ranking.server === 'object'
            ? ranking.server.name
            : ranking.server || 'Unknown Server'

        // Format result
        castsResults.push({
          fight: i + 1,
          reportCode,
          characterName: ranking.name || 'Unknown Player',
          serverName,
          dps: Math.round(ranking.amount || 0),
          casts: formatCasts(castsData, spellsToTrack),
        })
      } catch (error) {
        console.error(`Error processing report:`, error)
      }
    }

    // Calculate summary statistics
    const summaryStats = spellsToTrack.map((spell) => {
      // Calculate stats for this spell
      const totalCasts = castsResults.reduce((sum, report) => {
        const spellData = report.casts.find((s: any) => s.id === spell.id)
        return sum + (spellData ? spellData.timestamps.length : 0)
      }, 0)

      const averageCasts =
        castsResults.length > 0 ? parseFloat((totalCasts / castsResults.length).toFixed(2)) : 0

      return {
        id: spell.id,
        name: spell.name,
        totalCasts,
        averageCastsPerFight: averageCasts,
      }
    })

    // Return the final data
    return NextResponse.json({
      encounter: {
        id: encounterId,
        name: encounterName,
      },
      difficulty,
      reportsAnalyzed: castsResults.length,
      spellCasts: castsResults,
      summary: summaryStats,
    })
  } catch (error: any) {
    console.error('Error processing druid casts:', error)
    return NextResponse.json(
      {
        error: 'Failed to process druid casts',
        details: error?.message || 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
      },
      { status: 500 }
    )
  }
}
