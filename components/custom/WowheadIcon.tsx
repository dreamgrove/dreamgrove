import { fetchWowheadData } from 'app/api/wowhead-data/server-function'
import Image from 'next/image'

interface WowheadIconProps {
  id: string
  type: string
  name: string
  beta?: boolean
  url?: string
  size?: number
  noLink?: boolean
  noMargin?: boolean
  iconId?: string
}

export default async function WowheadIcon({
  id,
  type,
  name,
  beta = false,
  url = '',
  size = 16,
  noLink = false,
  noMargin = false,
  iconId,
}: WowheadIconProps) {
  const whUrl = url !== '' ? url : `https://www.wowhead.com/${beta ? 'beta/' : ''}${type}=${id}`

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

  const imageUrl = `https://wow.zamimg.com/images/wow/icons/large/${iconId}.jpg`
  const image = (
    <Image
      src={imageUrl}
      alt={`${name} icon`}
      width={size}
      height={size}
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
