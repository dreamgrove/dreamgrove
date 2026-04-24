import { NextRequest, NextResponse } from 'next/server'
import axios, { AxiosError } from 'axios'
import type { BossAbilityCast, BossAbilitiesResponse } from '@/types/bossAbilities'

class WclError extends Error {
  constructor(
    public step: string,
    public status: number | null,
    public detail: string
  ) {
    super(`[${step}] ${status ?? '?'} ${detail}`)
  }
}

function wrapAxios(step: string, err: unknown): never {
  if (axios.isAxiosError(err)) {
    const ax = err as AxiosError
    const status = ax.response?.status ?? null
    const body = ax.response?.data
    const detail =
      typeof body === 'string'
        ? body.slice(0, 400)
        : body
          ? JSON.stringify(body).slice(0, 400)
          : ax.message
    throw new WclError(step, status, detail)
  }
  throw err
}

async function getWarcraftLogsToken(): Promise<string> {
  const clientId = process.env.WARCRAFT_LOGS_CLIENT_ID
  const clientSecret = process.env.WARCRAFT_LOGS_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('Warcraft Logs API credentials are not configured')
  }

  try {
    const tokenResponse = await axios.post(
      'https://www.warcraftlogs.com/oauth/token',
      new URLSearchParams({ grant_type: 'client_credentials' }).toString(),
      {
        auth: { username: clientId, password: clientSecret },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    )
    return tokenResponse.data.access_token
  } catch (e) {
    wrapAxios('oauth/token', e)
  }
}

async function executeWarcraftLogsQuery(
  step: string,
  token: string,
  query: string,
  variables: Record<string, unknown> = {}
) {
  try {
    const response = await axios.post(
      'https://www.warcraftlogs.com/api/v2/client',
      { query, variables },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )
    if (response.data?.errors?.length) {
      throw new WclError(
        step,
        200,
        `GraphQL error: ${JSON.stringify(response.data.errors).slice(0, 400)}`
      )
    }
    return response.data
  } catch (e) {
    if (e instanceof WclError) throw e
    wrapAxios(step, e)
  }
}

function emptyResponse(
  encounterId: number,
  difficulty: number,
  warning: string
): BossAbilitiesResponse {
  return {
    encounter: { id: encounterId, name: '' },
    difficulty,
    fightLengthSeconds: 0,
    reportCode: '',
    fightID: 0,
    abilities: [],
    warning,
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!process.env.WARCRAFT_LOGS_CLIENT_ID || !process.env.WARCRAFT_LOGS_CLIENT_SECRET) {
      return NextResponse.json(
        { error: 'Warcraft Logs API credentials are not configured' },
        { status: 500 }
      )
    }

    const encounterId = Number(request.nextUrl.searchParams.get('encounterId') || 3009)
    const difficulty = Number(request.nextUrl.searchParams.get('difficulty') || 5)

    if (!Number.isFinite(encounterId) || encounterId <= 0) {
      return NextResponse.json(emptyResponse(encounterId, difficulty, 'Invalid encounterId'))
    }

    const token = await getWarcraftLogsToken()

    // (a) Pick top-1 ranked report for this encounter.
    const rankingsQuery = `
      query($encounterId: Int!, $difficulty: Int!) {
        worldData {
          encounter(id: $encounterId) {
            name
            characterRankings(
              className: "Druid",
              specName: "Restoration",
              difficulty: $difficulty,
              metric: hps,
              page: 1
            )
          }
        }
      }
    `
    const rankingsResp = await executeWarcraftLogsQuery('rankings', token, rankingsQuery, {
      encounterId,
      difficulty,
    })

    const encounter = rankingsResp?.data?.worldData?.encounter
    const encounterName: string = encounter?.name ?? ''
    const rankings = encounter?.characterRankings?.rankings ?? []
    if (!rankings.length) {
      return NextResponse.json({
        ...emptyResponse(encounterId, difficulty, 'No rankings available'),
        encounter: { id: encounterId, name: encounterName },
      })
    }

    const topRanking = rankings[0]
    const reportCode: string | undefined = topRanking?.report?.code
    const fightID: number | undefined = topRanking?.fightID || topRanking?.report?.fightID
    if (!reportCode || !fightID) {
      return NextResponse.json({
        ...emptyResponse(encounterId, difficulty, 'Top ranking missing report code or fight ID'),
        encounter: { id: encounterId, name: encounterName },
      })
    }

    // (b) Fight bounds + boss actors.
    const fightActorsQuery = `
      query($code: String!, $fightID: Int!) {
        reportData {
          report(code: $code) {
            fights(fightIDs: [$fightID]) {
              id
              startTime
              endTime
              name
              encounterID
              enemyNPCs {
                id
                gameID
              }
            }
            masterData {
              actors(type: "NPC") {
                id
                name
                subType
                gameID
              }
              abilities {
                gameID
                name
                icon
                type
              }
            }
          }
        }
      }
    `
    const fightResp = await executeWarcraftLogsQuery('fight+actors', token, fightActorsQuery, {
      code: reportCode,
      fightID,
    })

    const report = fightResp?.data?.reportData?.report
    const fight = report?.fights?.[0]
    const actors: Array<{ id: number; name: string; subType: string; gameID: number }> =
      report?.masterData?.actors ?? []
    const abilityCatalog: Array<{ gameID: number; name: string }> =
      report?.masterData?.abilities ?? []
    const abilityNameById = new Map<number, string>()
    for (const a of abilityCatalog) {
      if (typeof a?.gameID === 'number' && a?.name) {
        abilityNameById.set(a.gameID, a.name)
      }
    }

    if (!fight || typeof fight.startTime !== 'number' || typeof fight.endTime !== 'number') {
      return NextResponse.json({
        ...emptyResponse(encounterId, difficulty, 'Fight data unavailable'),
        encounter: { id: encounterId, name: encounterName },
        reportCode,
        fightID,
      })
    }

    const enemyNPCIds = new Set<number>(
      (fight?.enemyNPCs ?? [])
        .map((n: { id?: number }) => n?.id)
        .filter((id: number | undefined): id is number => typeof id === 'number' && id > 0)
    )
    const bossActors = actors.filter(
      (a) => a.subType === 'Boss' && a.id > 0 && enemyNPCIds.has(a.id)
    )
    if (bossActors.length === 0) {
      return NextResponse.json({
        ...emptyResponse(encounterId, difficulty, 'No boss actors in report'),
        encounter: { id: encounterId, name: encounterName },
        reportCode,
        fightID,
        fightLengthSeconds: Math.round((fight.endTime - fight.startTime) / 1000),
      })
    }

    // (c) All enemy casts for this fight in one query; filter to boss actors client-side.
    const eventsQuery = `
      query($code: String!, $fightID: Int!, $startTime: Float!, $endTime: Float!) {
        reportData {
          report(code: $code) {
            events(
              fightIDs: [$fightID],
              dataType: Casts,
              hostilityType: Enemies,
              startTime: $startTime,
              endTime: $endTime,
              limit: 10000
            ) { data }
          }
        }
      }
    `
    const eventsResp = await executeWarcraftLogsQuery('events', token, eventsQuery, {
      code: reportCode,
      fightID,
      startTime: fight.startTime,
      endTime: fight.endTime,
    })
    const allEvents: Array<Record<string, any>> =
      eventsResp?.data?.reportData?.report?.events?.data ?? []
    const bossActorIds = new Set(bossActors.map((a) => a.id))
    const eventBatches = [allEvents.filter((e) => bossActorIds.has(Number(e?.sourceID)))]

    // Group by abilityGameID; union across multiple boss actors for multi-boss encounters.
    // Merge near-simultaneous casts (council-style fights where several boss actors cast
    // the same ability within a fraction of a second).
    const DEDUPE_WINDOW_S = 0.5
    const grouped = new Map<number, { name: string; timestamps: number[] }>()
    for (const batch of eventBatches) {
      if (!Array.isArray(batch)) continue
      for (const evt of batch) {
        if (evt?.type !== 'cast') continue
        const abilityId: number | undefined = evt?.abilityGameID
        if (!abilityId) continue
        const ts = (Number(evt.timestamp) - fight.startTime) / 1000
        if (!Number.isFinite(ts)) continue
        const rounded = Math.round(ts * 10) / 10
        const existing = grouped.get(abilityId)
        if (existing) {
          const lastTs = existing.timestamps[existing.timestamps.length - 1]
          if (rounded - lastTs < DEDUPE_WINDOW_S) continue
          existing.timestamps.push(rounded)
        } else {
          grouped.set(abilityId, {
            name: abilityNameById.get(abilityId) || `Ability ${abilityId}`,
            timestamps: [rounded],
          })
        }
      }
    }

    const abilities: BossAbilityCast[] = Array.from(grouped.entries())
      .map(([abilityId, { name, timestamps }]) => ({
        key: `boss-${abilityId}`,
        spellId: abilityId,
        name,
        timestamps: timestamps.slice().sort((a, b) => a - b),
      }))
      .filter((a) => a.timestamps.length > 0)
      .sort((a, b) => a.timestamps[0] - b.timestamps[0])

    const body: BossAbilitiesResponse = {
      encounter: { id: encounterId, name: encounterName },
      difficulty,
      fightLengthSeconds: Math.round((fight.endTime - fight.startTime) / 1000),
      reportCode,
      fightID,
      abilities,
    }
    return NextResponse.json(body)
  } catch (error: any) {
    const encounterId = Number(request.nextUrl.searchParams.get('encounterId') || 0)
    const difficulty = Number(request.nextUrl.searchParams.get('difficulty') || 5)
    if (error instanceof WclError) {
      console.error(
        `[boss-abilities] encounterId=${encounterId} step=${error.step} status=${error.status} detail=${error.detail}`
      )
      return NextResponse.json(
        emptyResponse(
          encounterId,
          difficulty,
          `Upstream error at ${error.step} (HTTP ${error.status ?? '?'})`
        )
      )
    }
    console.error('[boss-abilities] unexpected error:', error?.message || error)
    return NextResponse.json(emptyResponse(encounterId, difficulty, 'Upstream error'))
  }
}
