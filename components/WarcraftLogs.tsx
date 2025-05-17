'use client'
import { useState, useEffect } from 'react'
import { executeWarcraftLogsQuery, queries } from 'lib/warcraftlogs'

/**
 * WarcraftLogs component for testing the initial API connection
 * Uses the utility functions to interact with the Warcraft Logs API
 */
export default function WarcraftLogs() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any>(null)
  const [matchingZone, setMatchingZone] = useState<any>(null)
  const [encounterIds, setEncounterIds] = useState<number[]>([])
  const [rankings, setRankings] = useState<any>(null)
  const [queryType, setQueryType] = useState<
    'worldData' | 'reportData' | 'characterData' | 'druidRankings' | 'druidCasts'
  >('worldData')
  const [reportCode, setReportCode] = useState<string>('mock-report-code')
  const [connectionStatus, setConnectionStatus] = useState<'untested' | 'success' | 'failed'>(
    'untested'
  )

  // Define the proper type for castsData
  interface CastInfo {
    id: string
    name: string
    timestamps: number[]
  }

  interface ReportCastData {
    fight: number
    reportCode: string
    characterName: string
    serverName: string
    dps: number
    casts: CastInfo[]
  }

  const [castsData, setCastsData] = useState<ReportCastData[]>([])
  const [processingReport, setProcessingReport] = useState<boolean>(false)
  const [processedReportsCount, setProcessedReportsCount] = useState<number>(0)

  const raidId = 42
  const vexieEncounterId = 3009 // Vexie and the Geargrinders
  const mythicDifficulty = 5
  const rankingsPage = 1 // First page of results
  const maxReportsToProcess = 3

  // Spells to track (from cursor/spells.json)
  const spellsToTrack = [
    { id: 'ca', spellId: 194223, name: 'Celestial Alignment' },
    { id: 'fon', spellId: 205636, name: 'Force of Nature' },
    { id: 'convoke', spellId: 391528, name: 'Convoke the Spirits' },
  ]

  // Format timestamp in seconds to mm:ss format
  const formatTimestamp = (ms: number): string => {
    // Convert milliseconds to seconds and return as a decimal number with 1 decimal place
    const seconds = (ms / 1000).toFixed(1)
    return `${seconds}s`
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setConnectionStatus('untested')
        setData(null)
        setMatchingZone(null)
        setEncounterIds([])
        setRankings(null)
        setCastsData([])
        setProcessedReportsCount(0)
        setError(null)

        let response: any

        // Use the appropriate query based on the selected type
        if (queryType === 'worldData') {
          response = await executeWarcraftLogsQuery(queries.getWorldData)

          // Find the zone with id matching raidId
          if (response.data?.worldData?.expansions) {
            let foundZone = null

            // Loop through all expansions and their zones to find a match
            for (const expansion of response.data.worldData.expansions) {
              const matchZone = expansion.zones.find((zone: any) => zone.id === raidId)
              if (matchZone) {
                foundZone = {
                  ...matchZone,
                  expansionName: expansion.name,
                  expansionId: expansion.id,
                }

                // Extract encounter IDs into an array
                const ids = matchZone.encounters?.map((encounter: any) => encounter.id) || []
                setEncounterIds(ids)

                break
              }
            }

            setMatchingZone(foundZone)
          }
        } else if (queryType === 'reportData') {
          response = await executeWarcraftLogsQuery(queries.getReport(reportCode))
        } else if (queryType === 'characterData') {
          response = await executeWarcraftLogsQuery(
            queries.getCharacter('MockCharacter', 'mock-server', 'us')
          )
        } else if (queryType === 'druidRankings') {
          response = await executeWarcraftLogsQuery(
            queries.getBalanceDruidRankings(vexieEncounterId, mythicDifficulty, rankingsPage)
          )

          // Extract and process the rankings data
          if (response.data?.worldData?.encounter) {
            setRankings(response.data.worldData.encounter)
          }
        } else if (queryType === 'druidCasts') {
          // Use the new API route instead of making multiple GraphQL queries
          setProcessingReport(true)

          // Build URL with query parameters
          const apiUrl = `/api/warcraft-logs/druid-casts?encounterId=${vexieEncounterId}&raidId=${raidId}&difficulty=${mythicDifficulty}&maxReports=${maxReportsToProcess}`

          // Fetch data from our API
          const apiResponse = await fetch(apiUrl)

          if (!apiResponse.ok) {
            throw new Error(`API response error: ${apiResponse.status} ${apiResponse.statusText}`)
          }

          const druidCastsData = await apiResponse.json()

          // Set the data for the component
          setRankings({
            name: druidCastsData.encounter.name,
            characterRankings: {
              rankings: druidCastsData.spellCasts.map((report: any) => ({
                name: report.characterName,
                server: report.serverName,
                amount: report.dps,
                // Add any additional fields needed for rendering
              })),
            },
          })

          // Set cast data directly from the API response
          setCastsData(druidCastsData.spellCasts)

          // Create a response object that resembles what we would get from executeWarcraftLogsQuery
          response = {
            data: {
              worldData: {
                encounter: {
                  name: druidCastsData.encounter.name,
                  characterRankings: {
                    rankings: druidCastsData.spellCasts.map((report: any) => ({
                      name: report.characterName,
                      server: report.serverName,
                      amount: report.dps,
                    })),
                  },
                },
              },
            },
          }

          // Update processing state
          setProcessingReport(false)
          setProcessedReportsCount(druidCastsData.spellCasts.length)
        }

        // Set the data
        setData(response.data)
        setConnectionStatus('success')
        setLoading(false)
      } catch (err: any) {
        console.error('Error fetching data from Warcraft Logs API:', err)
        setError(err?.message || 'Failed to fetch data from Warcraft Logs API')
        setConnectionStatus('failed')
        setLoading(false)
        setProcessingReport(false)
      }
    }

    fetchData()
  }, [queryType, reportCode])

  return (
    <div className="rounded-lg border bg-gray-50 p-4 dark:bg-gray-800">
      <h2 className="mb-4 text-xl font-bold">Warcraft Logs API Test</h2>

      <div className="mb-4 flex items-center justify-between">
        <div>
          <label className="mb-2 block text-sm font-medium">Query Type:</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setQueryType('worldData')}
              className={`rounded px-3 py-1 ${
                queryType === 'worldData'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              World Data
            </button>
            <button
              onClick={() => setQueryType('reportData')}
              className={`rounded px-3 py-1 ${
                queryType === 'reportData'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              Report Data
            </button>
            <button
              onClick={() => setQueryType('characterData')}
              className={`rounded px-3 py-1 ${
                queryType === 'characterData'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              Character Data
            </button>
            <button
              onClick={() => setQueryType('druidRankings')}
              className={`rounded px-3 py-1 ${
                queryType === 'druidRankings'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              Balance Druid Rankings
            </button>
            <button
              onClick={() => setQueryType('druidCasts')}
              className={`rounded px-3 py-1 ${
                queryType === 'druidCasts'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              Balance Druid Casts
            </button>
          </div>
        </div>

        <div className="text-sm">
          <span className="font-medium">Connection Status: </span>
          {connectionStatus === 'untested' && <span className="text-gray-500">Not Tested</span>}
          {connectionStatus === 'success' && <span className="text-green-500">Connected ✓</span>}
          {connectionStatus === 'failed' && <span className="text-red-500">Failed ✗</span>}
        </div>
      </div>

      {queryType === 'reportData' && (
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">Report Code:</label>
          <input
            type="text"
            value={reportCode}
            onChange={(e) => setReportCode(e.target.value)}
            className="w-full max-w-md rounded-sm border bg-white px-3 py-2 dark:bg-gray-700"
            placeholder="Enter report code"
          />
        </div>
      )}

      {loading && (
        <div className="py-4 text-center">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="!absolute -m-px! h-px! w-px! overflow-hidden! border-0! p-0! whitespace-nowrap! [clip:rect(0,0,0,0)]!">
              Loading...
            </span>
          </div>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Making live API request to Warcraft Logs...
          </p>
        </div>
      )}

      {processingReport && (
        <div className="py-4 text-center">
          <div className="mb-2 flex justify-center">
            <div className="h-2 w-full max-w-md overflow-hidden rounded-full bg-gray-300">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${(processedReportsCount / maxReportsToProcess) * 100}%` }}
              ></div>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Processing reports: {processedReportsCount} of {maxReportsToProcess}
          </p>
        </div>
      )}

      {error && (
        <div className="rounded bg-red-100 p-3 text-red-500 dark:bg-red-900">
          <p className="font-semibold">Error connecting to Warcraft Logs API</p>
          <p>{error}</p>
        </div>
      )}

      {queryType === 'worldData' && matchingZone && (
        <div className="mt-4 rounded-lg border bg-white p-4 shadow-xs dark:bg-gray-700">
          <h3 className="mb-2 text-lg font-semibold">Matching Zone (ID: {raidId})</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Zone Name:</p>
              <p className="font-medium">{matchingZone.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Expansion:</p>
              <p className="font-medium">{matchingZone.expansionName}</p>
            </div>
          </div>

          <div className="mt-4">
            <p className="mb-2 text-sm font-medium">
              Encounters ({matchingZone.encounters?.length || 0}):
            </p>
            {matchingZone.encounters && matchingZone.encounters.length > 0 ? (
              <ul className="list-inside list-disc space-y-1">
                {matchingZone.encounters.map((encounter: any) => (
                  <li key={encounter.id}>
                    {encounter.name}{' '}
                    <span className="text-xs text-gray-500">(ID: {encounter.id})</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No encounters found.</p>
            )}
          </div>

          <div className="mt-4">
            <p className="mb-2 text-sm font-medium">Encounter IDs Array:</p>
            <pre className="rounded bg-gray-100 p-2 text-sm dark:bg-gray-800">
              {JSON.stringify(encounterIds, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {queryType === 'druidRankings' && rankings && (
        <div className="mt-4 rounded-lg border bg-white p-4 shadow-xs dark:bg-gray-700">
          <h3 className="mb-2 text-lg font-semibold">
            Balance Druid Rankings for {rankings.name} (Page {rankingsPage})
          </h3>
          <div className="mb-4 rounded-sm bg-blue-50 p-3 dark:bg-blue-900/30">
            <p className="text-sm">
              <span className="font-medium">Encounter ID:</span> {vexieEncounterId}
            </p>
            <p className="text-sm">
              <span className="font-medium">Difficulty:</span> Mythic
            </p>
            <p className="text-sm">
              <span className="font-medium">Metric:</span> DPS
            </p>
          </div>

          {rankings.characterRankings &&
          rankings.characterRankings.rankings &&
          rankings.characterRankings.rankings.length > 0 ? (
            <div className="mt-4">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th
                        scope="col"
                        className="px-3 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                      >
                        Rank
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                      >
                        Character
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                      >
                        Server
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                      >
                        DPS
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                      >
                        iLvl
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                      >
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                    {rankings.characterRankings.rankings.map((rank: any, index: number) => (
                      <tr
                        key={index}
                        className={
                          index % 2 === 0
                            ? 'bg-white dark:bg-gray-900'
                            : 'bg-gray-50 dark:bg-gray-800'
                        }
                      >
                        <td className="px-3 py-2 text-sm whitespace-nowrap text-gray-900 dark:text-white">
                          {rank.rank}
                        </td>
                        <td className="px-3 py-2 text-sm whitespace-nowrap">
                          <span className="font-medium text-blue-600 dark:text-blue-400">
                            {rank.name}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-sm whitespace-nowrap text-gray-700 dark:text-gray-300">
                          {rank.server && typeof rank.server === 'object'
                            ? rank.server.name
                            : rank.server || 'N/A'}
                        </td>
                        <td className="px-3 py-2 text-sm font-medium whitespace-nowrap text-green-600 dark:text-green-400">
                          {Math.round(rank.amount).toLocaleString()}
                        </td>
                        <td className="px-3 py-2 text-sm whitespace-nowrap text-gray-700 dark:text-gray-300">
                          {rank.ilvl || 'N/A'}
                        </td>
                        <td className="px-3 py-2 text-sm whitespace-nowrap text-gray-700 dark:text-gray-300">
                          {rank.startTime ? new Date(rank.startTime).toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No rankings data available.</p>
          )}
        </div>
      )}

      {queryType === 'druidCasts' && castsData.length > 0 && (
        <div className="mt-4 rounded-lg border bg-white p-4 shadow-xs dark:bg-gray-700">
          <h3 className="mb-2 text-lg font-semibold">
            Balance Druid Spell Casts for {rankings?.name}
          </h3>
          <div className="mb-4 rounded-sm bg-blue-50 p-3 dark:bg-blue-900/30">
            <p className="text-sm">
              <span className="font-medium">Encounter ID:</span> {vexieEncounterId}
            </p>
            <p className="text-sm">
              <span className="font-medium">Difficulty:</span> Mythic
            </p>
            <p className="text-sm">
              <span className="font-medium">Reports Analyzed:</span> {castsData.length}
            </p>
          </div>

          <div className="mt-4 space-y-6">
            {castsData.map((report, reportIndex) => (
              <div key={reportIndex} className="rounded border p-4">
                <h4 className="mb-2 font-medium">
                  Report #{report.fight}: {report.characterName} ({report.serverName}) -
                  <span className="ml-2 text-green-600">{report.dps.toLocaleString()} DPS</span>
                </h4>

                <div className="ml-4 space-y-4">
                  {report.casts.map((spellCast: any, spellIndex: number) => (
                    <div key={spellIndex}>
                      <h5 className="mb-1 font-medium">
                        {spellCast.name} ({spellCast.id}):
                      </h5>
                      <div className="ml-4">
                        {spellCast.timestamps.length === 0 ? (
                          <p className="text-sm text-gray-500">No casts</p>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {spellCast.timestamps.map((timestamp: number, castIndex: number) => (
                              <span
                                key={castIndex}
                                className="inline-block rounded-sm bg-blue-100 px-2 py-1 text-xs dark:bg-blue-900"
                              >
                                Cast {castIndex + 1}: {timestamp}s
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-sm border bg-gray-50 p-4 dark:bg-gray-800">
            <h4 className="mb-3 font-medium">Summary Statistics</h4>

            <div className="grid gap-4 md:grid-cols-3">
              {spellsToTrack.map((spell, index) => {
                // Calculate stats for this spell
                const totalCasts = castsData.reduce((sum, report) => {
                  const spellData = report.casts.find((s: any) => s.id === spell.id)
                  return sum + (spellData ? spellData.timestamps.length : 0)
                }, 0)

                const averageCasts = (totalCasts / castsData.length).toFixed(2)

                return (
                  <div key={index} className="rounded bg-white p-3 shadow-xs dark:bg-gray-700">
                    <h5 className="font-medium">{spell.name}</h5>
                    <div className="mt-2 space-y-1 text-sm">
                      <p>
                        Total Casts: <span className="font-medium">{totalCasts}</span>
                      </p>
                      <p>
                        Average per Fight: <span className="font-medium">{averageCasts}</span>
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {data && (
        <div className="mt-4">
          <h3 className="mb-2 font-semibold">Full Data Received:</h3>
          <pre className="max-h-96 overflow-auto rounded-sm bg-gray-100 p-3 dark:bg-gray-700">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-6 border-t pt-4 text-sm text-gray-600 dark:text-gray-400">
        <p>Implementation Notes:</p>
        <ul className="mt-2 list-disc pl-5">
          <li>
            This is making <strong>real API requests</strong> to the Warcraft Logs API
          </li>
          <li>Server-side API routes handle the OAuth flow securely</li>
          <li>Client credentials flow is used for the public API endpoints</li>
          <li>
            These queries demonstrate the structure of data that will be integrated into the
            timeline planner
          </li>
        </ul>
      </div>
    </div>
  )
}
