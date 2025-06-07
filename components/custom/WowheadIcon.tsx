import { fetchWowheadData } from 'app/api/wowhead-data/server-function'
import Image from 'next/image'

interface WowheadIconProps {
  id: string
  type: string
  name: string
  beta?: boolean
  url?: string
  noLink?: boolean
  noMargin?: boolean
  iconId?: string
  iconSize?: number
  fill?: boolean
}

export default async function WowheadIcon({
  id,
  type,
  name,
  beta = false,
  url = '',
  iconSize = 16,
  noLink = false,
  noMargin = false,
  iconId,
  fill = false,
}: WowheadIconProps) {
  const whUrl = url !== '' ? url : `https://www.wowhead.com/${beta ? 'beta/' : ''}${type}=${id}`

  let imageUrl: string

  if (process.env.NODE_ENV === 'test') {
    imageUrl = 'https://wow.zamimg.com/images/wow/icons/large/ability_druid_starfall.jpg'
  } else {
    if (!iconId) {
      try {
        const data = await fetchWowheadData({
          id,
          type,
          name,
          beta,
          url,
        })
        iconId = data.icon
      } catch (error: any) {
        console.warn(`Error fetching icon for ${type}=${id}: ${error.message || 'Unknown error'}`)
      }
    }
    imageUrl = iconId ? `https://wow.zamimg.com/images/wow/icons/large/${iconId}.jpg` : ''
  }

  const image = iconId ? (
    <Image
      src={imageUrl}
      alt={`${name} icon`}
      width={fill ? undefined : iconSize}
      height={fill ? undefined : iconSize}
      fill={fill}
      className={fill ? 'object-contain' : `my-0 inline-block ${!noMargin && 'mr-1'}`}
    />
  ) : (
    <span
      className={
        fill
          ? 'flex h-full w-full items-center justify-center rounded-xs bg-gray-200'
          : `my-0 inline-block rounded-xs bg-gray-200 ${!noMargin && 'mr-1'}`
      }
      style={fill ? {} : { width: `${iconSize}px`, height: `${iconSize}px` }}
      title={`${name} (icon unavailable)`}
    />
  )

  // Return fallback if fetch fails or no icon is found
  return noLink ? (
    <div className="relative aspect-square h-full w-auto shrink-0">{image}</div>
  ) : (
    <a href={whUrl} className="relative inline-block aspect-square h-full w-auto shrink-0">
      {image}
    </a>
  )
}
