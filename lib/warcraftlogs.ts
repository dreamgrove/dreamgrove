import axios from 'axios'

/**
 * Warcraft Logs API integration utilities
 */

/**
 * Fetch an access token from the Warcraft Logs API
 * Uses the client credentials flow for public API access
 */
export async function getWarcraftLogsToken() {
  try {
    const response = await axios.get('/api/warcraft-logs/token')
    return response.data.access_token
  } catch (error) {
    console.error('Error fetching Warcraft Logs API token:', error)
    throw new Error('Failed to get access token')
  }
}

/**
 * Execute a GraphQL query against the Warcraft Logs API
 */
export async function executeWarcraftLogsQuery(query: string, variables = {}) {
  try {
    // First get the token
    const token = await getWarcraftLogsToken()

    // Then execute the query
    const response = await axios.post(
      '/api/warcraft-logs/query',
      { query, variables },
      {
        headers: {
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

/**
 * Predefined GraphQL queries
 */
export const queries = {
  // Get expansion and zone data
  getWorldData: `
    query {
      worldData {
        expansions {
          id
          name
          zones {
            id
            name
            encounters {
              id
              name
            }
          }
        }
      }
    }
  `,

  // Get report data by code
  getReport: (code: string) => `
    query {
      reportData {
        report(code: "${code}") {
          title
          startTime
          endTime
          fights {
            id
            name
            difficulty
            startTime
            endTime
          }
        }
      }
    }
  `,

  // Get character data
  getCharacter: (name: string, serverSlug: string, serverRegion: string) => `
    query {
      characterData {
        character(name: "${name}", serverSlug: "${serverSlug}", serverRegion: "${serverRegion}") {
          name
          id
          server {
            name
            region {
              name
            }
          }
          classID
        }
      }
    }
  `,

  // Get rankings for a specific encounter (Balance Druid DPS)
  getBalanceDruidRankings: (encounterId: number, difficulty: number = 5, page: number = 1) => `
    query {
      worldData {
        encounter(id: ${encounterId}) {
          name
          characterRankings(
            className: "Druid",
            specName: "Balance",
            difficulty: ${difficulty},
            metric: dps,
            page: ${page}
          )
        }
      }
    }
  `,
}

/**
 * Helper for fetching fight data from a specific report
 */
export async function getFightData(reportCode: string) {
  try {
    const query = queries.getReport(reportCode)
    const response = await executeWarcraftLogsQuery(query)
    return response.data.reportData.report
  } catch (error) {
    console.error('Error fetching fight data:', error)
    throw new Error('Failed to fetch fight data')
  }
}
