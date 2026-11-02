import { NextRequest, NextResponse } from 'next/server'
import type { BossAbilityCast, BossAbilitiesResponse } from '@/types/bossAbilities'
import { hasWarcraftLogsCredentials, queryWarcraftLogs, WclError } from '@/lib/warcraftLogs'

// Guide embeds fetch this on every page view, and the top log rarely changes within hours,
// so successful responses are kept in memory per encounter + difficulty.
const CACHE_TTL_MS = 6 * 60 * 60 * 1000
const responseCache = new Map<string, { body: BossAbilitiesResponse; expiresAt: number }>()

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
    if (!hasWarcraftLogsCredentials()) {
      return NextResponse.json(
        { error: 'Warcraft Logs API credentials are not configured' },
        { status: 500 }
      )
    }

    const encounterId = Number(request.nextUrl.searchParams.get('encounterId') || 3470)
    const difficulty = Number(request.nextUrl.searchParams.get('difficulty') || 5)

    if (!Number.isFinite(encounterId) || encounterId <= 0) {
      return NextResponse.json(emptyResponse(encounterId, difficulty, 'Invalid encounterId'))
    }

    const cacheKey = `${encounterId}:${difficulty}`
    const cached = responseCache.get(cacheKey)
    if (cached && Date.now() < cached.expiresAt) {
      return NextResponse.json(cached.body)
    }

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
    // Early in a season some encounters have no Mythic logs yet — fall back to Heroic.
    const HEROIC = 4
    const difficultiesToTry = difficulty === 5 ? [5, HEROIC] : [difficulty]
    let usedDifficulty = difficulty
    let encounterName = ''
    let rankings: any[] = []
    for (const tryDifficulty of difficultiesToTry) {
      const rankingsResp = await queryWarcraftLogs('rankings', rankingsQuery, {
        encounterId,
        difficulty: tryDifficulty,
      })
      const encounter = rankingsResp?.data?.worldData?.encounter
      encounterName = encounter?.name ?? encounterName
      rankings = encounter?.characterRankings?.rankings ?? []
      if (rankings.length) {
        usedDifficulty = tryDifficulty
        break
      }
    }
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
        ...emptyResponse(
          encounterId,
          usedDifficulty,
          'Top ranking missing report code or fight ID'
        ),
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
    const fightResp = await queryWarcraftLogs('fight+actors', fightActorsQuery, {
      code: reportCode,
      fightID,
    })

    const report = fightResp?.data?.reportData?.report
    const fight = report?.fights?.[0]
    const actors: Array<{ id: number; name: string; subType: string; gameID: number }> =
      report?.masterData?.actors ?? []
    const abilityCatalog: Array<{ gameID: number; name: string; icon?: string }> =
      report?.masterData?.abilities ?? []
    const abilityNameById = new Map<number, string>()
    // WCL icon filenames match Wowhead's (e.g. "spell_nature_starfall.jpg"); boss spells
    // aren't on our spell CDN, so the client needs these to render an icon.
    const abilityIconById = new Map<number, string>()
    for (const a of abilityCatalog) {
      if (typeof a?.gameID !== 'number') continue
      if (a?.name) abilityNameById.set(a.gameID, a.name)
      const icon = a?.icon?.replace(/\.jpg$/i, '')
      if (icon && icon !== 'inv_misc_questionmark') abilityIconById.set(a.gameID, icon)
    }

    if (!fight || typeof fight.startTime !== 'number' || typeof fight.endTime !== 'number') {
      return NextResponse.json({
        ...emptyResponse(encounterId, usedDifficulty, 'Fight data unavailable'),
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
        ...emptyResponse(encounterId, usedDifficulty, 'No boss actors in report'),
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
    const eventsResp = await queryWarcraftLogs('events', eventsQuery, {
      code: reportCode,
      fightID,
      startTime: fight.startTime,
      endTime: fight.endTime,
    })
    const allEvents: Array<Record<string, any>> =
      eventsResp?.data?.reportData?.report?.events?.data ?? []
    const bossActorIds = new Set(bossActors.map((a) => a.id))
    const eventBatches = [allEvents.filter((e) => bossActorIds.has(Number(e?.sourceID)))]

    // Group by ability name
    // The earliest-cast ID represents the group for its icon and tooltip.
    // Merge near-simultaneous casts.
    const DEDUPE_WINDOW_S = 0.5
    const grouped = new Map<
      string,
      {
        spellId: number
        spellIds: number[]
        icon?: string
        timestamps: number[]
      }
    >()
    for (const batch of eventBatches) {
      if (!Array.isArray(batch)) continue
      for (const evt of batch) {
        if (evt?.type !== 'cast') continue
        const abilityId: number | undefined = evt?.abilityGameID
        if (!abilityId) continue
        const ts = (Number(evt.timestamp) - fight.startTime) / 1000
        if (!Number.isFinite(ts)) continue
        const rounded = Math.round(ts * 10) / 10
        const name = abilityNameById.get(abilityId) || `Ability ${abilityId}`
        const existing = grouped.get(name)
        if (existing) {
          if (!existing.spellIds.includes(abilityId)) existing.spellIds.push(abilityId)
          existing.icon ??= abilityIconById.get(abilityId)
          const lastTs = existing.timestamps[existing.timestamps.length - 1]
          if (Math.abs(rounded - lastTs) < DEDUPE_WINDOW_S) continue
          existing.timestamps.push(rounded)
        } else {
          grouped.set(name, {
            spellId: abilityId,
            spellIds: [abilityId],
            icon: abilityIconById.get(abilityId),
            timestamps: [rounded],
          })
        }
      }
    }

    const abilities: BossAbilityCast[] = Array.from(grouped.entries())
      .map(([name, { spellId, spellIds, icon, timestamps }]) => ({
        key: `boss-${spellId}`,
        spellId,
        spellIds,
        name,
        icon,
        timestamps: timestamps.slice().sort((a, b) => a - b),
      }))
      .filter((a) => a.timestamps.length > 0)
      .sort((a, b) => a.timestamps[0] - b.timestamps[0])

    const body: BossAbilitiesResponse = {
      encounter: { id: encounterId, name: encounterName },
      difficulty: usedDifficulty,
      fightLengthSeconds: Math.round((fight.endTime - fight.startTime) / 1000),
      reportCode,
      fightID,
      abilities,
    }
    responseCache.set(cacheKey, { body, expiresAt: Date.now() + CACHE_TTL_MS })
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
