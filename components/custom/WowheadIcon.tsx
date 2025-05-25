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
}: WowheadIconProps) {
  const whUrl = url !== '' ? url : `https://www.wowhead.com/${beta ? 'beta/' : ''}${type}=${id}`

  let imageUrl: string

  if (process.env.NODE_ENV === 'test') {
    imageUrl = 'https://wow.zamimg.com/images/wow/icons/large/ability_druid_starfall.jpg'
  } else {
    if (iconId === undefined) {
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
    imageUrl = `https://wow.zamimg.com/images/wow/icons/large/${iconId}.jpg`
  }

  const image = (
    <Image
      src={imageUrl}
      alt={`${name} icon`}
      width={iconSize}
      height={iconSize}
      className={`my-0 inline-block ${!noMargin && 'mr-1'}`}
    />
  )

  // Return fallback if fetch fails or no icon is found
  return noLink ? (
    image
  ) : (
    <a href={whUrl} className="inline">
      {image}
    </a>
  )
}
