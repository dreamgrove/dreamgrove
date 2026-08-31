import Image from 'next/image'
import { useEffect, useState, memo, useCallback, useMemo } from 'react'
import { wowheadCache } from './wowheadCache'
import WowheadClientIcon from './WowheadClientIcon'
import { getWowheadInfo, qualityToColor } from 'lib/wowhead-api'
import { extractIdFromUrl } from 'app/api/wowhead-data/utils'
import spellData from '../../spellData.json'

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

  // Handle case when id is not provided: resolve the spell id from the name map
  // (mirrors the server Wowhead component) so `!SpellName!` still shows a real icon,
  // falling back to parsing the id out of an explicit url.
  if (!id && type === 'spell') {
    if (spellData[name]) {
      displayId = spellData[name]
    } else if (url) {
      displayId = extractIdFromUrl(url)
    }
  }

  const whUrl =
    url !== '' ? url : `https://www.wowhead.com/${beta ? 'beta/' : ''}${type}=${displayId}`

  const fetchWowhead = useCallback(async () => {
    if (typeof window === 'undefined') return

    const cachedData = wowheadCache.get(cacheKey)
    if (cachedData) {
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
      const data = await getWowheadInfo({
        id: id || '',
        type,
        name: name || '',
        beta,
        url: url || '',
      })

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

      if (!name && data.display) {
        setDisplay(data.display)
      }

      if (data.quality !== undefined) {
        processedData.quality = data.quality
        processedData.linkColor = qualityToColor[data.quality] || '#d57f43'

        setQuality(data.quality)
        setLinkColor(qualityToColor[data.quality] || '#d57f43')
      }

      if (data.icon) {
        processedData.icon = data.icon
      }

      wowheadCache.set(cacheKey, processedData)
    } catch (error: any) {
      console.warn(
        `Failed to fetch from Wowhead for ${type}=${displayId}: ${error.message || 'Unknown error'}`
      )
      setDisplay(name || `${type}-${displayId}`)
    } finally {
      setIsLoading(false)
    }
  }, [whUrl, type, displayId, name, cacheKey, beta, url])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      fetchWowhead()
    }

    // Clean up expired cache entries occasionally
    if (Math.random() < 0.1) {
      wowheadCache.cleanup()
    }
  }, [fetchWowhead])

  const icon = noIcon ? null : (
    <span className="wowhead-icon-wrap">
      <WowheadClientIcon
        id={displayId}
        type={type}
        name={display}
        beta={beta}
        url={url}
        noLink={true}
        size={size}
      />
    </span>
  )

  return disabled ? (
    <span
      className={`inline-flex items-baseline gap-1 decoration-2 q${quality}`}
      style={{ color: linkColor }}
    >
      {icon}
      {showLabel && (
        <span className="align-middle text-wrap break-words">
          {isLoading ? '(loading...)' : display}
        </span>
      )}
    </span>
  ) : (
    <a
      href={whUrl}
      className={`inline-flex items-baseline gap-1 decoration-2 q${quality}`}
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
  return prevProps.id === nextProps.id
})
