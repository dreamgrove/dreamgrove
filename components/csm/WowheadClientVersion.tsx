import Image from 'next/image'
import { useEffect, useState, memo, useCallback, useMemo } from 'react'
import { wowheadCache } from './wowheadCache'
import WowheadClientIcon from './WowheadClientIcon'
import { getWowheadInfo, qualityToColor } from 'lib/wowhead-api'

function formatUrl(url) {
  const parts = url.split('/')
  const lastPart = parts.pop()
  const formatted = lastPart
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
  return formatted
}

function extractIdFromUrl(url) {
  const parts = url.split('/')
  const lastPart = parts[parts.length - 1]
  const id = lastPart.split('-')[0]
  return id
}

// A minimal version of the Wowhead component that uses client-side fetching
function WowheadClientVersion({
  id,
  name,
  type,
  disabled = false,
  noIcon = false,
  beta = false,
  url = '',
  size = 16,
  showLabel = true,
}) {
  // Use a cache key that's stable across component rerenders
  const cacheKey = useMemo(() => {
    const whUrl =
      url !== '' ? url : `https://www.wowhead.com/${beta ? 'beta/' : ''}${type}=${id || ''}`
    return wowheadCache.generateKey(whUrl)
  }, [id, type, beta, url])

  const [display, setDisplay] = useState(name || '')
  const [linkColor, setLinkColor] = useState('#d57f43')
  const [quality, setQuality] = useState(-1)
  const [isLoading, setIsLoading] = useState(false)

  let displayId = id

  // Handle case when id is not provided
  if (!id && type === 'spell' && typeof window !== 'undefined') {
    // This would need to be adapted to client-side access of spellData
    // For now, just use the URL if provided
    if (url) {
      displayId = extractIdFromUrl(url)
    }
  }

  const whUrl =
    url !== '' ? url : `https://www.wowhead.com/${beta ? 'beta/' : ''}${type}=${displayId}`

  const fetchWowhead = useCallback(async () => {
    if (typeof window === 'undefined') return

    // First check our client-side cache
    const cachedData = wowheadCache.get(cacheKey)
    if (cachedData) {
      // Use cached data
      if (cachedData.quality !== undefined) {
        setQuality(cachedData.quality)
      }

      if (cachedData.linkColor) {
        setLinkColor(cachedData.linkColor)
      }

      if (!name && cachedData.display) {
        setDisplay(cachedData.display)
      }

      return // Skip the fetch if we have cached data
    }

    setIsLoading(true)

    try {
      // Use our new API client instead of direct server function
      const data = await getWowheadInfo({
        id: id || '',
        type,
        name: name || '',
        beta,
        url: url || '',
      })

      // Prepare the processed data for caching
      const processedData: {
        url: string
        timestamp: number
        display: string
        quality?: number
        linkColor?: string
        icon?: string
      } = {
        url: whUrl,
        timestamp: Date.now(),
        display: data.display || name,
      }

      // Set display name from API
      if (!name && data.display) {
        setDisplay(data.display)
      }

      // Set quality and link color for items
      if (data.quality !== undefined) {
        processedData.quality = data.quality
        processedData.linkColor = qualityToColor[data.quality] || '#d57f43'

        setQuality(data.quality)
        setLinkColor(qualityToColor[data.quality] || '#d57f43')
      }

      // Store icon if available
      if (data.icon) {
        processedData.icon = data.icon
      }

      // Store in our client-side cache
      wowheadCache.set(cacheKey, processedData)
    } catch (error: any) {
      console.warn(
        `Failed to fetch from Wowhead for ${type}=${displayId}: ${error.message || 'Unknown error'}`
      )
      // Use provided name or displayId as fallback
      setDisplay(name || `${type}-${displayId}`)
    } finally {
      setIsLoading(false)
    }
  }, [whUrl, type, displayId, name, cacheKey, beta, url])

  useEffect(() => {
    // Only run fetch if we're in the browser
    if (typeof window !== 'undefined') {
      fetchWowhead()
    }

    // Clean up expired cache entries occasionally
    if (Math.random() < 0.1) {
      // 10% chance on each mount
      wowheadCache.cleanup()
    }
  }, [fetchWowhead])

  const icon = noIcon ? null : (
    <WowheadClientIcon
      id={displayId}
      type={type}
      name={display}
      beta={beta}
      url={url}
      noLink={true}
      size={size}
    />
  )

  return disabled ? (
    <div className={`inline decoration-2 q${quality}`} style={{ color: linkColor }}>
      {icon}
      {showLabel && (
        <span className="align-middle text-wrap break-words">
          {isLoading ? '(loading...)' : display}
        </span>
      )}
    </div>
  ) : (
    <a
      href={whUrl}
      className={`inline decoration-2 q${quality}`}
      style={{ color: linkColor, textWrap: 'nowrap' }}
    >
      {type != 'npc' && icon}
      {showLabel && (
        <span className="align-middle text-wrap break-words">
          {isLoading ? '(loading...)' : display}
        </span>
      )}
    </a>
  )
}

export default memo(WowheadClientVersion, (prevProps, nextProps) => {
  // Only re-render if id changes
  return prevProps.id === nextProps.id
})
