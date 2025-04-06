import { NextRequest, NextResponse } from 'next/server'
import { fetchWowheadData } from '../wowhead-data/server-function'

export async function GET(request: NextRequest) {
  // Get query parameters
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id') || ''
  const type = searchParams.get('type')
  const name = searchParams.get('name') || ''
  const beta = searchParams.get('beta') === 'true'
  const url = searchParams.get('url') || ''

  // Validate required parameters
  if (!type && !url) {
    return NextResponse.json({ error: 'Either type or url parameter is required' }, { status: 400 })
  }

  try {
    // Call the existing server function
    const data = await fetchWowheadData({
      id,
      type: type || '',
      name,
      beta,
      url,
    })

    // Return the data
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error fetching Wowhead data:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch Wowhead data' },
      { status: 500 }
    )
  }
}

// Configure CORS and response caching
export const config = {
  runtime: 'edge',
}
