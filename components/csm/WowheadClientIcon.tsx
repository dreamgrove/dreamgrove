import { memo, useState, useEffect } from 'react'
import Image from 'next/image'
import { getWowheadInfo } from '@/lib/wowhead/client'
import { buildWowheadUrl } from '@/lib/wowhead/urls'
import type { PageLocale } from '@/lib/pageLocale'

interface WowheadIconProps {
  id: string
  type: string
  name: string
  beta?: boolean
  url?: string
  iconSize?: number
  noLink?: boolean
  noMargin?: boolean
  locale?: PageLocale
}

function WowheadClientIcon({
  id,
  type,
  name,
  beta = false,
  url = '',
  iconSize: size,
  noLink = false,
  noMargin = false,
  locale,
}: WowheadIconProps) {
  const whUrl = url !== '' ? url : buildWowheadUrl(type, id, name, beta, locale)

  // Spell icons are hosted on our own CDN keyed directly by spell id, so the URL is
  // deterministic and needs no Wowhead lookup.
  const isHostedSpell = type === 'spell' && !!id

  const [iconFilename, setIconFilename] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  // Hide the icon only if the browser actually fails to load it
  const [failed, setFailed] = useState(false)

  // Load icon filename on mount for non-spell types (items/npcs return a Wowhead icon slug).
  useEffect(() => {
    if (isHostedSpell) return
    if (iconFilename) return

    const fetchIcon = async () => {
      if (typeof window === 'undefined') return

      setIsLoading(true)

      try {
        const data = await getWowheadInfo({
          id: id || '',
          type,
          name: name || '',
          beta,
          url: url || '',
        })

        if (data.icon) setIconFilename(data.icon)
      } catch (err) {
        console.warn(`Error fetching icon for ${type}=${id}:`, err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchIcon()
  }, [id, type, beta, isHostedSpell, iconFilename, name, url])

  const imageSrc = isHostedSpell
    ? `https://cdn.simcode.dev/${id}.jpg`
    : iconFilename
      ? `https://wow.zamimg.com/images/wow/icons/large/${iconFilename}.jpg`
      : null

  if (!size) {
    if (imageSrc && !failed) {
      return (
        <Image
          src={imageSrc}
          alt={`${name} icon`}
          fill={true}
          unoptimized
          onError={() => setFailed(true)}
        />
      )
    }
    return isLoading ? (
      <div className={`h-full w-full rounded-xs bg-neutral-800`} />
    ) : (
      <div
        className={`h-full w-full rounded-xs bg-gray-200`}
        title={`${name} (icon unavailable)`}
      />
    )
  }

  const fallbackImage = (
    <span
      className={`inline-block rounded-xs bg-gray-200 ${!noMargin && 'mr-1'}`}
      style={{ width: `${size}px`, height: `${size}px` }}
      title={`${name} (icon unavailable)`}
    />
  )

  const image =
    imageSrc && !failed ? (
      <Image
        src={imageSrc}
        alt={`${name} icon`}
        height={size}
        width={size}
        unoptimized
        onError={() => setFailed(true)}
        className="my-0 inline-block"
      />
    ) : isLoading ? (
      <span
        className={`inline-block rounded-xs bg-gray-700 ${!noMargin && 'mr-1'}`}
        style={{ width: `${size}px`, height: `${size}px` }}
      />
    ) : (
      fallbackImage
    )

  return noLink ? (
    image
  ) : (
    <a href={whUrl} className="inline">
      {image}
    </a>
  )
}

export default memo(WowheadClientIcon, (prevProps, nextProps) => {
  return (
    prevProps.id === nextProps.id &&
    prevProps.type === nextProps.type &&
    prevProps.iconSize === nextProps.iconSize
  )
})
