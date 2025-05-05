import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

/**
 * API route to handle Warcraft Logs API GraphQL queries
 */
export async function POST(request: NextRequest) {
  try {
    const { query, variables } = await request.json()

    // Get the token
    const tokenResponse = await fetch(new URL('/api/warcraft-logs/token', request.url), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json()
      return NextResponse.json(
        { error: 'Failed to get access token', details: errorData },
        { status: 500 }
      )
    }

    const tokenData = await tokenResponse.json()
    const token = tokenData.access_token

    // Make a real GraphQL request to the Warcraft Logs API
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

    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error('Error executing GraphQL query:', error)
    return NextResponse.json(
      { error: 'Failed to execute GraphQL query', details: error?.message || 'Unknown error' },
      { status: 500 }
    )
  }
}
