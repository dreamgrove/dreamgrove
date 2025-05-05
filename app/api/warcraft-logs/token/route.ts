import { NextResponse } from 'next/server'
import axios from 'axios'

/**
 * API route to handle Warcraft Logs API token requests
 * Uses the client credentials flow for public API access
 */
export async function GET() {
  try {
    // Get credentials from environment variables
    const clientId = process.env.WARCRAFT_LOGS_CLIENT_ID
    const clientSecret = process.env.WARCRAFT_LOGS_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      console.error('Missing Warcraft Logs API credentials in environment variables')
      return NextResponse.json({ error: 'Missing API credentials' }, { status: 500 })
    }

    // Make a real API call to get the token
    const tokenUrl = 'https://www.warcraftlogs.com/oauth/token'
    const response = await axios.post(tokenUrl, 'grant_type=client_credentials', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      auth: {
        username: clientId,
        password: clientSecret,
      },
    })

    // Return the actual token response
    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error('Error fetching Warcraft Logs API token:', error)
    return NextResponse.json(
      { error: 'Failed to get access token', details: error?.message || 'Unknown error' },
      { status: 500 }
    )
  }
}
